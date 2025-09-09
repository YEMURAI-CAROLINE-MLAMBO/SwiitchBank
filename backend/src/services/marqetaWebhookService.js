// backend/src/services/marqetaWebhookService.js
const crypto = require('crypto');
const logger = require('../config/logger');
const { query } = require('../config/database');

const verifySignature = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

const processWebhookEvent = async (event, signature) => {
  try {
    logger.info('Received Marqeta webhook event:', event);

    const webhookSecret = process.env.MARQETA_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('Marqeta webhook secret is not configured.');
      return;
    }

    if (!verifySignature(JSON.stringify(event.payload), signature, webhookSecret)) {
      logger.error('Invalid webhook signature');
      return;
    }

    const eventType = event.type;
    const eventData = event.payload;

    switch (eventType) {
      case 'transaction.purchase':
      case 'transaction.withdrawal':
      case 'transaction.atm_withdrawal':
      case 'transaction.refund':
      case 'transaction.authorization':
      case 'transaction.clearing': {
        await processTransactionEvent(eventData);
        break;
      }
      // TODO: Update the transaction record in the database to store the identified fee information
      // and the calculated revenue for this transaction.
      case 'card.state.change': {
        await processCardStateChangeEvent(eventData);
        break;
      }
      case 'user.state.change': {
        await processUserStateChangeEvent(eventData);
        break;
      }
      case 'balance.impact': {
        await processBalanceImpactEvent(eventData);
        break;
      }
      // TODO: Handle other relevant Marqeta webhook event types
      // Refer to Marqeta's webhook documentation for a full list of event types.
      default:
        logger.info(`Ignoring unknown event type: ${eventType}`);
        break;
    }

    res.status(200).send();
  } catch (error) {
    logger.error('Error processing Marqeta webhook event:', error);
    res.status(500).send();
  }
};

const processTransactionEvent = async (eventData) => {
  const {
    token,
    card_token,
    user_token,
    amount,
    currency,
    state,
    created_time,
    merchant,
  } = eventData;

  const transactionDetails = {
    marqeta_transaction_token: token,
    marqeta_card_token: card_token,
    marqeta_user_token: user_token,
    amount,
    currency,
    state,
    created_time,
    merchant_details: merchant,
  };

  try {
    const { rows } = await query(
      `
      INSERT INTO transactions (marqeta_transaction_token, marqeta_card_token, marqeta_user_token, amount, currency, state, created_time, merchant_details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (marqeta_transaction_token) DO UPDATE SET
        state = EXCLUDED.state,
        amount = EXCLUDED.amount
      RETURNING *
    `,
      [
        token,
        card_token,
        user_token,
        amount,
        currency,
        state,
        created_time,
        merchant,
      ]
    );
    logger.info('Transaction processed successfully:', rows[0]);
  } catch (error) {
    logger.error('Error processing transaction event:', error);
  }
};

const processCardStateChangeEvent = async (eventData) => {
  const { card_token, state } = eventData;
  try {
    const { rows } = await query(
      `
      UPDATE virtual_cards
      SET status = $1
      WHERE marqeta_card_token = $2
      RETURNING *
    `,
      [state, card_token]
    );
    logger.info('Card state change processed successfully:', rows[0]);
  } catch (error) {
    logger.error('Error processing card state change event:', error);
  }
};

const processUserStateChangeEvent = async (eventData) => {
  const { user_token, state } = eventData;
  try {
    const { rows } = await query(
      `
      UPDATE users
      SET status = $1
      WHERE marqeta_user_token = $2
      RETURNING *
    `,
      [state, user_token]
    );
    logger.info('User state change processed successfully:', rows[0]);
  } catch (error) {
    logger.error('Error processing user state change event:', error);
  }
};

const processBalanceImpactEvent = async (eventData) => {
  const { card_token, amount } = eventData;
  try {
    const { rows } = await query(
      `
      UPDATE virtual_cards
      SET balance = balance + $1
      WHERE marqeta_card_token = $2
      RETURNING *
    `,
      [amount, card_token]
    );
    logger.info('Balance impact processed successfully:', rows[0]);
  } catch (error) {
    logger.error('Error processing balance impact event:', error);
  }
};

module.exports = {
  processWebhookEvent,
};
