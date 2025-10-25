import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

import logger from '../utils/logger.js';
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  logger.info(`[authController] Registration attempt for ${email}`);

  try {
    logger.info(`[authController] Checking if user exists for ${email}`);
    let user = await User.findOne({ email });

    if (user) {
      logger.warn(`[authController] User already exists: ${email}`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    logger.info(`[authController] Creating new user for ${email}`);
    user = new User({
      firstName,
      lastName,
      email,
      password,
      swiitchBankId: `usr-${uuidv4()}`
    });

    logger.info(`[authController] Hashing password for ${email}`);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    logger.info(`[authController] Saving user ${email}`);
    await user.save();
    logger.info(`[authController] User ${email} saved successfully.`);

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
