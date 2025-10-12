import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Processes a secure financial transaction.
 * This function should include logic for validation, recording, and potential
 * external service interaction (e.g., payment gateways).
 * @param data - The transaction data.
 * @param context - The context of the callable function.
 * @returns A promise resolving with the transaction result.
 */
export const processSecureTransaction = async (data: any, context: CallableContext): Promise<any> => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const userId = context.auth.uid;
  const { amount, recipient, type, ...otherData } = data;

  // Basic validation
  if (typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid transaction amount.'
    );
  }

  if (typeof recipient !== 'string' || recipient.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid recipient.'
    );
  }

  if (typeof type !== 'string' || type.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid transaction type.'
    );
  }

  try {
    // Perform further validation using validateTransactionRequest
    const validationResult = await validateTransactionRequest(data, context);
    if (!validationResult.isValid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Transaction request failed validation.'
      );
    }

    const transactionId = admin.firestore().collection('transactions').doc().id;
    let status = 'pending';
    let paymentResult;

    try {
      // In a real application, you would call a payment gateway service here.
      // This is a simulated call.
      // paymentResult = await paymentGatewayService.charge(amount, data.paymentMethodToken);

      // For this example, we'll assume the payment is successful.
      status = 'completed';

      // Deduct the amount from the user's balance
      const userRef = admin.firestore().collection('users').doc(userId);
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(-amount)
      });

    } catch (paymentError) {
      status = 'failed';
      // You might want to log the specific error from the payment gateway
      console.error('Payment gateway error:', paymentError);
    }

    await admin.firestore().collection('transactions').doc(transactionId).set({
      userId,
      amount,
      recipient,
      type,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status,
      ...otherData,
    });

    if (status === 'failed') {
      throw new functions.https.HttpsError('aborted', 'Payment processing failed.');
    }

    return { status: 'success', transactionId: transactionId };

  } catch (error: any) {
    console.error('Error processing transaction:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while processing the transaction.',
      error.message
    );
  }
};

/**
 * Validates a financial transaction request.
 * This function performs detailed checks on the transaction data and user
 * context to ensure the request is legitimate and authorized.
 * @param data - The transaction data.
 * @param context - The context of the callable function.
 * @returns A promise resolving with a validation result object.
 */
export const validateTransactionRequest = async (data: any, context: CallableContext): Promise<{ isValid: boolean; message?: string }> => {
  // Ensure the user is authenticated
  if (!context.auth) {
    return { isValid: false, message: 'Unauthenticated request.' };
  }

  const userId = context.auth.uid;
  const { amount } = data;
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return { isValid: false, message: 'User not found.' };
  }

  const userData = userDoc.data();

  // 1. Check user's balance
  if (!userData || userData.balance < amount) {
    return { isValid: false, message: 'Insufficient funds.' };
  }

  // 2. Check spending limits
  const spendingLimit = userData.spendingLimit || 10000; // Default limit
  if (amount > spendingLimit) {
    return { isValid: false, message: `Transaction amount exceeds spending limit of ${spendingLimit}.` };
  }

  // 3. Recipient validation (placeholder)
  const recipientIsValid = true;
  if (!recipientIsValid) {
    return { isValid: false, message: 'Invalid recipient.' };
  }

  // If all checks pass
  return { isValid: true };
};
