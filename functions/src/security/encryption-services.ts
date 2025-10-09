import * as crypto from 'crypto';
import * as functions from 'firebase-functions';
const { encrypt, decrypt } = require('../utils/encryption');

const ENCRYPTION_MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY;
// A unique, static salt is required for scrypt. It should be stored securely as an environment variable.
const KEY_SALT = process.env.ENCRYPTION_KEY_SALT || 'a-default-and-insecure-salt';

export class EncryptionService {
  private key: Buffer;

  constructor() {
    if (!ENCRYPTION_MASTER_KEY) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set.');
    }
    // The new utility expects a 32-byte Buffer for the key.
    // We derive the key using scrypt, which is a secure key derivation function.
    this.key = crypto.scryptSync(ENCRYPTION_MASTER_KEY, KEY_SALT, 32);
  }

  /**
   * Encrypts a string using the centralized utility.
   * @param {string} text The plain text to encrypt.
   * @returns {string} The encrypted text.
   */
  encrypt(text: string): string {
    return encrypt(text, this.key);
  }

  /**
   * Decrypts a string using the centralized utility.
   * @param {string} encryptedText The encrypted text to decrypt.
   * @returns {string} The decrypted plain text.
   */
  decrypt(encryptedText: string): string {
    return decrypt(encryptedText, this.key);
  }
}

export function configureSecureEnvironment() {
  // This function can be used to perform environment setup or validation
  // related to security, like checking for required environment variables.
  if (!ENCRYPTION_MASTER_KEY) {
    functions.logger.error('ENCRYPTION_MASTER_KEY environment variable is not set!');
  }
  if (KEY_SALT === 'a-default-and-insecure-salt') {
      functions.logger.warn('ENCRYPTION_KEY_SALT is not set. Using a default salt is insecure for production.');
  }
  functions.logger.info('Secure environment configuration complete.');
}