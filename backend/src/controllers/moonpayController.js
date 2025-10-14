import { validationResult } from 'express-validator';
import * as moonpayService from '../services/moonpay.js';

export const getQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { baseCurrencyCode, baseCurrencyAmount, quoteCurrencyCode } = req.body;

  try {
    const quote = await moonpayService.getQuote(
      baseCurrencyCode,
      baseCurrencyAmount,
      quoteCurrencyCode
    );
    res.json(quote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { transactionData } = req.body;

  try {
    const transaction = await moonpayService.createTransaction(transactionData);
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
