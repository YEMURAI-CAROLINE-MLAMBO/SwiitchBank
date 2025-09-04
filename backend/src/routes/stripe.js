const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const stripeController = require('../controllers/stripeController');
const auth = require('../middleware/auth');

// @route   POST api/stripe/customers
// @desc    Create a Stripe customer
// @access  Private
router.post(
  '/customers',
  [
    auth,
    [
      check('email', 'Please include a valid email').isEmail(),
      check('name', 'Name is required').not().isEmpty(),
    ],
  ],
  stripeController.createCustomer
);

// @route   POST api/stripe/charges
// @desc    Create a Stripe charge
// @access  Private
router.post(
  '/charges',
  [
    auth,
    [
      check('amount', 'Amount is required').isInt(),
      check('currency', 'Currency is required').not().isEmpty(),
      check('source', 'Source is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  stripeController.createCharge
);

module.exports = router;
