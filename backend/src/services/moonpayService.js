import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const moonpay = axios.create({
  baseURL: 'https://api.moonpay.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `ApiKey ${process.env.MOONPAY_API_KEY}`,
  },
});

export const getCurrencies = async () => {
  try {
    const response = await moonpay.get('/currencies');
    return response.data;
  } catch (error) {
    logger.error('Error getting currencies from MoonPay:', error);
    throw new Error('Error getting currencies from MoonPay');
  }
};

export const getQuote = async (baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount) => {
  try {
    const response = await moonpay.get(`/currencies/${baseCurrencyCode}/quote`, {
      params: {
        quoteCurrencyCode,
        baseCurrencyAmount,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Error getting quote from MoonPay:', error);
    throw new Error('Error getting quote from MoonPay');
  }
};

export const handleWebhook = (req, res) => {
  const signature = req.headers['moonpay-signature-v2'];
  const timestamp = req.headers['moonpay-timestamp'];
  const body = req.rawBody; // Assuming rawBody is available
  const secret = process.env.MOONPAY_WEBHOOK_SECRET;

  try {
    const isValid = verifySignature(body, signature, timestamp, secret);
    if (!isValid) {
      logger.warn('Invalid MoonPay webhook signature');
      return res.status(401).send('Invalid signature');
    }

    const { type, data } = req.body;
    logger.info(`Received MoonPay webhook: ${type}`, data);

    // Process the webhook event (e.g., update transaction status)
    // Placeholder for actual processing logic
    switch (type) {
      case 'moonpay_transaction_updated':
        // Handle transaction updates
        break;
      default:
        logger.info(`Unhandled MoonPay webhook event type: ${type}`);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    logger.error('Error handling MoonPay webhook:', error);
    res.status(500).send('Internal Server Error');
  }
};

import crypto from 'crypto';

const verifySignature = (body, signature, timestamp, secret) => {
  // MoonPay's signature verification logic
  // This is a simplified example. Refer to MoonPay's documentation for the exact implementation.
  const sig = `timestamp=${timestamp}&body=${body}`;
  const hmac = crypto.createHmac('sha256', secret).update(sig).digest('hex');
  return hmac === signature;
};
