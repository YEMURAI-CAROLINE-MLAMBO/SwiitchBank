import express from 'express';
import { changePasswordController } from '../controllers/settingsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put('/password', auth, changePasswordController);

export default router;
