import * as moonpayService from '../services/moonpayService.js';
import logger from '../utils/logger.js';

export const getCurrencies = async (req, res) => {
  try {
    const currencies = await moonpayService.getCurrencies();
    res.status(200).json(currencies);
  } catch (error) {
    logger.error('Error getting currencies from MoonPay:', error);
    res.status(500).json({ message: 'Error getting currencies from MoonPay' });
  }
};

export const getQuote = async (req, res) => {
  // TODO: Implement getQuote
  res.status(501).json({ message: 'Not implemented' });
};

export const createTransaction = async (req, res) => {
  // TODO: Implement createTransaction
  res.status(501).json({ message: 'Not implemented' });
};
