import ExchangeService from '../services/ExchangeService.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Convert fiat to crypto
// @route   POST /api/exchange/fiat-to-crypto
// @access  Private
const convertFiatToCrypto = asyncHandler(async (req, res) => {
  const { amount, fromCurrency, toCrypto } = req.body;

  if (!amount || !fromCurrency || !toCrypto) {
    res.status(400);
    throw new Error('Please provide amount, fromCurrency, and toCrypto');
  }

  const result = await ExchangeService.convertFiatToCrypto(
    amount,
    fromCurrency,
    toCrypto
  );

  res.status(200).json(result);
});

// @desc    Convert crypto to fiat
// @route   POST /api/exchange/crypto-to-fiat
// @access  Private
const convertCryptoToFiat = asyncHandler(async (req, res) => {
  const { amount, fromCrypto, toCurrency } = req.body;

  if (!amount || !fromCrypto || !toCurrency) {
    res.status(400);
    throw new Error('Please provide amount, fromCrypto, and toCurrency');
  }

  const result = await ExchangeService.convertCryptoToFiat(
    amount,
    fromCrypto,
    toCurrency
  );

  res.status(200).json(result);
});

export { convertFiatToCrypto, convertCryptoToFiat };
