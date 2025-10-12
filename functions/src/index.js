const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (if not initialized elsewhere)
// admin.initializeApp();

const RoundUpEngine = require('./savings/RoundUpEngine');

// Initialize the RoundUpEngine
const roundUpEngine = new RoundUpEngine();

// Cloud Function triggered on new transaction creation
exports.processTransactionForRoundup = functions.firestore
  .document('transactions/{transactionId}')
  .onCreate(async (snap, context) => {
    const transaction = snap.data();
    const transactionId = context.params.transactionId;

    // Add the transaction ID to the transaction object
    transaction.id = transactionId;

    try {
      await roundUpEngine.processTransactionRoundup(transaction);
      console.log(`Successfully processed round-up for transaction: ${transactionId}`);
    } catch (error) {
      console.error(`Error processing round-up for transaction ${transactionId}:`, error);
      // Handle the error as needed
    }
  });

const { createVirtualCard, topUpVirtualCard, getVirtualCard } = require('./virtualCardFunctions');

exports.createVirtualCard = createVirtualCard;
exports.topUpVirtualCard = topUpVirtualCard;
exports.getVirtualCard = getVirtualCard;