
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const businessAccountController = require('../controllers/businessAccountController');
const auth = require('../middleware/auth');

// @route   POST api/onboarding/business
// @desc    Create a new business account
// @access  Private
router.post(
  '/business',
  [
    auth,
    [
      check('businessName', 'Business name is required').not().isEmpty(),
      check('businessAddress', 'Business address is required').not().isEmpty(),
      check('taxId', 'Tax ID is required').not().isEmpty(),
    ],
  ],
  businessAccountController.createBusinessAccount
);

// @route   GET api/onboarding/business/availability
// @desc    Check if a business name is available
// @access  Public
router.get('/business/availability', [
    check('businessName', 'Business name is required').not().isEmpty()
], businessAccountController.checkBusinessNameAvailability);


module.exports = router;
