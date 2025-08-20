import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from 'stripe';

admin.initializeApp();

const db = admin.firestore();

// Create a Stripe customer when a new user is created in Firebase Auth
export const createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customerData = {
    email: user.email,
    // You can add other customer data here
  };

  await db.collection('customers').doc(user.uid).set(customerData);

  functions.logger.info(`Created Stripe customer for user: ${user.uid}`);
});

// Create a Stripe checkout session
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const priceId = data.priceId; // Assuming you pass a Stripe price ID from the frontend

  if (!priceId) {
    throw new functions.https.HttpsError('invalid-argument', 'Price ID is required.');
  }

  // Get the Stripe customer ID from your Firestore customer document
  const customerDoc = await db.collection('customers').doc(uid).get();
  const stripeCustomerId = customerDoc.data()?.stripeId; // Assuming the extension adds stripeId to the customer document

  if (!stripeCustomerId) {
       throw new functions.https.HttpsError('failed-precondition', 'Stripe customer not found.\nRun the createStripeCustomer function first.');
  }

  const stripe = new Stripe(functions.config().stripe.secret_key, {
    apiVersion: '2020-08-27',
  });

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: [\'card\'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: \'payment\',\n      success_url: `${functions.config().app.url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,\n      cancel_url: `${functions.config().app.url}/payment-cancel`,\n      metadata: {\n        userId: uid,\n        paymentType: \'wallet_topup\',\n      }\n    });\n\n    return { id: session.id };\n\n  } catch (error: any) {\n    functions.logger.error('Error creating checkout session:', error);\n    throw new functions.https.HttpsError('internal', 'Unable to create checkout session.', error.message);\n  }\n});

// Handle successful Stripe payments
export const handleSuccessfulPayment = functions.firestore
  .document(\'customers/{userId}/checkout_sessions/{sessionId}\')
  .onCreate(async (snapshot, context) => {\n    const session = snapshot.data();
    const userId = context.params.userId;

    if (session.payment_status === \'paid\') {
      const amountTotal = session.amount_total;
      const currency = session.currency;
      const metadata = session.metadata;

      functions.logger.info(`Successful payment received for user ${userId}:`, session);

      if (metadata?.paymentType === \'wallet_topup\') {
        const userWalletRef = db.doc(`users/${userId}/personalWallet`);

        try {
          await db.runTransaction(async (t) => {
            const userWalletDoc = await t.get(userWalletRef);
            const currentBalance = userWalletDoc.exists ? (userWalletDoc.data()?.balance || 0) : 0;
            const amountInUnits = amountTotal / 100;

            const newBalance = currentBalance + amountInUnits;

            if (userWalletDoc.exists) {
              t.update(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() });
            } else {
              t.set(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() });
            }
          });
          functions.logger.info(`Updated wallet balance for user ${userId} after successful top-up.`);

        } catch (error: any) {\n          functions.logger.error(`Error updating wallet balance for user ${userId}:`, error);\n        }\n      } else {
        functions.logger.info(`Received successful payment for user ${userId} with unknown purpose:`, metadata?.paymentType);\n      }\n    } else {
      functions.logger.warn(`Received non-paid checkout session event for user ${userId}:`, session.payment_status);\n    }
  });
