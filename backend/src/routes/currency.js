import express from 'express';
import CurrencyService from '../services/CurrencyService.js';
// FIXME: This is a placeholder for authentication middleware.
// In a real application, this should be replaced with a proper JWT or session-based authentication middleware.
// For demonstration purposes, it mocks a user object.
const auth = (req, res, next) => {
  // Mock user object for development
  req.user = { id: 'mockUserId' };
  next();
};

const router = express.Router();

router.get('/rates', auth, async (req, res) => {
  const { base = 'USD', symbols } = req.query;

  try {
    if (symbols) {
        const rates = await CurrencyService.getExchangeRates(base, symbols.split(','));
        res.json({ base, rates, timestamp: new Date() });
    } else {
        res.status(400).json({ error: 'Symbols query parameter is required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

router.post('/convert', auth, async (req, res) => {
  const { amount, from, to } = req.body;

  try {
    const result = await CurrencyService.convertAmount(amount, from, to);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

router.get('/net-worth', auth, async (req, res) => {
  const { currency } = req.query;

  try {
    const netWorth = await CurrencyService.calculateMultiCurrencyNetWorth(
      req.user.id,
      currency
    );
    res.json(netWorth);
  } catch (error) {
    console.error('Error calculating net worth:', error);
    res.status(500).json({ error: 'Failed to calculate net worth' });
  }
});

export default router;
