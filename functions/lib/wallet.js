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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFunds = exports.topupWallet = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Cloud Function to top up a user's personal wallet
exports.topupWallet = functions.https.onCall(async (data, context) => {
    const { userId, amount } = data;
    // Ensure the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    // Validate input
    if (typeof amount !== 'number' || amount <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid top-up amount.');
    }
    // Ensure the authenticated user is topping up their own wallet
    if (context.auth.uid !== userId) {
        throw new functions.https.HttpsError('permission-denied', 'You can only top up your own wallet.');
    }
    const walletRef = db.doc(`users/${userId}/personalWallet/wallet`);
    try {
        await db.runTransaction(async (transaction) => {
            var _a;
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists) {
                // Create the wallet if it doesn't exist (should ideally be created on user registration)
                transaction.set(walletRef, { balance: amount, currency: 'USD' }); // Assuming USD as default
                functions.logger.warn(`Wallet not found for user ${userId}. Creating with initial top-up.`);
            }
            else {
                const currentBalance = ((_a = walletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0;
                const newBalance = currentBalance + amount;
                transaction.update(walletRef, { balance: newBalance });
            }
        });
        return { success: true, message: 'Wallet topped up successfully.' };
    }
    catch (error) {
        functions.logger.error('Error topping up wallet:', error);
        throw new functions.https.HttpsError('internal', 'Failed to top up wallet.', error);
    }
});
// Cloud Function to transfer funds between personal wallets
exports.transferFunds = functions.https.onCall(async (data, context) => {
    const { senderUserId, recipientUserId, amount } = data;
    // Ensure the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    // Ensure the authenticated user is the sender
    if (context.auth.uid !== senderUserId) {
        throw new functions.https.HttpsError('permission-denied', 'You can only transfer funds from your own wallet.');
    }
    // Validate input
    if (typeof amount !== 'number' || amount <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid transfer amount.');
    }
    if (senderUserId === recipientUserId) {
        throw new functions.https.HttpsError('invalid-argument', 'Cannot transfer funds to the same account.');
    }
    const senderWalletRef = db.doc(`/users/${senderUserId}/personalWallet/wallet`);
    try {
        await db.runTransaction(async (transaction) => {
            var _a, _b;
            const senderWalletDoc = await transaction.get(senderWalletRef);
            const recipientWalletDoc = await transaction.get(recipientWalletRef);
            if (!senderWalletDoc.exists) {
                throw new functions.https.HttpsError('not-found', `Sender wallet not found for user ${senderUserId}.`);
            }
            if (!recipientWalletDoc.exists) {
                // Create a wallet for the recipient if it doesn't exist
                functions.logger.warn(`Recipient wallet not found for user ${recipientUserId}. Creating.`);
                // We need to get a fresh reference for the recipient in the transaction
                const recipientWalletRef = db.doc(`/users/${recipientUserId}/personalWallet/wallet`);
                transaction.set(recipientWalletRef, { balance: 0, currency: 'USD' }); // Assuming USD as default
            }
            const senderBalance = ((_a = senderWalletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0;
            const recipientBalance = ((_b = recipientWalletDoc.data()) === null || _b === void 0 ? void 0 : _b.balance) || 0;
            if (senderBalance < amount) {
                throw new functions.https.HttpsError('failed-precondition', 'Insufficient funds in the sender\'s wallet.');
            }
            const newSenderBalance = senderBalance - amount;
            const newRecipientBalance = recipientBalance + amount;
            transaction.update(senderWalletRef, { balance: newSenderBalance });
            transaction.update(recipientWalletRef, { balance: newRecipientBalance });
        });
        return { success: true, message: 'Funds transferred successfully.' };
    }
    catch (error) {
        functions.logger.error('Error transferring funds:', error);
        // Re-throw HttpsError for client-side handling
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to transfer funds.', error);
    }
});
//# sourceMappingURL=wallet.js.map