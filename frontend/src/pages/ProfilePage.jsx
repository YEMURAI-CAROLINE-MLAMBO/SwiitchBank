import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const { data } = await axios.put('/api/user/profile', {
        name,
        email,
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Error updating profile');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <form onSubmit={handleUpdateProfile}>
            <div>
              <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit">Update Profile</button>
          </form>
          {error && <div>{error}</div>}
          {success && <div>{success}</div>}
          <button onClick={logout} style={{ padding: '10px', marginTop: '10px' }}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
