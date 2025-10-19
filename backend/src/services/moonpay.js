import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const moonpayApiKey = process.env.MOONPAY_API_KEY;
const moonpayApiUrl = 'https://api.moonpay.com/v1';

/**
 * Get a list of supported cryptocurrencies
 * @returns {Promise<object>} - A list of supported cryptocurrencies
 */
export const getSupportedCurrencies = async () => {
  try {
    const response = await axios.get(`${moonpayApiUrl}/currencies`, {
      headers: {
        'Authorization': `ApiKey ${moonpayApiKey}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error getting supported currencies: ${error.message}`);
  }
};

/**
 * Get a quote for a specific cryptocurrency
 * @param {string} baseCurrencyCode - The currency to buy
 * @param {string} quoteCurrencyCode - The currency to pay with
 * @param {number} baseCurrencyAmount - The amount of cryptocurrency to buy
 * @returns {Promise<object>} - The quote object
 */
export const getQuote = async (baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount) => {
  try {
    const response = await axios.get(`${moonpayApiUrl}/currencies/${baseCurrencyCode}/quote`, {
      params: {
        quoteCurrencyCode,
        baseCurrencyAmount
      },
      headers: {
        'Authorization': `ApiKey ${moonpayApiKey}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error getting quote: ${error.message}`);
  }
};
