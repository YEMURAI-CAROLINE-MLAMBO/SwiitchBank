import express from 'express';
import authRoutes from './auth.js';
import accountRoutes from './accounts.js';
import sophiaRoutes from './sophia.js';
import transactionRoutes from './transactions.js';
import bridgeRoutes from './bridgeRoutes.js';
import frameworkRoutes from './framework.js';
import qrRoutes from './qr.js';
import exchangeRoutes from './exchangeRoutes.js';
import paymentRoutes from './payments.js';
import ticketRoutes from './ticketRoutes.js';
import stripeRoutes from './stripe.js';
import moonpayRoutes from './moonpay.js';
import marqetaRoutes from './marqeta.js';
import dashboardRoutes from './dashboard.js';
import userRoutes from './userRoutes.js';
import swiitchPartyRoutes from './swiitchPartyRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/sophia', sophiaRoutes);
router.use('/transactions', transactionRoutes);
router.use('/bridge', bridgeRoutes);
router.use('/framework', frameworkRoutes);
router.use('/v1/qr', qrRoutes);
router.use('/exchange', exchangeRoutes);
router.use('/payments', paymentRoutes);
router.use('/stripe', stripeRoutes);
router.use('/moonpay', moonpayRoutes);
router.use('/marqeta', marqetaRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/user', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/swiitch-party', swiitchPartyRoutes);

export default router;
