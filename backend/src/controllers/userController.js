import {
  register,
  login,
  logout,
  updateUserProfile,
} from '../services/userService.js';

export const registerUser = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  logout();
  res.json({ message: 'User logged out' });
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};
