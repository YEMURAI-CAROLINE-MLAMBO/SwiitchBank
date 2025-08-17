const express = require('express');
const router = express.Router();
const cryptoPayoutController = require('../controllers/cryptoPayoutController');
const { protect } = require('../middleware/auth'); // Assuming your auth middleware is here

// Protect all routes in this router
router.use(protect);

// Placeholder POST route to initiate a crypto-to-bank payout
router.post('/initiate', cryptoPayoutController.initiatePayout);

router.get('/supported-currencies', cryptoPayoutController.getSupportedCurrencies);

router.get('/exchange-rate', cryptoPayoutController.getExchangeRate);

module.exports = router;