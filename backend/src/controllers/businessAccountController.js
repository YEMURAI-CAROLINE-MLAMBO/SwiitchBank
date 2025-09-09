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
    const newAccount = await businessAccountService.createBusinessAccount(
      accountDetails
    );
    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error creating business account:', error);
    res.status(500).send('Server error');
  }
};

exports.addTeamMember = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { businessId } = req.params;
    const { email, role } = req.body;
    const teamMember = await businessAccountService.addTeamMember(
      businessId,
      email,
      role
    );
    res.status(201).json(teamMember);
  } catch (error) {
    next(error);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { businessId, memberId } = req.params;
    const { role } = req.body;
    const teamMember = await businessAccountService.updateTeamMember(
      businessId,
      memberId,
      role
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

exports.removeTeamMember = async (req, res, next) => {
  try {
    const { businessId, memberId } = req.params;
    await businessAccountService.removeTeamMember(businessId, memberId);
    res.status(204).send();
  } catch (error) {
    next(error);
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
    const isAvailable =
      await businessAccountService.checkBusinessNameAvailability(businessName);
    res.json({ isAvailable });
  } catch (error) {
    console.error('Error checking business name availability:', error);
    res.status(500).send('Server error');
  }
};
