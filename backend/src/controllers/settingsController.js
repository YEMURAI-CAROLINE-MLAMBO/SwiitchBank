import { changePassword } from '../services/settingsService.js';

export const changePasswordController = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    await changePassword(req.user.id, oldPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
