import { getReferralCode } from '../services/referralService.js';

export const getReferralCodeController = async (req, res) => {
  try {
    const referralData = await getReferralCode(req.user.id);
    res.json(referralData);
  } catch (error) {
    res.status(500).json({ message: 'Error getting referral code' });
  }
};
