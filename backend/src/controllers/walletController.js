const Wallet = require('../models/Wallet');
const logger = require('../utils/logger');

const createWallet = async (req, res) => {
  const { walletType, currency, balance } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  if (!walletType || !currency || balance === undefined) {
    return res.status(400).json({ message: 'Missing required wallet details' });
  }

  try {
    const wallet = await Wallet.create({
      userId,
      walletType,
      currency,
      balance,
    });
    res.status(201).json({ message: 'Wallet created successfully', wallet });
  } catch (error) {
    logger.error('Error creating wallet:', error);
    res.status(500).json({ message: 'Error creating wallet' });
  }
};

module.exports = {
  /**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance for the authenticated user
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Successful response with wallet balance
 *       500:
 *         description: Internal server error
 */
 createWallet,
  listWallets: async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    try {
      const wallets = await Wallet.find({ userId });
      res.status(200).json(wallets);
    } catch (error) {
      logger.error('Error listing wallets:', error);
      res.status(500).json({ message: 'Error listing wallets' });
    }
  },
  getWalletById: async (req, res) => {
    const { walletId } = req.params;
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    try {
      const wallet = await Wallet.findOne({ _id: walletId, userId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      res.status(200).json(wallet);
    } catch (error) {
      logger.error('Error getting wallet:', error);
      res.status(500).json({ message: 'Error getting wallet' });
    }
  },
  ,
  /**
 * @swagger
 * /api/wallet/{walletId}/topup:
 *   post:
 *     summary: Top up a specific wallet
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the wallet to top up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to top up
 *     responses:
 *       200:
 *         description: Wallet topped up successfully
 *       400:
 *         description: Invalid top-up amount
 *       404:
 *         description: Wallet not found or does not belong to user
 *       500:
 *         description: Error topping up wallet
 */
  topupWallet: async (req, res) => {
    const { walletId } = req.params;
    const userId = req.user.id; // Assuming user ID is available from authenticated user
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid top-up amount' });
    }

    try {
      const wallet = await Wallet.findOne({ _id: walletId, userId });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found or does not belong to user' });
      }

      wallet.balance += amount;
      await wallet.save();
      res.status(200).json({ message: 'Wallet topped up successfully', wallet });
    } catch (error) {
      logger.error('Error topping up wallet:', error);
      res.status(500).json({ message: 'Error topping up wallet' });
    }
  },
  ,
  /**
 * @swagger
 * /api/wallet/{fromWalletId}/transfer/{toWalletId}:
 *   post:
 *     summary: Transfer funds between wallets
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: fromWalletId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the source wallet
 *       - in: path
 *         name: toWalletId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the destination wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to transfer
 *     responses:
 *       200:
 *         description: Funds transferred successfully
 *       400:
 *         description: Invalid transfer amount or cannot transfer to the same wallet
 *       404:
 *         description: Source or destination wallet not found
 *       500:
 *         description: Error transferring funds
 */
  transferFunds: async (req, res) => {
    const { fromWalletId, toWalletId } = req.params;
    const { amount } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer amount' });
    }

    if (fromWalletId === toWalletId) {
      return res.status(400).json({ message: 'Cannot transfer to the same wallet' });
    }

    const session = await Wallet.startSession();
    session.startTransaction();

    try {
      const fromWallet = await Wallet.findOne({ _id: fromWalletId, userId }).session(session);
      if (!fromWallet) {
        throw new Error('Source wallet not found or does not belong to user');
      }

      if (fromWallet.balance < amount) {
        throw new Error('Insufficient funds in source wallet');
      }

      const toWallet = await Wallet.findById(toWalletId).session(session);
      if (!toWallet) {
        throw new Error('Destination wallet not found');
      }

      fromWallet.balance -= amount;
      toWallet.balance += amount;

      await fromWallet.save({ session });
      await toWallet.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'Funds transferred successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error('Error transferring funds:', error);
      res.status(500).json({ message: 'Error transferring funds' });
    }
  },
};