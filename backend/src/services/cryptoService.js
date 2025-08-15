const logger = require('../utils/logger');
const { query } = require('../config/database');

class CryptoService {
  async getQuote(fromCurrency, toCurrency, amount) {
    // In a real implementation, this would connect to a crypto exchange API
    logger.info(`Getting crypto quote for ${amount} ${fromCurrency} to ${toCurrency}`);

    // Simulate a quote with a 1% spread
    const price = this.getMockPrice(fromCurrency, toCurrency);
    const quoteAmount = (amount / price) * 0.99;

    return {
      price,
      amount: quoteAmount.toFixed(8),
      expires: Date.now() + 30000 // Quote valid for 30 seconds
    };
  }

  async executeTrade(userId, fromCurrency, toCurrency, amount) {
    logger.info(`Executing crypto trade for user ${userId}: ${amount} ${fromCurrency} to ${toCurrency}`);

    // This would involve complex wallet interactions
    // For now, we'll just update the user's wallet balances in the DB
    const price = this.getMockPrice(fromCurrency, toCurrency);
    const tradeAmount = (amount / price);

    // Use a transaction to ensure atomicity
    const client = await query('BEGIN');
    try {
      // Debit fromCurrency
      await query(
        `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2 AND currency = $3`,
        [amount, userId, fromCurrency]
      );

      // Credit toCurrency
      await query(
        `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 AND currency = $3`,
        [tradeAmount, userId, toCurrency]
      );

      await query('COMMIT');
      return { success: true, amountReceived: tradeAmount };
    } catch (error) {
      await query('ROLLBACK');
      logger.error('Crypto trade failed:', error);
      throw error;
    }
  }

  getMockPrice(from, to) {
    // Mock prices, not real-time
    const prices = {
      'USD_BTC': 30000,
      'BTC_USD': 1 / 30000,
      'USD_ETH': 2000,
      'ETH_USD': 1 / 2000,
    };
    return prices[`${from}_${to}`] || 1;
  }
}

module.exports = new CryptoService();
