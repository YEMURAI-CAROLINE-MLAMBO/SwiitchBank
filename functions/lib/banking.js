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
exports.issueVirtualCard = exports.processTransaction = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
// Process personal transaction
exports.processTransaction = functions.firestore
    .document('transactions/{transactionId}')
    .onCreate(async (snapshot, context) => {
    const transaction = snapshot.data();
    const db = admin.firestore();
    const walletRef = transaction.businessId
        ? db.doc(`businessAccounts/${transaction.businessId}/corporateWallets/${transaction.walletId}`)
        : db.doc(`users/${transaction.userId}/personalWallet`);
    await db.runTransaction(async (t) => {
        const walletDoc = await t.get(walletRef);
        const walletData = walletDoc.data();
        if (transaction.type === 'debit' && walletData.balance < transaction.amount) {
            throw new functions.https.HttpsError('failed-precondition', 'Insufficient funds');
        }
        const newBalance = transaction.type === 'credit'
            ? walletData.balance + transaction.amount
            : walletData.balance - transaction.amount;
        t.update(walletRef, { balance: newBalance });
        t.update(snapshot.ref, { status: 'completed' });
    });
});
// Issue virtual card (personal or business)
exports.issueVirtualCard = functions.https.onCall(async (data, context) => {
    const { userId, businessId, walletId } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const cardData = {
        lastFour: generateLastFourDigits(),
        expiry: new Date(Date.now() + 126144000000),
        cvv: Math.floor(Math.random() * 900) + 100,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const db = admin.firestore();
    let cardRef;
    if (businessId) {
        // Business card
        if (!(await verifyBusinessRole(context.auth.uid, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
        }
        cardRef = db.collection(`businessAccounts/${businessId}/corporateCards`);
    }
    else {
        // Personal card
        if (context.auth.uid !== userId) {
            throw new functions.https.HttpsError('permission-denied', 'User mismatch');
        }
        cardRef = db.collection(`users/${userId}/personalCards`);
    }
    return cardRef.add(cardData);
});
// Helper functions
function generateLastFourDigits() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
async function verifyBusinessRole(userId, businessId, requiredRole) {
    const db = admin.firestore();
    const roleDoc = await db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`).get();
    return roleDoc.exists && roleDoc.data().role === requiredRole;
}
//# sourceMappingURL=banking.js.map