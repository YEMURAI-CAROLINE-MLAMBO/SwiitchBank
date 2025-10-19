import express from 'express';
import { createPaymentIntentController, handleWebhookController } from '../controllers/stripeController.js';

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntentController);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhookController);

export default router;
