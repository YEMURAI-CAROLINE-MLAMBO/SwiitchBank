import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Cloud Function to top up a user's personal wallet
export const topupWallet = functions.https.onCall(async (data, context) => {
  const { userId, amount } = data;

  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentication required.'
    );
  }

  // Validate input
  if (typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid top-up amount.'
    );
  }

  // Ensure the authenticated user is topping up their own wallet
  if (context.auth.uid !== userId) {
     throw new functions.https.HttpsError(
      'permission-denied',
      'You can only top up your own wallet.'
    );
  }

  const walletRef = db.doc(`users/${userId}/personalWallet/wallet`);

  try {
    await db.runTransaction(async (transaction) => {
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists) {
        // Create the wallet if it doesn't exist (should ideally be created on user registration)
         transaction.set(walletRef, { balance: amount, currency: 'USD' }); // Assuming USD as default
         functions.logger.warn(`Wallet not found for user ${userId}. Creating with initial top-up.`);
      } else {
        const currentBalance = walletDoc.data()?.balance || 0;
        const newBalance = currentBalance + amount;
        transaction.update(walletRef, { balance: newBalance });
      }
    });

    return { success: true, message: 'Wallet topped up successfully.' };

  } catch (error) {
    functions.logger.error('Error topping up wallet:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to top up wallet.',
      error
    );
  }
});

// Cloud Function to transfer funds between personal wallets
export const transferFunds = functions.https.onCall(async (data, context) => {
  const { senderUserId, recipientUserId, amount } = data;

  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentication required.'
    );
  }

   // Ensure the authenticated user is the sender
  if (context.auth.uid !== senderUserId) {
     throw new functions.https.HttpsError(
      'permission-denied',
      'You can only transfer funds from your own wallet.'
    );
  }


  // Validate input
  if (typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid transfer amount.'
    );
  }

  if (senderUserId === recipientUserId) {
     throw new functions.https.HttpsError(
      'invalid-argument',
      'Cannot transfer funds to the same account.'
    );
  }

  const senderWalletRef = db.doc(`/users/${senderUserId}/personalWallet/wallet`);

  try {
    await db.runTransaction(async (transaction) => {
      const senderWalletDoc = await transaction.get(senderWalletRef);
      const recipientWalletDoc = await transaction.get(recipientWalletRef);

      if (!senderWalletDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          `Sender wallet not found for user ${senderUserId}.`
        );
      }

      if (!recipientWalletDoc.exists) {
         // Create a wallet for the recipient if it doesn't exist
         functions.logger.warn(`Recipient wallet not found for user ${recipientUserId}. Creating.`);
         // We need to get a fresh reference for the recipient in the transaction
         const recipientWalletRef = db.doc(`/users/${recipientUserId}/personalWallet/wallet`);
         transaction.set(recipientWalletRef, { balance: 0, currency: 'USD' }); // Assuming USD as default
      }

      const senderBalance = senderWalletDoc.data()?.balance || 0;
      const recipientBalance = recipientWalletDoc.data()?.balance || 0;

      if (senderBalance < amount) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Insufficient funds in the sender\'s wallet.'
        );
      }

      const newSenderBalance = senderBalance - amount;
      const newRecipientBalance = recipientBalance + amount;

      transaction.update(senderWalletRef, { balance: newSenderBalance });
      transaction.update(recipientWalletRef, { balance: newRecipientBalance });
    });

    return { success: true, message: 'Funds transferred successfully.' };

  } catch (error) {
    functions.logger.error('Error transferring funds:', error);
     // Re-throw HttpsError for client-side handling
    if (error instanceof functions.https.HttpsError) {
        throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      'Failed to transfer funds.',
      error
    );
  }
});