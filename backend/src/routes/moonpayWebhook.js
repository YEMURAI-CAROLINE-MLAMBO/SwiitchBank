const express = require('express');
const router = express.Router();
const moonpayWebhookController = require('../controllers/moonpayWebhookController');

// @route   POST api/moonpay-webhook
// @desc    Handle MoonPay webhooks
// @access  Public
router.post('/', moonpayWebhookController.handleWebhook);

module.exports = router;
