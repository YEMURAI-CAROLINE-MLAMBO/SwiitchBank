// backend/src/controllers/growthController.js

const referralService = require('/workspace/backend/src/services/referral service.js'); // Corrected service import
const logger = require('../utils/logger');

exports.getReferralInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    // Call the referral service function to get referral details
    const referralInfo = await referralService.getReferalDetails(userId);
    
    if (!referralInfo) {
      return res.status(404).json({ message: 'Referral information not found' });
    }

    res.status(200).json(referralInfo);

  } catch (error) {
    logger.error('Error fetching referral info:', error);
    res.status(500).json({ message: 'Failed to fetch referral information' });
  }
};

exports.generateReferralCode = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    // Call the referral service function to generate a referral offer
    const referralOffer = await referralService.generateReferralOffer(userId);

    res.status(200).json(referralOffer);
  } catch (error) {
    logger.error('Error generating referral code:', error);
    res.status(500).json({ message: 'Failed to generate referral code' });
  }
