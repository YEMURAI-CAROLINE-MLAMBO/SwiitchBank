const admin = require('firebase-admin');
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const marqetaService = require('../../shared/services/marqetaService');
const { encrypt, decrypt } = require('./utils/crypto');
const crypto = require('crypto');

// Firebase Function to create a virtual card
exports.createVirtualCard = onRequest(async (request, response) => {
  logger.info("createVirtualCard function triggered.", { structuredData: true });

  const userId = request.body.userId;

  if (!userId) {
    response.status(400).send("Missing userId in request body.");
    return;
  }

  try {
    // Create the virtual card using the Marqeta service
    const cardData = await marqetaService.createCard({ userToken: userId /* additional details */ });

    // Derive the encryption key from the master key and salt
    const ENCRYPTION_MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY;
    const KEY_SALT = process.env.ENCRYPTION_KEY_SALT || 'a-default-and-insecure-salt';

    if (!ENCRYPTION_MASTER_KEY) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set.');
    }

    const key = crypto.scryptSync(ENCRYPTION_MASTER_KEY, KEY_SALT, 32);

    // Encrypt the sensitive card data
    const encryptedCardNumber = encrypt(cardData.pan, key);
    const encryptedExpiryDate = encrypt(cardData.expiration, key);
    const encryptedCvv = encrypt(cardData.cvv, key);

    const cardDetails = {
      cardNumber: encryptedCardNumber,
      expiryDate: encryptedExpiryDate,
      cvv: encryptedCvv,
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

// Firebase Function to get a virtual card
exports.getVirtualCard = onRequest(async (request, response) => {
  logger.info("getVirtualCard function triggered.", { structuredData: true });

  const userId = request.body.userId;

  if (!userId) {
    response.status(400).send("Missing userId in request body.");
    return;
  }

  try {
    const cardRef = admin.firestore().collection('virtualCards').doc(userId);
    const doc = await cardRef.get();

    if (!doc.exists) {
      response.status(404).send("Virtual card not found.");
      return;
    }

    const cardData = doc.data();

    // Derive the encryption key from the master key and salt
    const ENCRYPTION_MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY;
    const KEY_SALT = process.env.ENCRYPTION_KEY_SALT || 'a-default-and-insecure-salt';

    if (!ENCRYPTION_MASTER_KEY) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set.');
    }

    const key = crypto.scryptSync(ENCRYPTION_MASTER_KEY, KEY_SALT, 32);

    // Decrypt the sensitive card data
    const decryptedCardNumber = decrypt(cardData.cardNumber, key);
    const decryptedExpiryDate = decrypt(cardData.expiryDate, key);
    const decryptedCvv = decrypt(cardData.cvv, key);

    response.status(200).send({
      cardNumber: decryptedCardNumber,
      expiryDate: decryptedExpiryDate,
      cvv: decryptedCvv,
      userId: cardData.userId,
      createdAt: cardData.createdAt,
    });
  } catch (error) {
    logger.error("Error getting virtual card:", error);
    response.status(500).send("Error getting virtual card.");
  }
});
