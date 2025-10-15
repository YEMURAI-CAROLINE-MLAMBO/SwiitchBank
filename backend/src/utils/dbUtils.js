import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Account from '../models/Account.js';
import SophiaInsight from '../models/SophiaInsight.js';
import mongoose from 'mongoose';

class DatabaseUtils {
  /**
   * Clean up old data
   */
  static async cleanupOldData(userId, olderThanDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    try {
      // Archive and remove old transactions
      const result = await Transaction.deleteMany({
        user: userId,
        date: { $lt: cutoffDate },
        pending: false
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old transactions for user ${userId}`);
      return result.deletedCount;
    } catch (error) {
      console.error('Cleanup error:', error);
      throw error;
    }
  }

  /**
   * Get user financial summary
   */
  static async getUserFinancialSummary(userId, timeRange = 'month') {
    const dateFilter = this.getDateFilter(timeRange);

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: dateFilter.start, $lte: dateFilter.end },
          pending: false
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $gt: ['$amount', 0] }, '$amount', 0]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $lt: ['$amount', 0] }, '$amount', 0]
            }
          },
          transactionCount: { $sum: 1 },
          categories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          netCashFlow: { $add: ['$totalIncome', '$totalExpenses'] },
          transactionCount: 1,
          categoryCount: { $size: '$categories' }
        }
      }
    ]);

    return summary[0] || {
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      transactionCount: 0,
      categoryCount: 0
    };
  }

  /**
   * Get spending by category
   */
  static async getSpendingByCategory(userId, timeRange = 'month') {
    const dateFilter = this.getDateFilter(timeRange);

    return await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: dateFilter.start, $lte: dateFilter.end },
          amount: { $lt: 0 }, // Only expenses
          pending: false
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalSpent: { $abs: '$totalSpent' },
          transactionCount: 1,
          averageAmount: { $abs: { $round: ['$averageAmount', 2] } },
          _id: 0
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);
  }

  /**
   * Helper for date ranges
   */
  static getDateFilter(timeRange) {
    const now = new Date();
    const start = new Date();

    switch (timeRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1);
    }

    return { start, end: now };
  }

  /**
   * Backup user data (for GDPR/compliance)
   */
  static async exportUserData(userId) {
    const user = await User.findById(userId);
    const accounts = await Account.find({ user: userId });
    const transactions = await Transaction.find({ user: userId });
    const insights = await SophiaInsight.find({ user: userId });

    return {
      user: user.toObject(),
      accounts: accounts.map(acc => acc.toObject()),
      transactions: transactions.map(t => t.toObject()),
      insights: insights.map(i => i.toObject()),
      exportDate: new Date().toISOString()
    };
  }
}

export default DatabaseUtils;
