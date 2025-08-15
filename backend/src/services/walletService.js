const logger = require('../utils/logger');
const { query } = require('../config/database');

class WalletService {
  async getWalletByUserId(userId) {
    logger.info(`Getting wallet for user ${userId}`);
    const result = await query(
      `SELECT id, currency, balance, created_at
       FROM wallets
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  async topUpWallet(userId, topUpDetails) {
    const { amount, currency, source } = topUpDetails;
    logger.info(`Topping up wallet for user ${userId} with ${amount} ${currency} from ${source}`);

    // In a real system, this would involve a payment gateway like Stripe
    // For now, we'll just update the balance
    const result = await query(
      `UPDATE wallets
       SET balance = balance + $1
       WHERE user_id = $2 AND currency = $3
       RETURNING balance`,
      [amount, userId, currency]
    );

    if (result.rows.length === 0) {
      // Wallet for that currency doesn't exist, create it
      await query(
        `INSERT INTO wallets (user_id, currency, balance) VALUES ($1, $2, $3)`,
        [userId, currency, amount]
      );
    }

    return { success: true, newBalance: result.rows[0]?.balance || amount };
  }
}

module.exports = new WalletService();
