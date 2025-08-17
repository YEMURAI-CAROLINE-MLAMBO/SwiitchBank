const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the authentication middleware
const virtualCardController = require('../controllers/virtualCardController');


// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

// Use the controller functions for the routes
router.get('/', virtualCardController.listVirtualCards);

// Placeholder GET route to get a specific virtual card by ID
router.get('/:cardId', virtualCardController.getVirtualCardById);
// Placeholder POST route to create a virtual card
router.post('/', virtualCardController.createVirtualCard);
router.post('/:cardId/topup', virtualCardController.topupVirtualCard);
router.post('/:cardId/withdraw', virtualCardController.withdrawVirtualCard);

// Add a GET route to list transactions for a virtual card
router.get('/:cardId/transactions', virtualCardController.listCardTransactions);

module.exports = router;