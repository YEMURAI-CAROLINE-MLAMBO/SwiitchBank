const { encrypt, decrypt } = require('../encryption');
const crypto = require('crypto');

describe('Encryption and Decryption', () => {
  const text = 'This is a secret message.';
  const key = crypto.randomBytes(32);

  it('should encrypt and decrypt a message successfully', () => {
    const encrypted = encrypt(text, key);
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(text);
  });

  it('should throw an error if the key is not 32 bytes', () => {
    const invalidKey = crypto.randomBytes(16);
    expect(() => encrypt(text, invalidKey)).toThrow('A 32-byte encryption key is required.');
    const encrypted = encrypt(text, key);
    expect(() => decrypt(encrypted, invalidKey)).toThrow('A 32-byte encryption key is required.');
  });

  it('should throw an error for invalid encrypted text format', () => {
    const invalidEncryptedText = 'invalid-text';
    expect(() => decrypt(invalidEncryptedText, key)).toThrow('Invalid encrypted text format. Expected "iv:encryptedData".');
  });
});
