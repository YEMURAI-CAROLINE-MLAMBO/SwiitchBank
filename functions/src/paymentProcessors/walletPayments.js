// functions/src/paymentProcessors/walletPayments.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class WalletPaymentService {
  // Process both Google Pay and Apple Pay through Stripe
  async processWalletPayment(paymentData, amount, currency, platform) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method_data:
          platform === 'google_pay'
            ? {
                type: 'card',
                card: {
                  token: paymentData.paymentMethodData.tokenizationData.token,
                },
              }
            : undefined,
        payment_method:
          platform === 'apple_pay' ? paymentData.token : undefined,
        confirmation_method: 'automatic',
        confirm: true,
        return_url: 'https://your-app-url.com/return', // For 3D Secure
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        requiresAction: paymentIntent.status === 'requires_action',
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error(`${platform} processing error:`, error);
      throw new Error(`${platform} processing failed: ${error.message}`);
    }
  }

  // Firebase Cloud Function
  processWalletPaymentCallable = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Authentication required'
        );
      }

      const { paymentData, amount, currency, platform } = data;

      try {
        const result = await this.processWalletPayment(
          paymentData,
          amount,
          currency,
          platform
        );

        // Record transaction
        await admin.firestore().collection('transactions').doc().set({
          userId: context.auth.uid,
          type: 'wallet_payment',
          platform,
          amount,
          currency,
          status: result.status,
          paymentIntentId: result.paymentIntentId,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          requiresAction: result.requiresAction,
        });

        return result;
      } catch (error) {
        console.error('Wallet payment error:', error);
        throw new functions.https.HttpsError('internal', error.message);
      }
    }
  );
}

module.exports = WalletPaymentService;
