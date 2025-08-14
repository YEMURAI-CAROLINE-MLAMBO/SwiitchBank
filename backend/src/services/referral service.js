const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const aiService = require('./aiService');
const logger = require('../utils/logger');

class ReferralService {
  /**
   * Generate personalized referral rewards
   */
  async generateReferralOffer(userId) {
    try {
      const referralLikelihood = await aiService.predictReferralLikelihood(userId);
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
        shareMessage: `Join SwiitchBank using my code ${referralCode} and we both get $${reward.amount}!`,
        shareableImage: `${process.env.APP_URL}/referral/${referralCode}.png`
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
}

module.exports = new ReferralService();