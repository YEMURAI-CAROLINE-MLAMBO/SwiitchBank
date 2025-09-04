const axios = require('axios');

const moonpay = axios.create({
  baseURL: 'https://api.moonpay.com/v3',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `ApiKey ${process.env.MOONPAY_API_KEY}`,
  },
});

/**
 * Get a quote for a cryptocurrency transaction.
 * @param {string} baseCurrencyCode - The currency to sell.
 * @param {number} baseCurrencyAmount - The amount of the base currency to sell.
 * @param {string} quoteCurrencyCode - The currency to buy.
 * @returns {object} The quote object.
 */
exports.getQuote = async (
  baseCurrencyCode,
  baseCurrencyAmount,
  quoteCurrencyCode
) => {
  try {
    const response = await moonpay.get(
      `/currencies/${baseCurrencyCode}/quote?baseCurrencyAmount=${baseCurrencyAmount}&quoteCurrencyCode=${quoteCurrencyCode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting MoonPay quote:', error);
    throw error;
  }
};

/**
 * Create a new transaction.
 * @param {object} transactionData - The transaction data.
 * @returns {object} The created transaction object.
 */
exports.createTransaction = async (transactionData) => {
  try {
    const response = await moonpay.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating MoonPay transaction:', error);
    throw error;
  }
};
