import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  updateProfileController,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.put('/profile', auth, updateProfileController);

export default router;
