const { query } = require('../config/database');
const logger = require('../utils/logger');

class AIService {
  /**
   * Generate personalized financial insights and offers
   */
  async generatePersonalization(userId) {
    try {
      // Get user transaction patterns
      const transactions = await query(
        `SELECT type, category, amount, currency 
         FROM transactions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId]
      );
      
      // Get wallet balance
      const balances = await query(
        `SELECT currency, balance FROM wallets WHERE user_id = $1`,
        [userId]
      );
      
      // Simple AI rules (to be replaced with ML model)
      const spendingPatterns = this.analyzeSpending(transactions.rows);
      const recommendations = this.generateRecommendations(spendingPatterns, balances.rows);
      
      return {
        insights: spendingPatterns,
        offers: recommendations.offers,
        tips: recommendations.tips
      };
    } catch (error) {
      logger.error('AI personalization failed:', error);
      return { insights: [], offers: [], tips: [] };
    }
  }
  
  /**
   * Analyze spending patterns (placeholder for ML model)
   */
  analyzeSpending(transactions) {
    const categories = {};
    let totalSpent = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'purchase') {
        totalSpent += tx.amount;
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }
    });
    
    // Identify top spending categories
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
    
    return {
      topCategories,
      monthlyAverage: totalSpent / 3, // Simple 3-month average
      savingsOpportunity: totalSpent * 0.15 // Estimate 15% savings potential
    };
  }
  
  /**
   * Generate recommendations based on spending patterns
   */
  generateRecommendations(patterns, balances) {
    const offers = [];
    const tips = [];
    
    // Cashback offers for top categories
    patterns.topCategories.forEach(category => {
      offers.push({
        type: 'cashback',
        category,
        value: '5%',
        description: `Get 5% cashback on next ${category} purchase`,
        expiration: new Date(Date.now() + 7*24*60*60*1000) // 1 week
      });
    });
    
    // Savings tip if spending is high
    if (patterns.monthlyAverage > 500) {
      tips.push({
        type: 'savings',
        title: 'Savings Opportunity',
        content: `You could save ~$${patterns.savingsOpportunity.toFixed(2)}/month by using SwiitchBank Savings features`
      });
    }
    
    // Crypto conversion offer if holding crypto
    const hasCrypto = balances.some(b => b.currency === 'BTC' || b.currency === 'ETH');
    if (hasCrypto) {
      offers.push({
        type: 'conversion',
        value: '0% fee',
        description: 'Zero-fee crypto conversion this week',
        expiration: new Date(Date.now() + 3*24*60*60*1000) // 3 days
      });
    }
    
    return { offers, tips };
  }
  
  /**
   * Predict referral likelihood (0-1 score)
   */
  async predictReferralLikelihood(userId) {
    try {
      // Simple heuristic (to be replaced with ML model)
      const [txCount, balance, cardCount] = await Promise.all([
        query(`SELECT COUNT(*) FROM transactions WHERE user_id = $1`, [userId]),
        query(`SELECT SUM(balance) FROM wallets WHERE user_id = $1`, [userId]),
        query(`SELECT COUNT(*) FROM cards WHERE user_id = $1`, [userId])
      ]);
      
      const tx = parseInt(txCount.rows[0].count);
      const bal = parseFloat(balance.rows[0].sum || 0);
      const cards = parseInt(cardCount.rows[0].count);
      
      const score = Math.min(1, 
        (tx / 20 * 0.4) + 
        (bal / 1000 * 0.3) + 
        (cards / 2 * 0.3)
      );
      
      return score.toFixed(2);
    } catch (error) {
      logger.error('Referral prediction failed:', error);
      return "0.5";
    }
  }
}

module.exports = new AIService();