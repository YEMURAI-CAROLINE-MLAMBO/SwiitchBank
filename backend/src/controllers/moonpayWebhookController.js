const crypto = require('crypto');
const logger = require('../config/logger');

exports.handleWebhook = (req, res) => {
  const signatureHeader = req.header('MoonPay-Signature-V2');
  if (!signatureHeader) {
    return res.status(401).send('No signature header');
  }

  const [timestamp, signature] = signatureHeader
    .split(',')
    .reduce((acc, part) => {
      const [key, value] = part.split('=');
      acc[key] = value;
      return acc;
    }, {});

  if (!timestamp || !signature) {
    return res.status(401).send('Invalid signature header format');
  }

  const body = JSON.stringify(req.body);
  const message = `${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.MOONPAY_WEBHOOK_SECRET)
    .update(message)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  // Process the webhook event
  const { type, data } = req.body;

  switch (type) {
    case 'transaction_created':
      // Handle transaction created event
      logger.info('Transaction created:', data);
      break;
    case 'transaction_updated':
      // Handle transaction updated event
      logger.info('Transaction updated:', data);
      break;
    case 'transaction_failed':
      // Handle transaction failed event
      logger.info('Transaction failed:', data);
      break;
    // Add other event types as needed
    default:
      logger.info('Unhandled event type:', type);
  }

  res.status(200).send('Webhook received');
};
