import crypto from 'crypto';
import QRCode from 'qrcode';

const P2P_QR_SCHEMA_VERSION = 'v1';
const QR_PAYLOAD_TYPE = 'p2p';
const PLATFORM_NAME = 'switchbank';

class QrCodeService {
  /**
   * Generates a signed QR code payload for a P2P payment.
   * @param {string} recipientId - The user ID of the recipient.
   * @param {number} amount - The payment amount.
   * @param {string} currency - The currency code (e.g., "USD").
   * @param {string} memo - A short description for the payment.
   * @param {number} expiresIn - The number of seconds until the QR code expires.
   * @returns {{payload: object, signature: string, qrDataUri: string}}
   */
  static async generateP2pQrCode(recipientId, amount, currency, memo, expiresIn, secret) {
    const expires = Math.floor(Date.now() / 1000) + expiresIn;
    const payload = {
      v: P2P_QR_SCHEMA_VERSION,
      type: QR_PAYLOAD_TYPE,
      platform: PLATFORM_NAME,
      recipient: recipientId,
      amount: amount,
      currency: currency,
      memo: memo,
      expires: expires,
    };

    const signature = this.signPayload(payload, secret);
    payload.signature = signature;

    const qrDataString = `switchbank://pay/${P2P_QR_SCHEMA_VERSION}/${Buffer.from(JSON.stringify(payload)).toString('base64url')}`;
    const qrDataUri = await QRCode.toDataURL(qrDataString, { errorCorrectionLevel: 'H' });

    return { payload, signature, qrDataUri };
  }

  /**
   * Signs a payload using HMAC-SHA256.
   * @param {object} payload - The JSON object to sign.
   * @param {string} secret - The HMAC secret key.
   * @returns {string} - The HMAC signature.
   */
  static signPayload(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    // Important: The payload must be stringified consistently.
    const payloadString = JSON.stringify(payload);
    hmac.update(payloadString);
    return hmac.digest('hex');
  }

  /**
   * Verifies the signature of a QR code payload.
   * @param {object} payload - The received payload, including the signature.
   * @param {string} secret - The HMAC secret key.
   * @returns {boolean} - True if the signature is valid, false otherwise.
   */
  static verifyP2pQrCode(payload, secret) {
    if (!payload.signature) {
      return false;
    }

    const receivedSignature = payload.signature;
    const payloadToVerify = { ...payload };
    delete payloadToVerify.signature;

    const expectedSignature = this.signPayload(payloadToVerify, secret);
    return crypto.timingSafeEqual(Buffer.from(receivedSignature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  }
}

export default QrCodeService;