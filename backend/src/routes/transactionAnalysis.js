const express = require('express');
const router = express.Router();
const transactionAnalysisController = require('../controllers/transactionAnalysisController');
const apiLimiter = require('../middleware/rateLimiter');
const { body } = require('express-validator');

router.post(
  '/analyze',
  apiLimiter,
  [
    body('transactions')
      .isArray()
      .withMessage('Transactions must be an array')
      .notEmpty()
      .withMessage('Transactions array cannot be empty'),
  ],
  transactionAnalysisController.analyzeTransactions
);

module.exports = router;
