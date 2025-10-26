import express from 'express';
import donationController from '../controllers/donationController.js';

const router = express.Router();

router.patch('/:id', donationController.updateTransactionStatus);

export default router;
