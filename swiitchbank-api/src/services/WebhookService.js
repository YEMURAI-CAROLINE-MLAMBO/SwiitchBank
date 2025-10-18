import axios from 'axios';
import crypto from 'crypto';
import logger from '../utils/logger.js';

class WebhookService {
  /**
   * Triggers a webhook event by sending a POST request to a registered URL.
   * @param {string} eventType - The type of event (e.g., 'qr.payment_completed').
   * @param {object} data - The payload for the webhook.
   * @param {string} targetUrl - The URL to send the webhook to.
   * @param {string} secret - The secret key to sign the webhook payload.
   */
  static async trigger(eventType, data, targetUrl, secret) {
    const event_id = `evt_${crypto.randomBytes(12).toString('hex')}`;
    const timestamp = new Date().toISOString();

    const payload = {
      event_id,
      event_type: eventType,
      timestamp,
      data,
    };

    try {
      const signature = this.signRequest(payload, secret);

      await axios.post(targetUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'swb-whsec-signature': signature,
          'swb-whsec-timestamp': timestamp,
        },
        timeout: 5000, // 5 second timeout
      });

      logger.info(`Webhook event '${eventType}' sent successfully to ${targetUrl}`);
    } catch (error) {
      logger.error(`Failed to send webhook event '${eventType}' to ${targetUrl}:`, error.message);
      // Optional: Implement a retry mechanism here
    }
  }

  /**
   * Creates an HMAC-SHA256 signature for the webhook payload.
   * @param {object} payload - The webhook payload.
   * @param {string} secret - The secret key for signing.
   * @returns {string} The HMAC signature.
   */
  static signRequest(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `swb-whsec-${hmac.digest('hex')}`;
  }

  /**
   * Verifies an incoming webhook signature.
   * @param {string} receivedSignature - The signature from the request header.
   * @param {string} timestamp - The timestamp from the request header.
   * @param {object} payload - The raw request body.
   * @param {string} secret - The webhook secret.
   * @param {number} tolerance - The tolerance in seconds for replay attacks.
   * @returns {boolean} True if the signature is valid.
   */
  static verifySignature(receivedSignature, timestamp, payload, secret, tolerance = 300) {
    const now = Math.floor(Date.now() / 1000);
    const requestTimestamp = Math.floor(new Date(timestamp).getTime() / 1000);

    if (now - requestTimestamp > tolerance) {
      logger.warn('Webhook signature verification failed: Timestamp is too old.');
      return false; // Timestamp is outside the tolerance window
    }

    const expectedSignature = this.signRequest(payload, secret);

    if (!crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))) {
        logger.warn('Webhook signature verification failed: Mismatched signature.');
        return false;
    }

    return true;
  }
}

export default WebhookService;