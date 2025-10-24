import express from 'express';
import tithingTransactionController from '../controllers/tithingTransactionController.js';

const router = express.Router();

router.patch('/:id', tithingTransactionController.updateTransactionStatus);

export default router;
