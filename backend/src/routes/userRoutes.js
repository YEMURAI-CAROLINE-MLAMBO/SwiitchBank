import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfileController,
  changePasswordController,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.put('/profile', auth, updateUserProfileController);
router.put('/password', auth, changePasswordController);

export default router;
