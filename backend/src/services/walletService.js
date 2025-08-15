const db = require('./database');
const logger = require('../utils/logger');

class WalletService {
  async getWalletsByUserId(userId) {
    logger.info(`Getting wallets for user ${userId}`);
    return db.find('wallets', { userId });
  }

  async topUpWallet(userId, topUpDetails) {
    const { amount, currency, source } = topUpDetails;
    logger.info(`Topping up wallet for user ${userId} with ${amount} ${currency} from ${source}`);

    const wallets = db.find('wallets', { userId, currency });

    if (wallets.length > 0) {
      const wallet = wallets[0];
      const newBalance = wallet.balance + amount;
      db.update('wallets', wallet.id, { balance: newBalance });
      return { success: true, newBalance };
    } else {
      // Wallet for that currency doesn't exist, create it
      const newWallet = db.insert('wallets', { userId, currency, balance: amount });
      return { success: true, newBalance: newWallet.balance };
    }
  }
}

module.exports = new WalletService();
