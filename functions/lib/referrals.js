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
exports.getReferralDetails = exports.processReferral = exports.generateReferralOffer = exports.applyStudentBenefitsAndReferral = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const uuid_1 = require("uuid");
const db = admin.firestore();
// Helper function to get user's personal wallet reference
function getUserWalletRef(userId) {
    return db.doc(`users/${userId}/personalWallet/wallet`);
}
// Helper function to generate a unique referral code
async function generateUniqueReferralCode() {
    let code;
    let codeExists = true;
    while (codeExists) {
        code = `SWIITCH-${(0, uuid_1.v4)().split('-')[0].toUpperCase()}`;
        const snapshot = await db.collection('users').where('referralCode', '==', code).get();
        codeExists = !snapshot.empty;
    }
    return code;
}
// Helper function to predict referral likelihood (Placeholder)
async function predictReferralLikelihood(userId) {
    var _a;
    // This is a simplified placeholder. A real implementation would use more sophisticated logic.
    // Fetch some user data from Firestore (e.g., transaction count, wallet balance)
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists)
            return 0.1; // Low likelihood if user not found
        const walletDoc = await getUserWalletRef(userId).get();
        const balance = walletDoc.exists ? (((_a = walletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0) : 0;
        // Simple heuristic: higher balance might indicate higher likelihood
        let score = Math.min(1, balance / 1000); // Cap score at 1 for simplicity
        // Add some randomness
        score = score * 0.8 + Math.random() * 0.2;
        return Math.min(1, score); // Ensure score is between 0 and 1
    }
    catch (error) {
        functions.logger.error('Error predicting referral likelihood:', error);
        return 0.5; // Default likelihood on error
    }
}
// Helper function to determine referral reward based on likelihood
function determineReferralReward(likelihood) {
    if (likelihood > 0.8) {
        return { type: 'cash', amount: 15, currency: 'USD', badge: 'gold' };
    }
    else if (likelihood > 0.6) {
        return { type: 'cash', amount: 10, currency: 'USD', badge: 'silver' };
    }
    else {
        return { type: 'cash', amount: 5, currency: 'USD', badge: 'bronze' };
    }
}
/**
 * Handles applying student benefits and referral codes during onboarding.
 */
exports.applyStudentBenefitsAndReferral = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = context.auth.uid;
    const { university, studentId, referralCode } = data;
    try {
        const userRef = db.collection('users').doc(userId);
        // Update user document with student information
        await userRef.update({
            university: university || null,
            studentId: studentId || null,
            studentVerified: true, // Assuming verification is handled client-side or elsewhere
            // Add other student-specific fields if needed
        });
        // If a referral code is provided, attempt to process it
        if (referralCode) {
            await (0, exports.processReferral)({ referralCode, newUserId: userId }, context); // Reuse processReferral logic
        }
        // Apply student-specific benefits (e.g., add welcome bonus to wallet)
        await db.runTransaction(async (transaction) => {
            var _a;
            const userWalletRef = getUserWalletRef(userId);
            const userWalletDoc = await transaction.get(userWalletRef);
            const currentBalance = userWalletDoc.exists ? (((_a = userWalletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0) : 0;
            transaction.update(userWalletRef, { balance: currentBalance + 5 }); // Add $5 welcome bonus
        });
        return { success: true, message: 'Student benefits and referral applied successfully' };
    }
    catch (error) {
        functions.logger.error('Error applying student benefits and referral:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to apply student benefits and referral', error.message);
    }
});
/**
 * Generates or retrieves a user's referral offer.
 */
exports.generateReferralOffer = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = context.auth.uid;
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User not found.');
        }
        let referralCode = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.referralCode;
        // Generate code if it doesn't exist
        if (!referralCode) {
            referralCode = await generateUniqueReferralCode();
            await userRef.update({ referralCode });
        }
        // Predict likelihood and determine reward
        const referralLikelihood = await predictReferralLikelihood(userId);
        const reward = determineReferralReward(referralLikelihood);
        const shareMessage = `Join SwiitchBank using my code ${referralCode} and we both get $${reward.amount}!`;
        return {
            code: referralCode,
            reward,
            shareMessage
        };
    }
    catch (error) {
        functions.logger.error('Error generating referral offer:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to generate referral offer', error.message);
    }
});
/**
 * Processes a successful referral when a new user signs up with a code.
 * This function is intended to be called internally, e.g., from the user registration flow.
 */
