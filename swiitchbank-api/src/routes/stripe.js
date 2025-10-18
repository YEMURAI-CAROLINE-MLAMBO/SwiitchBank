import express from 'express';
const router = express.Router();
import { check } from 'express-validator';
import * as stripeController from '../controllers/stripeController.js';
import auth from '../middleware/auth.js';

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

export default router;
