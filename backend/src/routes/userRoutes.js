import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
} from '../controllers/userController.js';
import apiLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(apiLimiter);

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

export default router;
