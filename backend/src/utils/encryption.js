const crypto = require('crypto');
const config = require('../config/environment');
const logger = require('./logger');

const algorithm = 'aes-256-cbc';
const ivLength = 16;

/**
 * Encrypt text
 */
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(config.security.encryptionKey, 'hex'),
      iv
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt text
 */
function decrypt(text) {
  try {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(config.security.encryptionKey, 'hex'),
      iv
    );

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    logger.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
}

module.exports = {
  encrypt,
  decrypt,
};
