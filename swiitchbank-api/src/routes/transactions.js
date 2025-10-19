import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/auth.js';
import { celebrate, Joi, Segments } from 'celebrate';
import { topupVirtualCardSchema, withdrawVirtualCardSchema, topupWalletSchema, transferFundsSchema, createChargeSchema } from '../utils/validators/transactionValidation.js';
import * as virtualCardController from '../controllers/virtualCardController.js';
import * as walletController from '../controllers/walletController.js';
import { createPaymentIntentController } from '../controllers/stripeController.js';
import * as transactionAnalysisController from '../controllers/transactionAnalysisController.js';
import { getTransactionsController } from '../controllers/transactionController.js';

router.use(authMiddleware);

// Get all transactions
router.get('/', getTransactionsController);

// Virtual Card Transactions
router.post('/virtual-cards/:cardId/topup',
  celebrate({ [Segments.PARAMS]: Joi.object({ cardId: Joi.string().required() }), [Segments.BODY]: Joi.object({ amount: Joi.number().positive().required() }) }),
  virtualCardController.topupVirtualCard
);

router.post('/virtual-cards/:cardId/withdraw',
  celebrate({ [Segments.PARAMS]: Joi.object({ cardId: Joi.string().required() }), [Segments.BODY]: Joi.object({ amount: Joi.number().positive().required() }) }),
  virtualCardController.withdrawVirtualCard
);

// Wallet Transactions
router.post('/wallets/:walletId/topup',
  celebrate({ [Segments.PARAMS]: Joi.object({ walletId: Joi.string().required() }), [Segments.BODY]: Joi.object({ amount: Joi.number().positive().required() }) }),
  walletController.topupWallet
);
router.post('/wallets/:fromWalletId/transfer/:toWalletId',
  celebrate({ [Segments.PARAMS]: Joi.object({ fromWalletId: Joi.string().required(), toWalletId: Joi.string().required() }), [Segments.BODY]: Joi.object({ amount: Joi.number().positive().required() }) }),
  walletController.transferFunds
);

// Stripe Transactions
router.post('/stripe/charges',
  celebrate({ [Segments.BODY]: createChargeSchema }),
  createPaymentIntentController
);

// Transaction Analysis
router.post('/analysis', transactionAnalysisController.analyzeTransactions);

export default router;
