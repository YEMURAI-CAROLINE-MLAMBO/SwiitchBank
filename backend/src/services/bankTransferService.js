// backend/src/services/bankTransferService.js

const automatedSavingsService = require('./automatedSavingsService');
const logger = require('../utils/logger');

class BankTransferService {
  /**
   * Simulates an incoming bank transfer and triggers automated savings.
   * @param {string} userId The ID of the user receiving the transfer.
   * @param {number} amount The amount of the transfer.
   * @param {string} currency The currency of the transfer.
   */
  async handleIncomingTransfer(userId, amount, currency) {
    logger.info(
      `Processing incoming transfer of ${amount} ${currency} for user ${userId}.`
    );

    // In a real application, you would credit the user's main account here.

    // After the main account is credited, trigger the automated savings feature.
    try {
      await automatedSavingsService.triggerSavings(userId, amount, currency);
    } catch (error) {
      logger.error(
        `Failed to trigger automated savings for user ${userId}:`,
        error
      );
      // Even if savings fails, the main transfer should not be rolled back.
    }

    return { success: true, message: 'Incoming transfer processed.' };
  }
}

module.exports = new BankTransferService();
