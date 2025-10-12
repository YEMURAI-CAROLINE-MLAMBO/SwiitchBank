// backend/src/services/marqetaWebhookService.js

const { query } = require('../config/database');
const logger = require('../utils/logger');

const processWebhookEvent = async (event) => {
  try {
    logger.info('Received Marqeta webhook event:', event);

    // SECURITY: Implement webhook signature verification here.
    // If the signature is invalid, return a 401 Unauthorized error.

    const { type, payload } = event;

    switch (type) {
      case 'transaction.purchase':
      case 'transaction.withdrawal':
      case 'transaction.atm_withdrawal':
      case 'transaction.refund':
      case 'transaction.authorization':
      case 'transaction.clearing':
        logger.info(`Processing transaction event: ${type}`);
        await query(
          'INSERT INTO transactions (marqeta_transaction_token, marqeta_card_token, marqeta_user_token, amount, currency, state, transaction_type, merchant_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [payload.token, payload.card_token, payload.user_token, payload.amount, payload.currency, payload.state, type, payload.merchant]
        );
        break;

      case 'card.state.change':
        logger.info(`Processing card state change event: ${type}`);
        await query(
          'UPDATE virtual_cards SET status = $1 WHERE marqeta_card_token = $2',
          [payload.state, payload.card_token]
        );
        break;

      case 'user.state.change':
        logger.info(`Processing user state change event: ${type}`);
        await query(
          'UPDATE users SET status = $1 WHERE marqeta_user_token = $2',
          [payload.state, payload.user_token]
        );
        break;

      case 'balance.impact':
        logger.info(`Processing balance impact event: ${type}`);
        await query(
          'UPDATE virtual_cards SET balance = balance + $1 WHERE marqeta_card_token = $2',
          [payload.amount, payload.card_token]
        );
        break;

      default:
        logger.info(`Ignoring unknown event type: ${type}`);
        break;
    }

    return { success: true, message: 'Webhook processed successfully.' };

  } catch (error) {
    logger.error('Error processing Marqeta webhook event:', error);
    return { success: false, message: 'Error processing webhook event.' };
  }
};

module.exports = {
  processWebhookEvent,
};