const pool = require('../config/database'); // Import the database connection pool
const logger = require('../../utils/logger'); // Import the logger utility

const createWallet = (req, res) => {
  // Removed async since there are no await calls in this function
  const { wallet_type, currency, balance } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  if (!wallet_type || !currency || balance === undefined) {
    return res.status(400).json({ message: 'Missing required wallet details' });
  }

  pool.query(
    'INSERT INTO wallets (user_id, wallet_type, currency, balance) VALUES (?, ?, ?, ?)',
    [userId, wallet_type, currency, balance],
    (error, results) => {
      if (error) {
        logger.error('Error creating wallet:', error);
        return res.status(500).json({ message: 'Error creating wallet' });
      }
      res.status(201).json({
        message: 'Wallet created successfully',
        walletId: results.insertId,
      });
    }
  );
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
      const [rows] = await pool
        .promise()
        .query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
      res.status(200).json(rows);
    } catch (error) {
      logger.error('Error listing wallets:', error);
      res.status(500).json({ message: 'Error listing wallets' });
    }
  },
  getWalletById: async (req, res) => {
    const { walletId } = req.params;
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    try {
      const [rows] = await pool
        .promise()
        .query('SELECT * FROM wallets WHERE wallet_id = ? AND user_id = ?', [
          walletId,
          userId,
        ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      logger.error('Error getting wallet:', error);
      res.status(500).json({ message: 'Error getting wallet' });
    }
  },
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
      const [result] = await pool
        .promise()
        .query(
          'UPDATE wallets SET balance = balance + ? WHERE wallet_id = ? AND user_id = ?',
          [amount, walletId, userId]
        );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: 'Wallet not found or does not belong to user' });
      }

      // Optionally, fetch the updated wallet to return it
      const [updatedWalletRows] = await pool
        .promise()
        .query('SELECT * FROM wallets WHERE wallet_id = ?', [walletId]);
      res.status(200).json({
        message: 'Wallet topped up successfully',
        wallet: updatedWalletRows[0],
      });
    } catch (error) {
      logger.error('Error topping up wallet:', error);
      res.status(500).json({ message: 'Error topping up wallet' });
    }
  },
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
      return res
        .status(400)
        .json({ message: 'Cannot transfer to the same wallet' });
    }

    let connection;
    try {
      connection = await pool.promise().getConnection();
      await connection.beginTransaction();

      // 1. Verify both wallets exist and the fromWallet belongs to the user.
      const [fromWalletRows] = await connection.query(
        'SELECT * FROM wallets WHERE wallet_id = ? AND user_id = ? FOR UPDATE', // Use FOR UPDATE for locking
        [fromWalletId, userId]
      );

      if (fromWalletRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: 'Source wallet not found or does not belong to user',
        });
      }

      const fromWallet = fromWalletRows[0];

      const [toWalletRows] = await connection.query(
        'SELECT * FROM wallets WHERE wallet_id = ? FOR UPDATE', // Use FOR UPDATE for locking
        [toWalletId]
      );

      if (toWalletRows.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ message: 'Destination wallet not found' });
      }

      // 2. Check if the fromWallet has sufficient balance.
      if (fromWallet.balance < amount) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: 'Insufficient funds in source wallet' });
      }

      // 3. Deduct from fromWallet and add to toWallet in a database transaction.
      await connection.query(
        'UPDATE wallets SET balance = balance - ? WHERE wallet_id = ?',
        [amount, fromWalletId]
      );
      await connection.query(
        'UPDATE wallets SET balance = balance + ? WHERE wallet_id = ?',
        [amount, toWalletId]
      );

      await connection.commit();
      res.status(200).json({ message: 'Funds transferred successfully' });
    } catch (error) {
      if (connection) await connection.rollback();
      logger.error('Error transferring funds:', error);
      res.status(500).json({ message: 'Error transferring funds' });
    } finally {
      if (connection) connection.release();
    }
  },
};
