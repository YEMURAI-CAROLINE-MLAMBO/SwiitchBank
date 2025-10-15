import express from 'express';
const router = express.Router();
import FeeService from '../services/FeeService.js';

// Mock price data
const MOCK_PRICES = {
  BTC: 60000,
  ETH: 3000,
  USD: 1,
  USDC: 1,
};

router.post('/quote', (req, res) => {
  const { amount, fromAsset, toAsset, userTier } = req.body;

  if (!amount || !fromAsset || !toAsset) {
    return res.status(400).json({ message: 'Missing required fields: amount, fromAsset, toAsset' });
  }

  const fromPrice = MOCK_PRICES[fromAsset];
  const toPrice = MOCK_PRICES[toAsset];

  if (!fromPrice || !toPrice) {
    return res.status(400).json({ message: 'Invalid asset provided' });
  }

  // Calculate the quote
  const exchangeRate = fromPrice / toPrice;
  const toAmount = amount * exchangeRate;

  // For now, let's assume a fiat_to_crypto bridge type for fee calculation
  const fees = FeeService.calculateBridgeFees(amount * fromPrice, 'fiat_to_crypto', userTier);

  const quote = {
    exchangeRate,
    fee: fees.feeAmount,
    estimatedArrival: '2-3 business days',
    fromAsset,
    toAsset,
    fromAmount: amount,
    toAmount: toAmount - (fees.feeAmount / toPrice), // Subtract fee from destination amount
  };

  res.json(quote);
});

export default router;
