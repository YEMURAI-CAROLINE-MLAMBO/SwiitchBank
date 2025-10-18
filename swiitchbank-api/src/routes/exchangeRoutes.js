import express from 'express';
import { convertFiatToCrypto } from '../controllers/exchangeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/fiat-to-crypto').post(protect, convertFiatToCrypto);

export default router;
