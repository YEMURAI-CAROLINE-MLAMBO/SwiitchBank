const express = require('express');
const { body, query } = require('express-validator');
const { createBusinessAccount, checkBusinessNameAvailability } = require('../controllers/businessAccountController');
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

module.exports = router;
