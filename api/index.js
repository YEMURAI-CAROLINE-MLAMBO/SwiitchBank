// #############################################################################
// #  ARCHITECTURAL NOTE (2025-10-09)
// #############################################################################
// # This 'api' directory is one of TWO locations for Firebase Functions in this
// # project. The other, more modern, and more organized location is the
// # 'functions' directory at the root of the repository.
// #
// # It is strongly recommended that:
// #  1. All NEW Firebase Functions be added to the 'functions' directory.
// #  2. A plan be made to migrate the functions from this 'api' directory to the
// #     'functions' directory to consolidate the architecture.
// #
// # This will reduce confusion and improve the overall maintainability of the
// # project. Do not add new functions here.
// #############################################################################


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
const marqetaService = require('../shared/services/marqetaService');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts text using AES-256-CBC. A new, random IV is generated for each
 * encryption and prepended to the output.
 *
 * @param {string} text The text to encrypt.
 * @param {Buffer} key The encryption key, which must be 32 bytes long.
 * @returns {string} The encrypted text, formatted as 'iv:encryptedData'.
 * @throws {Error} If encryption fails.
 */
function encrypt(text, key) {
  if (!key || key.length !== 32) {
    throw new Error('A 32-byte encryption key is required.');
  }

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypts text that was encrypted with the encrypt function.
 *
 * @param {string} text The encrypted text ('iv:encryptedData').
 * @param {Buffer} key The encryption key, which must be 32 bytes long.
 * @returns {string} The decrypted text.
 * @throws {Error} If decryption fails.
 */
function decrypt(text, key) {
  if (!key || key.length !== 32) {
    throw new Error('A 32-byte encryption key is required.');
  }

  try {
    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format. Expected "iv:encryptedData".');
    }
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

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