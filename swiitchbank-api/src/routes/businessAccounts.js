import express from 'express';
import { body, query } from 'express-validator';
import { createBusinessAccount, checkBusinessNameAvailability } from '../controllers/businessAccountController.js';
import auth from '../middleware/auth.js';

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

export default router;