exports.processReferral = functions.https.onCall(async (data, context) => {
    // Note: For security, consider if this should be callable directly by clients.
    // If called internally (e.g., from another Cloud Function triggered by user creation),
    // you might remove the context.auth check and pass a flag indicating it's internal.
    if (!context.auth) {
        // For testing, you might allow unauthenticated calls during development,
        // but secure this in production.
        // throw new functions.https.HttpsError(
        //   'unauthenticated',
        //   'Authentication required'
        // );
    }
    const { referralCode, newUserId } = data;
    if (!referralCode || !newUserId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing referralCode or newUserId');
    }
    try {
        // Find the referrer user by referral code
        const referrerSnapshot = await db.collection('users')
            .where('referralCode', '==', referralCode)
            .limit(1)
            .get();
        if (referrerSnapshot.empty) {
            // Referral code not found, or no referrer exists with this code
            functions.logger.info(`No referrer found for code: ${referralCode}`);
            return { success: false, message: 'Invalid referral code' };
        }
        const referrerDoc = referrerSnapshot.docs[0];
        const referrerId = referrerDoc.id;
        // Prevent self-referral (should be handled in frontend/signup flow too)
        if (referrerId === newUserId) {
            functions.logger.warn(`Self-referral attempt detected: ${newUserId}`);
            return { success: false, message: 'Cannot refer yourself' };
        }
        // Check if this referral has already been processed for this new user
        const existingReferral = await db.collection('referrals')
            .where('referredId', '==', newUserId)
            .limit(1)
            .get();
        if (!existingReferral.empty) {
            functions.logger.warn(`Referral already processed for new user: ${newUserId}`);
            return { success: false, message: 'Referral already processed' };
        }
        // Determine the reward for the referrer (can be based on referrer's likelihood or a fixed amount)
        // For simplicity, let's fetch the referrer's generated offer or use a default
        // Let's use the likelihood score we'd predict for the referrer at this time
        const referrerLikelihood = await predictReferralLikelihood(referrerId);
        const reward = determineReferralReward(referrerLikelihood);
        // Use a transaction to update wallet and record referral atomically
        await db.runTransaction(async (transaction) => {
            var _a;
            const referrerWalletRef = getUserWalletRef(referrerId);
            const referrerWalletDoc = await transaction.get(referrerWalletRef);
            const currentBalance = referrerWalletDoc.exists ? (((_a = referrerWalletDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0) : 0;
            const newBalance = currentBalance + reward.amount;
            // Update referrer's wallet balance
            if (referrerWalletDoc.exists) {
                transaction.update(referrerWalletRef, { balance: newBalance });
            }
            else {
                // Create wallet document if it somehow doesn't exist (should be created on signup)
                transaction.set(referrerWalletRef, { balance: newBalance, currency: reward.currency || 'USD' });
            }
            // Record the referral
            const newReferralRef = db.collection('referrals').doc(); // Auto-generate document ID
            transaction.set(newReferralRef, {
                referrerId: referrerId,
                referredId: newUserId,
                rewardAmount: reward.amount,
                rewardCurrency: reward.currency,
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        functions.logger.info(`Referral processed: referrer=${referrerId}, referred=${newUserId}, amount=${reward.amount}`);
        return { success: true, message: 'Referral processed successfully', reward };
    }
    catch (error) {
        functions.logger.error('Error processing referral:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to process referral', error.message);
    }
});
/**
 * Gets referral details for the authenticated user.
 */
exports.getReferralDetails = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = context.auth.uid;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User not found.');
        }
        const referralCode = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.referralCode) || null;
        // Get completed referrals for this user as the referrer
        const completedReferralsSnapshot = await db.collection('referrals')
            .where('referrerId', '==', userId)
            .where('status', '==', 'completed')
            .orderBy('createdAt', 'desc')
            .get();
        const completedReferrals = completedReferralsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data()
        // Note: referredId is included, you might want to fetch referred user details if needed
        )));
        return {
            referralCode,
            completedReferrals
        };
    }
    catch (error) {
        functions.logger.error('Error fetching referral details:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to fetch referral details', error.message);
    }
});
//# sourceMappingURL=referrals.js.map