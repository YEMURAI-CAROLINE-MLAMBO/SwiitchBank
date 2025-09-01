// backend/src/services/automatedSavingsSettingsService.js

const logger = require('../utils/logger');

// In a real application, these settings would be stored in a database.
const userSettings = {};

class AutomatedSavingsSettingsService {
  /**
   * Gets the automated savings settings for a user.
   * @param {string} userId The ID of the user.
   * @returns {Promise<object>} The user's settings.
   */
  async getSettings(userId) {
    const settings = userSettings[userId] || { enabled: false, percentage: 10 };
    logger.info(`Retrieved automated savings settings for user ${userId}.`);
    return settings;
  }

  /**
   * Updates the automated savings settings for a user.
   * @param {string} userId The ID of the user.
   * @param {object} newSettings The new settings.
   * @returns {Promise<object>} The updated settings.
   */
  async updateSettings(userId, newSettings) {
    const { enabled, percentage } = newSettings;
    if (enabled === undefined || percentage === undefined) {
      throw new Error('Invalid settings provided.');
    }
    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100.');
    }

    userSettings[userId] = { enabled, percentage };
    logger.info(`Updated automated savings settings for user ${userId}.`);
    return userSettings[userId];
  }
}

module.exports = new AutomatedSavingsSettingsService();
