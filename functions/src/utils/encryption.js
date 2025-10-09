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
 *p * @param {Buffer} key The encryption key, which must be 32 bytes long.
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

module.exports = {
  encrypt,
  decrypt,
};