import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as firebase from "firebase-admin/firestore";

admin.initializeApp();

// Process personal transaction
export const processTransaction = functions.firestore
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
        throw new functions.https.HttpsError(
          'failed-precondition', 
          'Insufficient funds'
        );
      }
      
      const newBalance = transaction.type === 'credit'
        ? walletData.balance + transaction.amount
        : walletData.balance - transaction.amount;
        
      t.update(walletRef, { balance: newBalance });
      t.update(snapshot.ref, { status: 'completed' });
    });
  });

// Issue virtual card (personal or business)
export const issueVirtualCard = functions.https.onCall(async (data, context) => {
  const { userId, businessId, walletId } = data;
  
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Authentication required'
    );
  }
  
  const cardData = {
    lastFour: generateLastFourDigits(),
    expiry: new Date(Date.now() + 126144000000), // 4 years
    cvv: Math.floor(Math.random() * 900) + 100,
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const db = admin.firestore();
  let cardRef;
  
  if (businessId) {
    // Business card
    if (!(await verifyBusinessRole(context.auth.uid, businessId, 'admin'))) {
      throw new functions.https.HttpsError(
        'permission-denied', 
        'Insufficient permissions'
      );
    }
    cardRef = db.collection(`businessAccounts/${businessId}/corporateCards`);
  } else {
    // Personal card
    if (context.auth.uid !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied', 
        'User mismatch'
      );
    }
    cardRef = db.collection(`users/${userId}/personalCards`);
  }
  
  return cardRef.add(cardData);
});

// Helper functions
function generateLastFourDigits() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function verifyBusinessRole(userId: string, businessId: string, requiredRole: string) {
  const db = admin.firestore();
  const roleDoc = await db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`).get();
  return roleDoc.exists && roleDoc.data().role === requiredRole;
}