import { getCurrencies, getQuote } from '../services/moonpayService.js';

/**
 * Get a list of supported cryptocurrencies
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Promise<void>}
 */
export const getSupportedCurrenciesController = async (req, res) => {
  try {
    const currencies = await getCurrencies();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a quote for a specific cryptocurrency
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Promise<void>}
 */
export const getQuoteController = async (req, res) => {
  const { baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount } = req.query;
  try {
    const quote = await getQuote(baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
