import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.put('/api/settings/password', {
        oldPassword,
        newPassword,
      });
      setSuccess('Password changed successfully!');
    } catch (error) {
      setError('Error changing password');
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleChangePassword}>
        <h2>Change Password</h2>
        <div>
          <label>Old Password:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
      <div style={{ marginTop: '20px' }}>
        <Link to="/terms-and-conditions">Terms and Conditions</Link>
      </div>
    </div>
  );
};

export default SettingsPage;
