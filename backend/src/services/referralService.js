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
      
      // Dynamic reward calculation based on prediction score (0 to 1)
      const minReward = 5;
      const maxReward = 20;
      // Linear interpolation: minReward + score * (maxReward - minReward)
      const rewardAmount = minReward + referralScore * (maxReward - minReward);
      
      // Ensure reward amount is within the desired range
      const clampedRewardAmount = Math.max(minReward, Math.min(maxReward, rewardAmount));
      
      // Determine badge based on score (optional, can keep or remove)
      let badge = 'bronze';
      if (referralScore > 0.8) {
          badge = 'gold';
      } else if (referralScore > 0.6) {
          badge = 'silver';
      }

      const reward = { 
          type: 'cash', 
          amount: parseFloat(clampedRewardAmount.toFixed(2)), // Format to 2 decimal places
          currency: 'USD', 
          badge: badge // Keep badge logic if desired
      };
      
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
      // Return a default offer in case of error
      return {
        code: 'ERROR', // Or handle error more specifically
        reward: { type: 'cash', amount: 5, currency: 'USD', badge: 'bronze' },
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
      // Retrieve the offer that was active when the code was generated/used?
      // Current implementation gets the referrer's *current* offer.
      // Consider storing the offer details in the referral record upon code generation or application.
      const offer = await this.generateReferralOffer(referrerId); // Gets current offer, see note above
      
      // Apply rewards
      // Consider performing these updates within a database transaction for atomicity
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
      // Consider more specific error handling (e.g., referral code not found, user already referred)
      return false;
    }
  }

  /**
   * Get referral details for a user
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
         FROM referrals\n         WHERE referrer_id = $1 AND status = 'completed'
         WHERE referrer_id = $1 AND status = 'completed'
         ORDER BY created_at DESC`, // Added ordering
        [userId]
      );

      return { referralCode, completedReferrals: completedReferralsResult.rows };
    } catch (error) {
      logger.error('Error fetching referral details:', error);
      throw new Error('Failed to fetch referral details'); // Re-throw error for handling in controller
    }
  }
}

module.exports = new ReferralService();