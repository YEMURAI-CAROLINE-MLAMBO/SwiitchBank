/**
 * Mock UserTransactionHistoryService for demonstration purposes.
 */
export class UserTransactionHistoryService {
  // In a real app, this would fetch from a database.
  static async getRecentTransactions(userId, minutes) {
    // Return some dummy recent transactions for a given user.
    if (userId === 'user_with_rapid_transactions') {
      return [
        { timestamp: new Date(Date.now() - 1 * 60 * 1000) }, // 1 minute ago
        { timestamp: new Date(Date.now() - 2 * 60 * 1000) }, // 2 minutes ago
      ];
    }
    return [];
  }
}