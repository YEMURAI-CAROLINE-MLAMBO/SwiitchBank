"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuccessfulPayment = exports.createCheckoutSession = exports.createStripeCustomer = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
admin.initializeApp();
const db = admin.firestore();
// Create a Stripe customer when a new user is created in Firebase Auth
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
    const customerData = {
        email: user.email,
        // You can add other customer data here
    };
    await db.collection('customers').doc(user.uid).set(customerData);
    functions.logger.info(`Created Stripe customer for user: ${user.uid}`);
});
// Create a Stripe checkout session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    var _a, _b;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    const priceId = data.priceId; // Assuming you pass a Stripe price ID from the frontend
    if (!priceId) {
        throw new functions.https.HttpsError('invalid-argument', 'Price ID is required.');
    }
    // Get the Stripe customer ID from your Firestore customer document
    const customerDoc = await db.collection('customers').doc(uid).get();
    const stripeCustomerId = (_b = customerDoc.data()) === null || _b === void 0 ? void 0 : _b.stripeId; // Assuming the extension adds stripeId to the customer document
    if (!stripeCustomerId) {
        throw new functions.https.HttpsError('failed-precondition', 'Stripe customer not found.\nRun the createStripeCustomer function first.'); // Corrected newline character
    }
    const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
        apiVersion: '2020-08-27',
    });
    try {
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card\'],,
                line_items, [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode, 'payment\',\n      success_url: `${functions.config().app.url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,\n      cancel_url: `${functions.config().app.url}/payment-cancel`,\n      metadata: { // Use metadata to pass information to the webhook,
                userId, uid,
                paymentType, 'wallet_topup',
                // Add other relevant metadata here (e.g., target wallet currency if different)
            ]
            // Add other relevant metadata here (e.g., target wallet currency if different)
        });
    }
    finally { }
});
return { id: session.id };
try { }
catch (error) {
    n;
    functions.logger.error('Error creating checkout session:', error);
    n;
    throw new functions.https.HttpsError('internal', 'Unable to create checkout session.', error.message);
    n;
}
n;
;
// Handle successful Stripe payments // Corrected comments and formatting
exports.handleSuccessfulPayment = functions.firestore
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
        if ((metadata === null || metadata === void 0 ? void 0 : metadata.paymentType) === 'wallet_topup') {
            // Implement logic to update the user's wallet balance
            const userWalletRef = db.doc(`users/${userId}/personalWallet`); // Adjust path if needed
            try {
                await db.runTransaction(async (t) => {
                    var _a;
                    const userWalletDoc = await t.get(userWalletRef);
                    const currentBalance = userWalletDoc.exists ? (((_a = userWalletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0) : 0;
                    const amountInUnits = amountTotal / 100; // Convert from smallest unit (cents) to major unit (dollars)
                    const newBalance = currentBalance + amountInUnits;
                    if (userWalletDoc.exists) {
                        t.update(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() }); // Update balance and currency
                    }
                    else {
                        // Create wallet document if it doesn't exist
                        t.set(userWalletRef, { balance: newBalance, currency: currency.toUpperCase() });
                    }
                });
                functions.logger.info(`Updated wallet balance for user ${userId} after successful top-up.`);
            }
            catch (error) {
                functions.logger.error(`Error updating wallet balance for user ${userId}:`, error);
                // **TODO:** Implement error handling (e.g., log the error, send an alert)
            }
        }
        else {
            // Handle other payment types here if needed in the future
            functions.logger.info(`Received successful payment for user ${userId} with unknown purpose:`, metadata === null || metadata === void 0 ? void 0 : metadata.paymentType);
            // **TODO:** Add logic for other payment types
        }
    }
    else {
        functions.logger.warn(`Received non-paid checkout session event for user ${userId}:`, session.payment_status);
    }
});
//# sourceMappingURL=stripe.js.map