// backend/src/services/referralService.js
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Predict referral likelihood (0-1 score)
 * This is a placeholder implementation.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number>} A promise that resolves with a numerical likelihood score between 0 and 1.
 */
const predictReferralLikelihood = async (userId) => {
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
};

/**
 * Generate personalized referral rewards
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} A promise that resolves with personalized data.
 */
const generateReferralOffer = async (userId) => {
  try {
    const referralLikelihood = await predictReferralLikelihood(userId);
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
      referralCode = `SWIITCHBANK-${uuidv4().split('-')[0].toUpperCase()}`;
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
};

/**
 * Process successful referral
 * @param {string} referralCode - The referral code used.
 * @param {string} newUserId - The ID of the new user who used the code.
 * @returns {Promise<boolean>} A promise that resolves with true if successful, false otherwise.
 */
const processReferral = async (referralCode, newUserId) => {
  try {
    // Get referrer user
    const referrerResult = await query(
      `SELECT id FROM users WHERE referral_code = $1`,
      [referralCode]
    );
    
    if (referrerResult.rows.length === 0) return false;
    
    const referrerId = referrerResult.rows[0].id;
    const offer = await generateReferralOffer(referrerId);
    
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
};

/**
 * Get referral details for a user
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} A promise that resolves with the user's referral details.
 */
const getReferralDetails = async (userId) => {
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
  }
};

module.exports = {
  predictReferralLikelihood,
  generateReferralOffer,
  processReferral,
  getReferralDetails,
};
