import express from 'express';
const router = express.Router();
import { celebrate, Joi, Segments } from 'celebrate';
import { registerSchema, loginSchema } from '../utils/validators/authValidation.js';
import * as authController from '../controllers/authController.js';
import { protectLogin } from '../middleware/security.js';

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  celebrate({ [Segments.BODY]: registerSchema }),
  authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  celebrate({ [Segments.BODY]: loginSchema }),
  protectLogin,
  authController.login
);

export default router;
