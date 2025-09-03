/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const admin = require('firebase-admin');
const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Function to create a virtual card
exports.createVirtualCard = onRequest(async (request, response) => {
  logger.info("createVirtualCard function triggered.", { structuredData: true });

  const userId = request.body.userId;

  if (!userId) {
    response.status(400).send("Missing userId in request body.");
    return;
  }

  try {
    // TODO: Replace with actual virtual card generation logic from a provider
    const cardNumber = 'xxxx-xxxx-xxxx-xxxx'; // Placeholder
    const expiryDate = 'MM/YY'; // Placeholder
    const cvv = 'xxx'; // Placeholder

    // TODO: Securely encrypt sensitive card data before storing
    const cardDetails = {
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      // In a real application, CVV should be handled with extreme caution and not typically stored directly.
      // If stored, it must be heavily encrypted and access strictly controlled.
      cvv: cvv,
      userId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const cardRef = admin.firestore().collection('virtualCards').doc(userId);
    const doc = await cardRef.get();

    if (doc.exists) {
      // If a card already exists for this user, you might want to handle this.
      // For now, let's assume a user can only have one virtual card document
      // linked directly to their userId. You might need a subcollection for
      // multiple cards per user.
      logger.warn(`Virtual card already exists for user: ${userId}`, { structuredData: true });
      response.status(409).send("Virtual card already exists for this user.");
      return;
    }

    await cardRef.set(cardDetails);
    response.status(200).send({
      message: 'Virtual card created successfully',
      userId: userId,
      // In a real application, you might return non-sensitive card details
      // like the last 4 digits or a card reference ID.
      // cardNumber: cardNumber.slice(-4) // Example
    });
  } catch (error) {
    logger.error("Error creating virtual card:", error);
    response.status(500).send("Error creating virtual card.");
  }
});
// Firebase Function to top up a virtual card
exports.topUpVirtualCard = onRequest(async (request, response) => {
  logger.info("Topping up virtual card...", { structuredData: true });

  const userId = request.body.userId;
  const cardId = request.body.cardId; // Assuming cardId is the document ID in Firestore
  const amount = request.body.amount;

  // Basic input validation
  if (!userId || !cardId || amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
    response.status(400).send("Missing or invalid userId, cardId, or amount in request body.");
    return;
  }

  try {
    const cardRef = admin.firestore().collection('virtualCards').doc(cardId); // Assuming cardId is the document ID
    const doc = await cardRef.get();

    if (!doc.exists) {
      response.status(404).send("Virtual card not found.");
      return;
    }

    const currentBalance = doc.data().balance || 0; // Assuming a 'balance' field
    const newBalance = currentBalance + amount;

    await cardRef.update({ balance: newBalance, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    response.status(200).send({
      message: "Virtual card topped up successfully.",
      cardId: cardId,
      newBalance: newBalance
    });
  } catch (error) {
    logger.error("Error topping up virtual card:", error);
    response.status(500).send("Error topping up virtual card.");
  }
});