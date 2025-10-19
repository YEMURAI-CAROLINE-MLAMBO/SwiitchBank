import express from 'express';
import { getReferralCodeController } from '../controllers/referralController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/code', auth, getReferralCodeController);

export default router;
