import express from 'express';
import { getSupportedCurrenciesController, getQuoteController } from '../controllers/moonpayController.js';
import { handleWebhookController } from '../controllers/moonpayWebhookController.js';

const router = express.Router();

router.get('/currencies', getSupportedCurrenciesController);
router.get('/quote', getQuoteController);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhookController);

export default router;
