const express = require('express');
const { body, query } = require('express-validator');
const {
  createBusinessAccount,
  checkBusinessNameAvailability,
} = require('../controllers/businessAccountController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('businessName').notEmpty().trim().escape(),
    body('address').notEmpty().trim().escape(),
    body('industry').notEmpty().trim().escape(),
  ],
  createBusinessAccount
);

router.get(
  '/availability',
  [query('businessName').notEmpty().trim().escape()],
  checkBusinessNameAvailability
);

router.post(
  '/:businessId/team-members',
  auth,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('role').isIn(['admin', 'accountant', 'operations']).withMessage('Invalid role'),
  ],
  businessAccountController.addTeamMember
);

router.put(
  '/:businessId/team-members/:memberId',
  auth,
  [body('role').isIn(['admin', 'accountant', 'operations']).withMessage('Invalid role')],
  businessAccountController.updateTeamMember
);

router.delete(
  '/:businessId/team-members/:memberId',
  auth,
  businessAccountController.removeTeamMember
);

module.exports = router;
