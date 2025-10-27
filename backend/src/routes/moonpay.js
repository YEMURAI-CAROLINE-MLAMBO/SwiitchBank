import express from 'express';
import { getSupportedCurrenciesController, getQuoteController } from '../controllers/moonpayController.js';

const router = express.Router();

router.get('/currencies', getSupportedCurrenciesController);
router.get('/quote', getQuoteController);

export default router;
