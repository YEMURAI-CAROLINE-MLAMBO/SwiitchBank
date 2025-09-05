const express = require('express');
const router = express.Router();
const transactionAnalysisController = require('../controllers/transactionAnalysisController');

router.post('/analyze', transactionAnalysisController.analyzeTransactions);

module.exports = router;
