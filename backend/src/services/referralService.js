// backend/src/services/referralService.js
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Referral = require('../models/Referral');
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
      Transaction.countDocuments({ userId }),
      Wallet.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalBalance: { $sum: '$balance' } } },
      ]),
      VirtualCard.countDocuments({ userId }),
    ]);

    const tx = txCount;
    const bal = balance.length > 0 ? balance[0].totalBalance : 0;
    const cards = cardCount;
    
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
    const user = await User.findById(userId);
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = `SWIITCH-${uuidv4().split('-')[0].toUpperCase()}`;
      user.referralCode = referralCode;
      await user.save();
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
    const referrer = await User.findOne({ referralCode });
    if (!referrer) return false;

    const referrerId = referrer._id;
    const offer = await generateReferralOffer(referrerId);

    // Apply rewards
    await Wallet.findOneAndUpdate(
      { userId: referrerId, currency: offer.reward.currency },
      { $inc: { balance: offer.reward.amount } }
    );

    await Referral.create({
      referrerId,
      referredId: newUserId,
      rewardAmount: offer.reward.amount,
      rewardCurrency: offer.reward.currency,
      status: 'completed',
    });
    
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
    const user = await User.findById(userId);
    const referralCode = user ? user.referralCode : null;

    // Get completed referrals for this user
    const completedReferrals = await Referral.find({
      referrerId: userId,
      status: 'completed',
    });

    return { referralCode, completedReferrals };
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
