const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth'); // Assuming you have an auth middleware
const businessAccountController = require('../controllers/businessAccountController');
const router = express.Router();

/**
 * GET /api/business-accounts
 * Get list of user's business accounts
 */
router.get('/',
  authenticate, // Ensure user is authenticated
  businessAccountController.getBusinessAccounts
);

/**
 * POST /api/business-accounts
 * Create a new business account
 */
router.post('/',
  authenticate, // Ensure user is authenticated
  [body('name').notEmpty().withMessage('Business account name is required').trim().escape()],
  validate, // Validate request body
  businessAccountController.createBusinessAccount
);

/**
 * GET /api/business-accounts/:id
 * Get details of a specific business account
 */
router.get('/:id',
 authenticate, // Ensure user is authenticated
 businessAccountController.getBusinessAccountById
);

module.exports = router;
