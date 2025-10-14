import express from 'express';
const router = express.Router();
import { check } from 'express-validator';
import * as moonpayController from '../controllers/moonpayController.js';
import auth from '../middleware/auth.js';

// @route   POST api/moonpay/quote
// @desc    Get a MoonPay quote
// @access  Private
router.post(
  '/quote',
  [
    auth,
    [
      check('baseCurrencyCode', 'Base currency code is required')
        .not()
        .isEmpty(),
      check('baseCurrencyAmount', 'Base currency amount is required').isDecimal(),
      check('quoteCurrencyCode', 'Quote currency code is required')
        .not()
        .isEmpty(),
    ],
  ],
  moonpayController.getQuote
);

// @route   POST api/moonpay/transactions
// @desc    Create a MoonPay transaction
// @access  Private
router.post(
  '/transactions',
  [auth, [check('transactionData', 'Transaction data is required').not().isEmpty()]],
  moonpayController.createTransaction
);

export default router;
