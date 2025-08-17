const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming your auth middleware is here
const walletController = require('../controllers/walletController'); // We will create this controller next

// Apply authentication middleware to all wallet routes
router.use(auth);

// Placeholder POST route to create a wallet
router.post('/', walletController.createWallet);

// Add GET routes for listing and getting a specific wallet
router.get('/', walletController.listWallets);
router.get('/:walletId', walletController.getWalletById);

router.post('/:walletId/topup', walletController.topupWallet);

// Add POST route to transfer funds between wallets
router.post('/:fromWalletId/transfer/:toWalletId', walletController.transferFunds);

module.exports = router;