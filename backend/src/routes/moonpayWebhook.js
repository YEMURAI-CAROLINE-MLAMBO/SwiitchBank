import express from 'express';
const router = express.Router();
import * as moonpayWebhookController from '../controllers/moonpayWebhookController.js';

// @route   POST api/moonpay-webhook
// @desc    Handle MoonPay webhooks
// @access  Public
router.post('/', moonpayWebhookController.handleWebhook);

export default router;
