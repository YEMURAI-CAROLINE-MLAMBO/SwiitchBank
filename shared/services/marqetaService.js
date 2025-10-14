// shared/services/marqetaService.js

const MARQETA_API_URL = process.env.MARQETA_API_URL;
const MARQETA_API_KEY = process.env.MARQETA_API_KEY;

let marqetaApi; // Memoized client instance

/**
 * Asynchronously initializes and returns a memoized axios instance for Marqeta API requests.
 * This uses a dynamic import() to load axios, resolving CJS/ESM conflicts in test environments.
 * @returns {Promise<import('axios').AxiosInstance>} A promise that resolves with the axios instance.
 */
const getMarqetaApiClient = async () => {
  if (marqetaApi) {
    return marqetaApi;
  }

  const { default: axios } = await import('axios');

  marqetaApi = axios.create({
    baseURL: MARQETA_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(MARQETA_API_KEY).toString('base64')}`
    }
  });

  return marqetaApi;
};

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
      const client = await getMarqetaApiClient();
      console.log('Creating virtual card with Marqeta:', cardDetails);
      const response = await client.post('/cards', cardDetails);
      return response.data;
    } catch (error) {
      console.error('Error creating virtual card with Marqeta:', error.response ? error.response.data : error.message);
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
      const client = await getMarqetaApiClient();
      console.log('Activating virtual card with Marqeta:', cardToken);
      const response = await client.post(`/cards/${cardToken}/activation`);
      return response.data;
    } catch (error) {
      console.error(`Error activating virtual card with Marqeta (${cardToken}):`, error.response ? error.response.data : error.message);
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
      const client = await getMarqetaApiClient();
      console.log('Suspending virtual card with Marqeta:', cardToken);
      const response = await client.put(`/cards/${cardToken}`, { state: 'SUSPENDED' });
      return response.data;
    } catch (error) {
      console.error(`Error suspending virtual card with Marqeta (${cardToken}):`, error.response ? error.response.data : error.message);
      throw new Error('Failed to suspend virtual card');
    }
  },

  /**
   * Retrieves the details of a virtual card.
   * @param {string} cardToken - The token of the card to retrieve.
   * @returns {Promise<object>} - A promise that resolves with the card details.
   */
  getCardDetails: async (cardToken) => {
    try {
      const client = await getMarqetaApiClient();
      console.log('Retrieving details for card:', cardToken);
      const response = await client.get(`/cards/${cardToken}`);
      return response.data;
    } catch (error)      {
        console.error(`Error retrieving details for card ${cardToken}:`, error.response ? error.response.data : error.message);
        throw new Error('Failed to retrieve card details');
      }
    },

    /**
     * Retrieves the transactions for a virtual card.
     * @param {string} cardToken - The token of the card to retrieve transactions for.
     * @returns {Promise<object>} - A promise that resolves with the list of transactions.
     */
    getCardTransactions: async (cardToken) => {
      try {
        const client = await getMarqetaApiClient();
        console.log('Retrieving transactions for card:', cardToken);
        const response = await client.get(`/transactions/card/${cardToken}`);
        return response.data;
      } catch (error) {
        console.error(`Error retrieving transactions for card ${cardToken}:`, error.response ? error.response.data : error.message);
        throw new Error('Failed to retrieve card transactions');
      }
    },
  };

  module.exports = marqetaService;
