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

/**
 * POST /api/business-accounts/:id/users
 * Add a user to a business account
 */
router.post('/:id/users',
  authenticate, // Ensure user is authenticated
  [
    body('userId').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
    body('role').notEmpty().withMessage('Role is required').isIn(['admin', 'member', 'owner']).withMessage('Invalid role'),
  ],
  validate, // Validate request body
  businessAccountController.addUserToBusinessAccount
);

/**
 * DELETE /api/business-accounts/:accountId/users/:userIdToRemove
 * Remove a user from a business account
 */
router.delete('/:accountId/users/:userIdToRemove',
  authenticate, // Ensure user is authenticated
  businessAccountController.removeUserFromBusinessAccount);
module.exports = router;
