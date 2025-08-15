const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getWallet);
router.post('/topup', walletController.topUpWallet);
router.get('/transactions', walletController.getWalletTransactions);

module.exports = router;
