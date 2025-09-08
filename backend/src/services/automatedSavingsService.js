// backend/src/services/automatedSavingsService.js

const internalTransferService = require('./internalTransferService');
const automatedSavingsSettingsService = require('./automatedSavingsSettingsService');
const logger = require('../utils/logger');

class AutomatedSavingsService {
  /**
   * Triggers an automated savings transfer based on user settings.
   * @param {string} userId The ID of the user.
   * @param {number} incomingAmount The amount of incoming funds.
   * @param {string} currency The currency of the funds.
   */
  async triggerSavings(userId, incomingAmount, currency) {
    const settings = await automatedSavingsSettingsService.getSettings(userId);

    if (!settings.enabled) {
      logger.info(
        `Automated savings is disabled for user ${userId}. Skipping transfer.`
      );
      return;
    }

    const savingsRate = settings.percentage / 100;
    const savingsAmount = incomingAmount * savingsRate;

    if (savingsAmount <= 0) {
      logger.info('Savings amount is zero or less, skipping transfer.');
      return;
    }

    // TODO: In a real application, we would need to know the user's main and savings account IDs.
    // For this simulation, we'll use placeholder account IDs.
    const fromAccountId = `user_${userId}_main_account`;
    const toAccountId = `user_${userId}_savings_account`;

    try {
      const transferResult = await internalTransferService.createTransfer(
        fromAccountId,
        toAccountId,
        savingsAmount,
        currency
      );

      if (transferResult.success) {
        logger.info(
          `Successfully transferred ${savingsAmount} ${currency} to savings for user ${userId}.`
        );
      } else {
        logger.error(
          `Failed to transfer savings for user ${userId}: ${transferResult.message}`
        );
      }
    } catch (error) {
      logger.error(
        `Error during automated savings transfer for user ${userId}:`,
        error
      );
    }
  }
}

module.exports = new AutomatedSavingsService();
