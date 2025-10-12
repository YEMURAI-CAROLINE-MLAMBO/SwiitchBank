import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add other user information here */}
          <button onClick={logout} style={{ padding: '10px', marginTop: '10px' }}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
