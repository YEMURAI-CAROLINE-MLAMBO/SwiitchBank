import * as crypto from 'crypto';
import * as functions from 'firebase-functions';

const ENCRYPTION_MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY; // Placeholder

export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  private key: Buffer;
  private iv: Buffer;

  constructor() {
    if (!ENCRYPTION_MASTER_KEY) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set.');
    }
    this.key = crypto.scryptSync(ENCRYPTION_MASTER_KEY, 'salt', 32); // Replace 'salt' with a strong, unique salt
    this.iv = crypto.randomBytes(16); // Initialization vector
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return this.iv.toString('hex') + ':' + encrypted; // Prepend IV for decryption
  }

  decrypt(encryptedText: string): string {
    const [ivHex, textHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(textHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export function configureSecureEnvironment() {
  // This function can be used to perform environment setup or validation
  // related to security, like checking for required environment variables.
  if (!ENCRYPTION_MASTER_KEY) {
    functions.logger.error('ENCRYPTION_MASTER_KEY environment variable is not set!');
    // Depending on your application's requirements, you might want to
    // throw an error or take other action here.
  }
  functions.logger.info('Secure environment configuration complete.');
}