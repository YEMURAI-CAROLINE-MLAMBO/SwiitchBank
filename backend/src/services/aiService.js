// backend/src/services/aiService.js
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const logger = require('../utils/logger');


class AIService {
  /**
   * Generate personalized financial insights and offers
   * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} A promise that resolves with personalized data.
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
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with spending analysis data.
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
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with financial recommendations.
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
   * This is a placeholder implementation.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<number>} A promise that resolves with a numerical likelihood score between 0 and 1.
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

  /**
   * Generate personalized referral rewards
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with personalized data.
   */
  async generateReferralOffer(userId) {
    try {
      const referralLikelihood = await this.predictReferralLikelihood(userId);
      const referralScore = parseFloat(referralLikelihood);
      
      // Tiered rewards based on prediction
      let reward;
      if (referralScore > 0.8) {
        reward = { type: 'cash', amount: 15, currency: 'USD', badge: 'gold' };
      } else if (referralScore > 0.6) {
        reward = { type: 'cash', amount: 10, currency: 'USD', badge: 'silver' };
      } else {
        reward = { type: 'cash', amount: 5, currency: 'USD', badge: 'bronze' };
      }
      
      // Create referral code if doesn't exist
      const userResult = await query(
        `SELECT referral_code FROM users WHERE id = $1`,
        [userId]
      );
      
      let referralCode = userResult.rows[0]?.referral_code;
      if (!referralCode) {
        referralCode = `SWIITCH-${uuidv4().split('-')[0].toUpperCase()}`;
        await query(
          `UPDATE users SET referral_code = $1 WHERE id = $2`,
          [referralCode, userId]
        );
      }
      
      return {
        code: referralCode,
        reward,
        shareMessage: `Join SwiitchBank using my code ${referralCode} and we both get $${reward.amount}!`
      };
    } catch (error) {
      logger.error('Referral offer generation failed:', error);
    return {
        code: 'ERROR',
        reward: { type: 'cash', amount: 5, currency: 'USD' },
        shareMessage: 'Join SwiitchBank with my referral link!'
      };
    }
  }

  /**
   * Process successful referral
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with financial recommendations.
   */
  async processReferral(referralCode, newUserId) {
    try {
      // Get referrer user
      const referrerResult = await query(
        `SELECT id FROM users WHERE referral_code = $1`,
        [referralCode]
      );
      
      if (referrerResult.rows.length === 0) return false;
      
      const referrerId = referrerResult.rows[0].id;
      const offer = await this.generateReferralOffer(referrerId);
      
      // Apply rewards
      await query(
        `UPDATE wallets SET balance = balance + $1 
         WHERE user_id = $2 AND currency = $3`,
        [offer.reward.amount, referrerId, offer.reward.currency]
      );
      
      await query(
        `INSERT INTO referrals 
         (referrer_id, referred_id, reward_amount, reward_currency, status) 
         VALUES ($1, $2, $3, $4, 'completed')`,
        [referrerId, newUserId, offer.reward.amount, offer.reward.currency]
      );
      
      return true;
    } catch (error) {
      logger.error('Referral processing failed:', error);
      return false;
    }
  }

  /**
   * Get referral details for a user
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with financial recommendations.
   */
  async getReferralDetails(userId) {
    try {
      // Get user's referral code
      const userResult = await query(
        `SELECT referral_code FROM users WHERE id = $1`,
        [userId]
      );
      const referralCode = userResult.rows[0]?.referral_code || null;

      // Get completed referrals for this user
      const completedReferralsResult = await query(
        `SELECT id, referred_id, reward_amount, reward_currency, created_at
         FROM referrals
         WHERE referrer_id = $1 AND status = 'completed'`,
        [userId]
      );

      return { referralCode, completedReferrals: completedReferralsResult.rows };
    } catch (error) {
      logger.error('Error fetching referral details:', error);
      throw new Error('Failed to fetch referral details');
    };
  }

  /**
   * Generates financial recommendations for a user.
   * This is a placeholder implementation.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object>} A promise that resolves with financial recommendations.
   */
  async generateRecommendations(userId) {
    // Placeholder logic for recommendations
    logger.info(`Generating recommendations for user: ${userId}`);
    return {
      recommendations: ['Consider saving 10% of your income.', 'Review your subscription services.']
    };
  }
}
module.exports = new AIService();