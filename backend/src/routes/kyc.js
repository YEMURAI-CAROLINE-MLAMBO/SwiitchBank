const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');

router.post('/submit', kycController.submitKYC);
router.get('/status', kycController.getKYCStatus);

module.exports = router;
