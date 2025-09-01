// backend/src/controllers/automatedSavingsSettingsController.js

const automatedSavingsSettingsService = require('../services/automatedSavingsSettingsService');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/automated-savings/settings/{userId}:
 *   get:
 *     summary: Get automated savings settings for a user
 *     tags: [AutomatedSavings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 */
const getSettings = async (req, res) => {
  const { userId } = req.params;
  try {
    const settings = await automatedSavingsSettingsService.getSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    logger.error('Error getting automated savings settings:', error);
    res.status(500).json({ message: 'Error getting automated savings settings.' });
  }
};

/**
 * @swagger
 * /api/automated-savings/settings/{userId}:
 *   put:
 *     summary: Update automated savings settings for a user
 *     tags: [AutomatedSavings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enabled
 *               - percentage
 *             properties:
 *               enabled:
 *                 type: boolean
 *               percentage:
 *                 type: number
 */
const updateSettings = async (req, res) => {
  const { userId } = req.params;
  const newSettings = req.body;
  try {
    const updatedSettings = await automatedSavingsSettingsService.updateSettings(userId, newSettings);
    res.status(200).json(updatedSettings);
  } catch (error) {
    logger.error('Error updating automated savings settings:', error);
    res.status(500).json({ message: 'Error updating automated savings settings.' });
  }
};

module.exports = { getSettings, updateSettings };
