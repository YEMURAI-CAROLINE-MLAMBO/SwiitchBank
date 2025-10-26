import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (userData) => {
  const { email, password, firstName, lastName } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    swiitchBankId: new Date().getTime().toString(), // Placeholder
  });
  await user.save();
  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return { token, user };
};

export const logout = () => {
  // In a real application, this would invalidate a token.
  return;
};

export const updateUserProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
