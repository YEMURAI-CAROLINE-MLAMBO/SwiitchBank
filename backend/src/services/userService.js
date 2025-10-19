import User from '../models/User.js';

export const updateUserProfile = async (userId, profileData) => {
  const { name, email } = profileData;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  return user;
};
