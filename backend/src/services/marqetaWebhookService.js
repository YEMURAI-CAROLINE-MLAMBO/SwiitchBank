// backend/src/services/marqetaWebhookService.js

import Transaction from '../models/Transaction.js';
import VirtualCard from '../models/VirtualCard.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const processWebhookEvent = async (event) => {
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
        await Transaction.create({
          marqetaTransactionToken: payload.token,
          marqetaCardToken: payload.card_token,
          marqetaUserToken: payload.user_token,
          amount: payload.amount,
          currency: payload.currency,
          state: payload.state,
          transactionType: type,
          merchantDetails: payload.merchant,
        });
        break;

      case 'card.state.change':
        logger.info(`Processing card state change event: ${type}`);
        await VirtualCard.updateOne(
          { marqetaCardToken: payload.card_token },
          { status: payload.state }
        );
        break;

      case 'user.state.change':
        logger.info(`Processing user state change event: ${type}`);
        await User.updateOne(
          { marqetaUserToken: payload.user_token },
          { status: payload.state }
        );
        break;

      case 'balance.impact':
        logger.info(`Processing balance impact event: ${type}`);
        await VirtualCard.updateOne(
          { marqetaCardToken: payload.card_token },
          { $inc: { balance: payload.amount } }
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
