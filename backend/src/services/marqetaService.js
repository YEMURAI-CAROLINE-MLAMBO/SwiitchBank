// backend/src/services/marqetaService.js
// Note: 'axios' is used to make HTTP requests. You'll need to add it to your project's dependencies.
// You can do this by running `npm install axios` or `yarn add axios` in your backend directory.
const axios = require('axios');
const logger = require('../config/logger');

const MARQETA_API_URL = process.env.MARQETA_API_URL;
const MARQETA_API_KEY = process.env.MARQETA_API_KEY;

// Create an axios instance for Marqeta API requests
const marqetaApi = axios.create({
  baseURL: MARQETA_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(MARQETA_API_KEY).toString('base64')}`,
  },
});

/**
 * Service for interacting with the Marqeta API for virtual card management.
 */
const marqetaService = {
  /**
   * Creates a new virtual card.
   * @param {object} cardDetails - Details for the new card (e.g., user token, card product token).
   * @returns {Promise<object>} - A promise that resolves with the created card details.
   */
  createCard: async (cardDetails) => {
    try {
      logger.info('Creating virtual card with Marqeta:', cardDetails);
      const response = await marqetaApi.post('/cards', cardDetails);
      return response.data;
    } catch (error) {
      logger.error(
        'Error creating virtual card with Marqeta:',
        error.response ? error.response.data : error.message
      );
      throw new Error('Failed to create virtual card');
    }
  },

  /**
   * Activates a virtual card.
   * @param {string} cardToken - The token of the card to activate.
   * @returns {Promise<object>} - A promise that resolves with the updated card details.
   */
  activateCard: async (cardToken) => {
    try {
      logger.info('Activating virtual card with Marqeta:', cardToken);
      const response = await marqetaApi.post(`/cards/${cardToken}/activation`);
      return response.data;
    } catch (error) {
      logger.error(
        `Error activating virtual card with Marqeta (${cardToken}):`,
        error.response ? error.response.data : error.message
      );
      throw new Error('Failed to activate virtual card');
    }
  },

  /**
   * Suspends a virtual card.
   * @param {string} cardToken - The token of the card to suspend.
   * @returns {Promise<object>} - A promise that resolves with the updated card details.
   */
  suspendCard: async (cardToken) => {
    try {
      logger.info('Suspending virtual card with Marqeta:', cardToken);
      const response = await marqetaApi.put(`/cards/${cardToken}`, {
        state: 'SUSPENDED',
      });
      return response.data;
    } catch (error) {
      logger.error(
        `Error suspending virtual card with Marqeta (${cardToken}):`,
        error.response ? error.response.data : error.message
      );
      throw new Error('Failed to suspend virtual card');
    }
  },

};

module.exports = marqetaService;
