import express from 'express';
import { updateProfileController } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', auth, updateProfileController);

export default router;
