import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  // In a real app, you'd have login/logout functions that call an API
  // and set the auth state.
  const login = (user) => {
    setAuth({ isAuthenticated: true, user });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  const value = { auth, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
