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

  const stripe = new Stripe(functions.config().stripe.secret_key, { // Ensure you have stripe.secret_key configured in Firebase functions config
    apiVersion: '2020-08-27', // Use a compatible API version
  });

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: [\'card\'],
      line_items: [
        {\n          price: priceId,\n          quantity: 1,\n        },\n      ],\n      mode: \'payment\',\n      success_url: `${functions.config().app.url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,\n      cancel_url: `${functions.config().app.url}/payment-cancel`,\n      metadata: { // Use metadata to pass information to the webhook
        userId: uid,
        paymentType: 'wallet_topup', // Indicate the purpose of the payment
        // Add other relevant metadata here (e.g., target wallet currency if different)
      }
    });

    return { id: session.id };

  } catch (error: any) {
    functions.logger.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Unable to create checkout session.', error.message);
  }
});

// Handle successful Stripe payments
export const handleSuccessfulPayment = functions.firestore
  .document('customers/{userId}/checkout_sessions/{sessionId}') // **NOTE:** Adjusted path - the Stripe extension usually writes to a subcollection under the customer
  .onCreate(async (snapshot, context) => {
    const session = snapshot.data();
    const userId = context.params.userId;

    // Ensure the session is complete and payment was successful
    if (session.payment_status === 'paid') {
      const amountTotal = session.amount_total; // Amount in the smallest currency unit (e.g., cents)
      const currency = session.currency;
      const metadata = session.metadata; // Access the metadata we added earlier

      functions.logger.info(`Successful payment received for user ${userId}:`, session);

      // Check if the payment was for a wallet top-up (based on metadata)
      if (metadata?.paymentType === 'wallet_topup') {
        // Implement logic to update the user's wallet balance
        const userWalletRef = db.doc(`users/${userId}/personalWallet`); // Adjust path if needed

        try {
          await db.runTransaction(async (t) => {
            const userWalletDoc = await t.get(userWalletRef);
            const currentBalance = userWalletDoc.exists ? (userWalletDoc.data()?.balance || 0) : 0;
            const amountInUnits = amountTotal / 100; // Convert from smallest unit (cents) to major unit (dollars)

            const newBalance = currentBalance + amountInUnits;

            if (userWalletDoc.exists) {
              t.update(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() }); // Update balance and currency
            } else {
              // Create wallet document if it doesn't exist
              t.set(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() });
            }
          });
          functions.logger.info(`Updated wallet balance for user ${userId} after successful top-up.`);

        } catch (error: any) {
          functions.logger.error(`Error updating wallet balance for user ${userId}:`, error);
          // **TODO:** Implement error handling (e.g., log the error, send an alert)
        }
      } else {
        // Handle other payment types here if needed in the future
        functions.logger.info(`Received successful payment for user ${userId} with unknown purpose:`, metadata?.paymentType);
        // **TODO:** Add logic for other payment types
      }
    } else {
      functions.logger.warn(`Received non-paid checkout session event for user ${userId}:`, session.payment_status);
    }
  });
      
