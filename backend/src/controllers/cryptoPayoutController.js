// backend/src/controllers/cryptoController.js

const cryptoService = require('../services/cryptoService');
const logger = require('../utils/logger');

const getSupportedCurrencies = async (req, res) => {
  try {
    const supportedCurrencies = await cryptoService.getSupportedCurrencies();
    res.status(200).json(supportedCurrencies);
  } catch (error) {
    console.error('Error getting supported currencies:', error);
    res.status(500).json({ message: 'Error getting supported currencies' });
  }
};

const getExchangeRate = async (req, res) => {
  const { fromCurrency, toCurrency } = req.query;
  try {
    const rate = await cryptoService.getExchangeRate(fromCurrency, toCurrency);
    res.status(200).json({ rate });
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    res.status(500).json({ message: 'Error getting exchange rate' });
  }
};

const initiateCryptoPayout = async (req,