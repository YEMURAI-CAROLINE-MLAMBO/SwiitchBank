import express from 'express';
const router = express.Router();
import * as transactionAnalysisController from '../controllers/transactionAnalysisController.js';

router.post('/analyze', transactionAnalysisController.analyzeTransactions);

export default router;
