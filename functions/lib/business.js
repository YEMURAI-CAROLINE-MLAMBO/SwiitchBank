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
exports.createCorporateWallet = exports.updateTeamMemberRole = exports.removeTeamMember = exports.addTeamMember = exports.createBusinessAccount = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Note: admin.initializeApp() should be called once, ideally in your index.ts or equivalent entry point.
// Assuming it's initialized elsewhere if this is a separate file.
// admin.initializeApp();
const db = admin.firestore();
// Helper to check if a user has a specific role for a business using custom claims
async function hasBusinessRole(userId, businessId, requiredRole) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return customClaims[`business_${businessId}`] === requiredRole;
    }
    catch (error) {
        functions.logger.error(`Error checking business role for user ${userId} and business ${businessId}:`, error);
        return false;
    }
}
// Helper to check if a user is any member of a business using custom claims
async function isBusinessMember(userId, businessId) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return Object.keys(customClaims).some(claimKey => claimKey.startsWith(`business_${businessId}`));
    }
    catch (error) {
        functions.logger.error(`Error checking if user ${userId} is a member of business ${businessId}:`, error);
        return false;
    }
}
// Create a new business account
exports.createBusinessAccount = functions.https.onCall(async (data, context) => {
    const { companyName, taxID, plan } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!companyName || !taxID || !plan) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required business account details.');
    }
    const userId = context.auth.uid;
    try {
        // Create the business account document
        const businessRef = await db.collection('businessAccounts').add({
            companyName,
            taxID,
            plan,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ownerId: userId, // Store the owner's ID
        });
        const businessId = businessRef.id;
        // Add the creator as an admin team member
        await businessRef.collection('teamMembers').doc(userId).set({
            userId,
            role: 'admin',
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: userId,
        });
        // Update custom claim for the creator
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: 'admin' });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { businessId, message: 'Business account created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating business account:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create business account.', error);
    }
});
// Add a team member to a business account
exports.addTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, email, role } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !email || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for adding team member.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to add team members.');
        }
        // Get the user to be added by email
        const userToAdd = await admin.auth().getUserByEmail(email);
        const userIdToAdd = userToAdd.uid;
        // Add the user to the teamMembers subcollection
        await db.doc(`businessAccounts/${businessId}/teamMembers/${userIdToAdd}`).set({
            userId: userIdToAdd,
            email,
            role,
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: requesterId,
        });
        // Update custom claim for the added user
        const user = await admin.auth().getUser(userIdToAdd);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userIdToAdd, newCustomClaims);
        return { userId: userIdToAdd, message: 'Team member added successfully.' };
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', 'User with provided email not found.');
        }
        functions.logger.error('Error adding team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to add team member.', error);
    }
});
// Remove a team member from a business account
exports.removeTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, userId } = data; // userId is the ID of the user to remove
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for removing team member.');
    }
    const requesterId = context.auth.uid;
    // Prevent a user from removing themselves (unless they are the last admin - requires more complex logic not included here)
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot remove yourself from a business account.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to remove team members.');
        }
        // Check if the user to remove is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Remove the user from the teamMembers subcollection
        await teamMemberDocRef.delete();
        // Update custom claim for the removed user (remove the specific business claim)
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign({}, currentCustomClaims);
        delete newCustomClaims[`business_${businessId}`];
        // If the user has no other business claims, set custom claims to null to remove the claims field
        if (Object.keys(newCustomClaims).length === 0) {
            await admin.auth().setCustomUserClaims(userId, null);
        }
        else {
            await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        }
        return { message: 'Team member removed successfully.' };
    }
    catch (error) {
        functions.logger.error('Error removing team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to remove team member.', error);
    }
});
// Update a team member's role in a business account
exports.updateTeamMemberRole = functions.https.onCall(async (data, context) => {
    const { businessId, userId, role } = data; // userId is the ID of the user whose role is being updated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for updating team member role.');
    }
    // Optional: Add validation for allowed roles (e.g., ['admin', 'accountant', 'member'])
    const allowedRoles = ['admin', 'accountant', 'member']; // Define your allowed roles
    if (!allowedRoles.includes(role)) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid role specified. Allowed roles are: ${allowedRoles.join(', ')}`);
    }
    const requesterId = context.auth.uid;
    // Prevent a user from changing their own role to something that might lock them out (e.g., removing admin)
    // unless specific logic is added to handle transferring ownership/admin rights.
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot change your own role.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to update team member roles.');
        }
        // Check if the user whose role is being updated is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Update the user's role in the teamMembers subcollection
        await teamMemberDocRef.update({
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: requesterId,
        });
        // Update custom claim for the user
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { message: 'Team member role updated successfully.' };
    }
    catch (error) {
        functions.logger.error('Error updating team member role:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update team member role.', error);
    }
});
// Create a corporate wallet for a business account
exports.createCorporateWallet = functions.https.onCall(async (data, context) => {
    const { businessId, walletName, currency, initialBalance = 0 } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !walletName || !currency) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for creating corporate wallet.');
    }
    if (typeof initialBalance !== 'number' || initialBalance < 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Initial balance must be a non-negative number.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin or accountant of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin') || await hasBusinessRole(requesterId, businessId, 'accountant'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin or accountant to create corporate wallets.');
        }
        // Optional: Check if a wallet with the same name already exists for this business
        const existingWallet = await db.collection(`businessAccounts/${businessId}/corporateWallets`)
            .where('walletName', '==', walletName)
            .limit(1)
            .get();
        if (!existingWallet.empty) {
            throw new functions.https.HttpsError('already-exists', `A corporate wallet named '${walletName}' already exists for this business.`);
        }
        // Create the corporate wallet document
        const walletRef = await db.collection(`businessAccounts/${businessId}/corporateWallets`).add({
            walletName,
            currency,
            balance: initialBalance,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: requesterId,
        });
        return { walletId: walletRef.id, message: 'Corporate wallet created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating corporate wallet:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create corporate wallet.', error);
    }
});
// Note: admin.initializeApp() should be called once, ideally in your index.ts or equivalent entry point.
// Assuming it's initialized elsewhere if this is a separate file.
// admin.initializeApp();
const db = admin.firestore();
// Helper to check if a user has a specific role for a business using custom claims
async function hasBusinessRole(userId, businessId, requiredRole) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return customClaims[`business_${businessId}`] === requiredRole;
    }
    catch (error) {
        functions.logger.error(`Error checking business role for user ${userId} and business ${businessId}:`, error);
        return false;
    }
}
// Helper to check if a user is any member of a business using custom claims
async function isBusinessMember(userId, businessId) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return Object.keys(customClaims).some(claimKey => claimKey.startsWith(`business_${businessId}`));
    }
    catch (error) {
        functions.logger.error(`Error checking if user ${userId} is a member of business ${businessId}:`, error);
        return false;
    }
}
// Create a new business account
exports.createBusinessAccount = functions.https.onCall(async (data, context) => {
    const { companyName, taxID, plan } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!companyName || !taxID || !plan) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required business account details.');
    }
    const userId = context.auth.uid;
    try {
        // Create the business account document
        const businessRef = await db.collection('businessAccounts').add({
            companyName,
            taxID,
            plan,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ownerId: userId, // Store the owner's ID
        });
        const businessId = businessRef.id;
        // Add the creator as an admin team member
        await businessRef.collection('teamMembers').doc(userId).set({
            userId,
            role: 'admin',
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: userId,
        });
        // Update custom claim for the creator
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: 'admin' });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { businessId, message: 'Business account created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating business account:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create business account.', error);
    }
});
// Add a team member to a business account
exports.addTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, email, role } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !email || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for adding team member.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to add team members.');
        }
        // Get the user to be added by email
        const userToAdd = await admin.auth().getUserByEmail(email);
        const userIdToAdd = userToAdd.uid;
        // Add the user to the teamMembers subcollection
        await db.doc(`businessAccounts/${businessId}/teamMembers/${userIdToAdd}`).set({
            userId: userIdToAdd,
            email,
            role,
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: requesterId,
        });
        // Update custom claim for the added user
        const user = await admin.auth().getUser(userIdToAdd);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userIdToAdd, newCustomClaims);
        return { userId: userIdToAdd, message: 'Team member added successfully.' };
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', 'User with provided email not found.');
        }
        functions.logger.error('Error adding team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to add team member.', error);
    }
});
// Remove a team member from a business account
exports.removeTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, userId } = data; // userId is the ID of the user to remove
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for removing team member.');
    }
    const requesterId = context.auth.uid;
    // Prevent a user from removing themselves (unless they are the last admin - requires more complex logic not included here)
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot remove yourself from a business account.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to remove team members.');
        }
        // Check if the user to remove is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Remove the user from the teamMembers subcollection
        await teamMemberDocRef.delete();
        // Update custom claim for the removed user (remove the specific business claim)
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign({}, currentCustomClaims);
        delete newCustomClaims[`business_${businessId}`];
        // If the user has no other business claims, set custom claims to null to remove the claims field
        if (Object.keys(newCustomClaims).length === 0) {
            await admin.auth().setCustomUserClaims(userId, null);
        }
        else {
            await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        }
        return { message: 'Team member removed successfully.' };
    }
    catch (error) {
        functions.logger.error('Error removing team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to remove team member.', error);
    }
});
// Update a team member's role in a business account
exports.updateTeamMemberRole = functions.https.onCall(async (data, context) => {
    const { businessId, userId, role } = data; // userId is the ID of the user whose role is being updated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for updating team member role.');
    }
    // Optional: Add validation for allowed roles (e.g., ['admin', 'accountant', 'member'])
    const allowedRoles = ['admin', 'accountant', 'member']; // Define your allowed roles
    if (!allowedRoles.includes(role)) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid role specified. Allowed roles are: ${allowedRoles.join(', ')}`);
    }
    const requesterId = context.auth.uid;
    // Prevent a user from changing their own role to something that might lock them out (e.g., removing admin)
    // unless specific logic is added to handle transferring ownership/admin rights.
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot change your own role.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to update team member roles.');
        }
        // Check if the user whose role is being updated is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Update the user's role in the teamMembers subcollection
        await teamMemberDocRef.update({
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: requesterId,
        });
        // Update custom claim for the user
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { message: 'Team member role updated successfully.' };
    }
    catch (error) {
        functions.logger.error('Error updating team member role:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update team member role.', error);
    }
});
// Create a corporate wallet for a business account
exports.createCorporateWallet = functions.https.onCall(async (data, context) => {
    const { businessId, walletName, currency, initialBalance = 0 } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !walletName || !currency) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for creating corporate wallet.');
    }
    if (typeof initialBalance !== 'number' || initialBalance < 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Initial balance must be a non-negative number.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin or accountant of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin') || await hasBusinessRole(requesterId, businessId, 'accountant'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin or accountant to create corporate wallets.');
        }
        // Optional: Check if a wallet with the same name already exists for this business
        const existingWallet = await db.collection(`businessAccounts/${businessId}/corporateWallets`)
            .where('walletName', '==', walletName)
            .limit(1)
            .get();
        if (!existingWallet.empty) {
            throw new functions.https.HttpsError('already-exists', `A corporate wallet named '${walletName}' already exists for this business.`);
        }
        // Create the corporate wallet document
        const walletRef = await db.collection(`businessAccounts/${businessId}/corporateWallets`).add({
            walletName,
            currency,
            balance: initialBalance,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: requesterId,
        });
        return { walletId: walletRef.id, message: 'Corporate wallet created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating corporate wallet:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create corporate wallet.', error);
    }
});
// Note: admin.initializeApp() should be called once, ideally in your index.ts or equivalent entry point.
// Assuming it's initialized elsewhere if this is a separate file.
// admin.initializeApp();
const db = admin.firestore();
// Helper to check if a user has a specific role for a business using custom claims
async function hasBusinessRole(userId, businessId, requiredRole) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return customClaims[`business_${businessId}`] === requiredRole;
    }
    catch (error) {
        functions.logger.error(`Error checking business role for user ${userId} and business ${businessId}:`, error);
        return false;
    }
}
// Helper to check if a user is any member of a business using custom claims
async function isBusinessMember(userId, businessId) {
    try {
        const user = await admin.auth().getUser(userId);
        const customClaims = user.customClaims || {};
        return Object.keys(customClaims).some(claimKey => claimKey.startsWith(`business_${businessId}`));
    }
    catch (error) {
        functions.logger.error(`Error checking if user ${userId} is a member of business ${businessId}:`, error);
        return false;
    }
}
// Create a new business account
exports.createBusinessAccount = functions.https.onCall(async (data, context) => {
    const { companyName, taxID, plan } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!companyName || !taxID || !plan) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required business account details.');
    }
    const userId = context.auth.uid;
    try {
        // Create the business account document
        const businessRef = await db.collection('businessAccounts').add({
            companyName,
            taxID,
            plan,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ownerId: userId, // Store the owner's ID
        });
        const businessId = businessRef.id;
        // Add the creator as an admin team member
        await businessRef.collection('teamMembers').doc(userId).set({
            userId,
            role: 'admin',
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: userId,
        });
        // Update custom claim for the creator
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: 'admin' });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { businessId, message: 'Business account created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating business account:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create business account.', error);
    }
});
// Add a team member to a business account
exports.addTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, email, role } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !email || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for adding team member.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to add team members.');
        }
        // Get the user to be added by email
        const userToAdd = await admin.auth().getUserByEmail(email);
        const userIdToAdd = userToAdd.uid;
        // Add the user to the teamMembers subcollection
        await db.doc(`businessAccounts/${businessId}/teamMembers/${userIdToAdd}`).set({
            userId: userIdToAdd,
            email,
            role,
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: requesterId,
        });
        // Update custom claim for the added user
        const user = await admin.auth().getUser(userIdToAdd);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userIdToAdd, newCustomClaims);
        return { userId: userIdToAdd, message: 'Team member added successfully.' };
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', 'User with provided email not found.');
        }
        functions.logger.error('Error adding team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to add team member.', error);
    }
});
// Remove a team member from a business account
exports.removeTeamMember = functions.https.onCall(async (data, context) => {
    const { businessId, userId } = data; // userId is the ID of the user to remove
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for removing team member.');
    }
    const requesterId = context.auth.uid;
    // Prevent a user from removing themselves (unless they are the last admin - requires more complex logic not included here)
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot remove yourself from a business account.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to remove team members.');
        }
        // Check if the user to remove is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Remove the user from the teamMembers subcollection
        await teamMemberDocRef.delete();
        // Update custom claim for the removed user (remove the specific business claim)
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign({}, currentCustomClaims);
        delete newCustomClaims[`business_${businessId}`];
        // If the user has no other business claims, set custom claims to null to remove the claims field
        if (Object.keys(newCustomClaims).length === 0) {
            await admin.auth().setCustomUserClaims(userId, null);
        }
        else {
            await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        }
        return { message: 'Team member removed successfully.' };
    }
    catch (error) {
        functions.logger.error('Error removing team member:', error);
        throw new functions.https.HttpsError('internal', 'Failed to remove team member.', error);
    }
});
// Update a team member's role in a business account
exports.updateTeamMemberRole = functions.https.onCall(async (data, context) => {
    const { businessId, userId, role } = data; // userId is the ID of the user whose role is being updated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !userId || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for updating team member role.');
    }
    // Optional: Add validation for allowed roles (e.g., ['admin', 'accountant', 'member'])
    const allowedRoles = ['admin', 'accountant', 'member']; // Define your allowed roles
    if (!allowedRoles.includes(role)) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid role specified. Allowed roles are: ${allowedRoles.join(', ')}`);
    }
    const requesterId = context.auth.uid;
    // Prevent a user from changing their own role to something that might lock them out (e.g., removing admin)
    // unless specific logic is added to handle transferring ownership/admin rights.
    if (requesterId === userId) {
        throw new functions.https.HttpsError('permission-denied', 'You cannot change your own role.');
    }
    try {
        // Verify the requester is an admin of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin to update team member roles.');
        }
        // Check if the user whose role is being updated is actually a member of this business
        const teamMemberDocRef = db.doc(`businessAccounts/${businessId}/teamMembers/${userId}`);
        const teamMemberDoc = await teamMemberDocRef.get();
        if (!teamMemberDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User is not a member of this business account.');
        }
        // Update the user's role in the teamMembers subcollection
        await teamMemberDocRef.update({
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: requesterId,
        });
        // Update custom claim for the user
        const user = await admin.auth().getUser(userId);
        const currentCustomClaims = user.customClaims || {};
        const newCustomClaims = Object.assign(Object.assign({}, currentCustomClaims), { [`business_${businessId}`]: role });
        await admin.auth().setCustomUserClaims(userId, newCustomClaims);
        return { message: 'Team member role updated successfully.' };
    }
    catch (error) {
        functions.logger.error('Error updating team member role:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update team member role.', error);
    }
});
// Create a corporate wallet for a business account
exports.createCorporateWallet = functions.https.onCall(async (data, context) => {
    const { businessId, walletName, currency, initialBalance = 0 } = data;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }
    if (!businessId || !walletName || !currency) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for creating corporate wallet.');
    }
    if (typeof initialBalance !== 'number' || initialBalance < 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Initial balance must be a non-negative number.');
    }
    const requesterId = context.auth.uid;
    try {
        // Verify the requester is an admin or accountant of the business account
        if (!(await hasBusinessRole(requesterId, businessId, 'admin') || await hasBusinessRole(requesterId, businessId, 'accountant'))) {
            throw new functions.https.HttpsError('permission-denied', 'You must be an admin or accountant to create corporate wallets.');
        }
        // Optional: Check if a wallet with the same name already exists for this business
        const existingWallet = await db.collection(`businessAccounts/${businessId}/corporateWallets`)
            .where('walletName', '==', walletName)
            .limit(1)
            .get();
        if (!existingWallet.empty) {
            throw new functions.https.HttpsError('already-exists', `A corporate wallet named '${walletName}' already exists for this business.`);
        }
        // Create the corporate wallet document
        const walletRef = await db.collection(`businessAccounts/${businessId}/corporateWallets`).add({
            walletName,
            currency,
            balance: initialBalance,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: requesterId,
        });
        return { walletId: walletRef.id, message: 'Corporate wallet created successfully.' };
    }
    catch (error) {
        functions.logger.error('Error creating corporate wallet:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create corporate wallet.', error);
    }
});
//# sourceMappingURL=business.js.map