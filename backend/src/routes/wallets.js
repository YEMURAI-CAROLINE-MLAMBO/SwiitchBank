import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js'; // Assuming your auth middleware is here
import * as walletController from '../controllers/walletController.js'; // We will create this controller next

// Apply authentication middleware to all wallet routes
router.use(auth);

/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Create a new wallet for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *             properties:
 *               currency:
 *                 type: string
 *                 description: The currency of the new wallet (e.g., 'USD', 'BTC')
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid input or wallet already exists for currency
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', walletController.createWallet);

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Get all wallets for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', walletController.listWallets);

/**
 * @swagger
 * /api/wallets/{walletId}:
 *   get:
 *     summary: Get a specific wallet by ID for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the wallet to retrieve
 *     responses:
 *       200:
 *         description: Wallet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found or does not belong to the user
 *       500:
 *         description: Internal server error
 */
router.get('/:walletId', walletController.getWalletById);

/**
 * @swagger
 * /api/wallets/{walletId}/topup:
 *   post:
 *     summary: Top up a specific wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the wallet to top up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to top up
 *     responses:
 *       200:
 *         description: Wallet topped up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found or does not belong to the user
 *       500:
 *         description: Internal server error
 */
router.post('/:walletId/topup', walletController.topupWallet);

/**
 * @swagger
 * /api/wallets/{fromWalletId}/transfer/{toWalletId}:
 *   post:
 *     summary: Transfer funds between two wallets
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fromWalletId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the source wallet
 *       - in: path
 *         name: toWalletId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the destination wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to transfer
 *     responses:
 *       200:
 *         description: Funds transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *       400:
 *         description: Invalid input or insufficient funds
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: One or both wallets not found or do not belong to the user
 *       500:
 *         description: Internal server error
 */
router.post('/:fromWalletId/transfer/:toWalletId', walletController.transferFunds);

export default router;
