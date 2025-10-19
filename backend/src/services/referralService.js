import User from '../models/User.js';

export const getReferralCode = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    referralCode: user.referralCode,
    referralLink: `https://swiitchbank.com/signup?ref=${user.referralCode}`,
  };
};
