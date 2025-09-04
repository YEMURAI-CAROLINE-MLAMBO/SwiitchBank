const { validationResult } = require('express-validator');
const businessAccountService = require('../services/businessAccountService');

// @desc    Create a new business account
// @route   POST api/onboarding/business
// @access  Private
exports.createBusinessAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const accountDetails = req.body;
    const newAccount = await businessAccountService.createBusinessAccount(accountDetails);
    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error creating business account:', error);
    res.status(500).send('Server error');
  }
};

// @desc    Check if a business name is available
// @route   GET api/onboarding/business/availability
// @access  Public
exports.checkBusinessNameAvailability = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { businessName } = req.query;
        const isAvailable = await businessAccountService.checkBusinessNameAvailability(businessName);
        res.json({ isAvailable });
    } catch (error) {
        console.error('Error checking business name availability:', error);
        res.status(500).send('Server error');
    }
};
