const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const moonpayController = require('../controllers/moonpayController');
const auth = require('../middleware/auth');

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
      check(
        'baseCurrencyAmount',
        'Base currency amount is required'
      ).isDecimal(),
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
  [
    auth,
    [check('transactionData', 'Transaction data is required').not().isEmpty()],
  ],
  moonpayController.createTransaction
);

module.exports = router;
