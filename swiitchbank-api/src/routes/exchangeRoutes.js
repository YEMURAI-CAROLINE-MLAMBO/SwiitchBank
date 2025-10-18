import express from 'express';
import {
  convertFiatToCrypto,
  convertCryptoToFiat,
} from '../controllers/exchangeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/fiat-to-crypto').post(protect, convertFiatToCrypto);
router.route('/crypto-to-fiat').post(protect, convertCryptoToFiat);

export default router;
