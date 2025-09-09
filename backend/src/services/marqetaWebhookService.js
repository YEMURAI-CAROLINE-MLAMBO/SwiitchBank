// backend/src/services/marqetaWebhookService.js
const crypto = require('crypto');
const logger = require('../config/logger');

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
        // TODO: Process transaction events
        // These events indicate different stages of a transaction lifecycle.
        logger.info(`Processing transaction event: ${eventType}`);
        // Extract relevant transaction details from eventData
        const transactionDetails = {
          // Example fields (adapt based on actual Marqeta webhook payload)
          marqeta_transaction_token: eventData.token, // Unique identifier for the transaction in Marqeta
          marqeta_card_token: eventData.card_token, // Token of the virtual card
          marqeta_user_token: eventData.user_token, // Token of the user associated with the card
          amount: eventData.amount,
          currency: eventData.currency,
          state: eventData.state, // Current state of the transaction (e.g., PENDING, COMPLETION, DECLINED)
          created_time: eventData.created_time,
          merchant_details: eventData.merchant, // Merchant information
          transaction_type: eventType, // Store the specific webhook event type
          // ... other relevant fields
        };
        // TODO: Identify fee information in the webhook payload.
        // Marqeta webhook payloads for transactions may include details about interchange fees,
        // network fees, and other associated costs. Extract these details.
        // TODO: Calculate the revenue generated from this transaction based on the fee information.
        // TODO: Update transaction history in the database
        // Based on the transaction state, update your transaction table.
        // If state is PENDING, create a new transaction record.
        // If state is COMPLETION, update the transaction record with final details and potentially update the virtual card balance.
        // If state is DECLINED, update the transaction record with the declined status.
        logger.info(
          'Placeholder: Update transaction history in database with:',
          transactionDetails
        );
        break;
      }
      // TODO: Update the transaction record in the database to store the identified fee information
      // and the calculated revenue for this transaction.
      case 'card.state.change': {
        // TODO: Handle card state changes (e.g., activation, suspension)
        // This event indicates a change in the state of a virtual card.
        logger.info(`Processing card state change event: ${eventType}`);
        const marqetaCardToken = eventData.card_token; // Token of the virtual card
        const newState = eventData.state; // New state of the card (e.g., ACTIVE, SUSPENDED, TERMINATED)
        // TODO: Update card status in your database.
        // Find the virtual card in your database using the marqetaCardToken and update its status.
        logger.info(
          `Placeholder: Update card ${marqetaCardToken} state to ${newState} in database`
        );
        break;
      }
      case 'user.state.change': {
        // TODO: Handle user state changes
        logger.info(`Processing user state change event: ${eventType}`);
        const marqetaUserToken = eventData.user_token; // Token of the user
        const newUserState = eventData.state; // New state of the user
        // TODO: Update user status in your database if you are syncing user states with Marqeta.
        logger.info(
          `Placeholder: Update user ${marqetaUserToken} state to ${newUserState} in database`
        );
        break;
      }
      case 'balance.impact': {
        // TODO: Handle balance impact events (e.g., fees, adjustments)
        logger.info(`Processing balance impact event: ${eventType}`);
        const balanceImpactDetails = {
          marqeta_card_token: eventData.card_token,
          amount: eventData.amount,
          currency: eventData.currency,
          type: eventData.type, // Type of balance impact (e.g., FEE, ADJUSTMENT)
          // ... other relevant fields
        };
        // TODO: Update virtual card balance in your database based on the impact type and amount.
        logger.info(
          'Placeholder: Update virtual card balance based on balance impact:',
          balanceImpactDetails
        );
        break;
      }
      // TODO: Handle other relevant Marqeta webhook event types
      // Refer to Marqeta's webhook documentation for a full list of event types.
      default:
        logger.info(`Ignoring unknown event type: ${eventType}`);
        break;
    }

    // TODO: Send a success response back to Marqeta to acknowledge receipt
    // Marqeta expects a 200 OK response to consider the webhook successfully received.
  } catch (error) {
    logger.error('Error processing Marqeta webhook event:', error);
    // TODO: Implement error handling and potentially retry logic
  }
};

module.exports = {
  processWebhookEvent,
};
