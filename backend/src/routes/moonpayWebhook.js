const express = require('express');
const router = express.Router();
const moonpayWebhookController = require('../controllers/moonpayWebhookController');
const apiLimiter = require('../middleware/rateLimiter');

// @route   POST api/moonpay-webhook
// @desc    Handle MoonPay webhooks
// @access  Public
router.post('/', apiLimiter, moonpayWebhookController.handleWebhook);

module.exports = router;
