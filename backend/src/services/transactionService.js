const logger = require('../utils/logger');
const { query } = require('../config/database');

class TransactionService {
  async createTransaction(userId, transactionDetails) {
    const { amount, currency, description, type, category } = transactionDetails;
    logger.info(`Creating transaction for user ${userId}`);

    const result = await query(
      `INSERT INTO transactions (user_id, amount, currency, description, type, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, amount, currency, description, type, category]
    );

    return { success: true, transactionId: result.rows[0].id };
  }

  async getTransactionsByUserId(userId) {
    const result = await query(
      `SELECT id, amount, currency, description, type, category, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = new TransactionService();
