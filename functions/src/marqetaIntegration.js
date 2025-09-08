const functions = require('firebase-functions');
const admin = require('firebase-admin');
const marqetaService = require('../../backend/src/services/marqetaService.js');

admin.initializeApp();

// Create virtual card for user
exports.createVirtualCard = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    try {
        const userId = context.auth.uid;
        const userRecord = await admin.auth().getUser(userId);
        const userData = userRecord.toJSON();

        // Create user in Marqeta if not exists
        let marqetaUser;
        try {
            marqetaUser = await marqetaService.createUser({
                id: userId,
                firstName: userData.displayName?.split(' ')[0] || 'User',
                lastName: userData.displayName?.split(' ')[1] || '',
                email: userData.email,
                phone: userData.phoneNumber
            });
        } catch (error) {
            // User might already exist, try to get by token
            marqetaUser = { token: userId };
        }

        // Create virtual card
        const virtualCard = await marqetaService.createVirtualCard({
            userToken: marqetaUser.token,
            userId: userId,
            cardProductToken: data.cardProductToken
        });

        // Store card details in Firestore
        await admin.firestore().collection('virtual_cards').doc(virtualCard.token).set({
            userId: userId,
            marqetaCardToken: virtualCard.token,
            marqetaUserToken: marqetaUser.token,
            lastFour: virtualCard.last_four,
            expirationDate: virtualCard.expiration,
            cvv: virtualCard.cvv,
            status: virtualCard.state,
            balance: 0,
            currency: 'USD',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            card: {
                id: virtualCard.token,
                lastFour: virtualCard.last_four,
                expirationDate: virtualCard.expiration,
                status: virtualCard.state
            }
        };
    } catch (error) {
        console.error('Error creating virtual card:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// Handle Marqeta webhooks
exports.marqetaWebhook = functions.https.onRequest(async (req, res) => {
    try {
        await marqetaService.handleWebhook(req.body);
        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send('Error processing webhook');
    }
});

// Get card details
exports.getCardDetails = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    try {
        const cardDetails = await marqetaService.getCardDetails(data.cardToken);
        return { success: true, card: cardDetails };
    } catch (error) {
        console.error('Error getting card details:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});