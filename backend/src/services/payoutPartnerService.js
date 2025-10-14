// backend/src/services/payoutPartnerService.js

import logger from '../utils/logger.js';

/**
 * Simulates initiating a payout with a third-party partner.
 * @param {number} amount The amount to pay out.
 * @param {string} currency The currency of the payout.
 * @param {string} bankAccountId The bank account to send the payout to.
 * @returns {Promise<object>} The result of the payout initiation.
 */
const initiatePayout = async (amount, currency, bankAccountId) => {
  logger.info(`Initiating payout of ${amount} ${currency} to ${bankAccountId} with our partner.`);

  // Simulate API call to a third-party payout partner
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Deterministic success/failure for testing
  const success = !amount.toString().endsWith('.99');

  if (success) {
    const partnerTransactionId = `partner_${Date.now()}`;
    logger.info(`Payout of ${amount} ${currency} to ${bankAccountId} successful with partner. Transaction ID: ${partnerTransactionId}`);
    return {
      success: true,
      partnerTransactionId,
      status: 'completed',
    };
  } else {
    logger.error(`Payout of ${amount} ${currency} to ${bankAccountId} with partner failed.`);
    return {
      success: false,
      error: 'Partner payout failed',
    };
  }
};

export { initiatePayout };
