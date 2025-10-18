import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import axios from 'axios'; // For calling the backend

// Create a reusable axios instance
const api = axios.create({
  baseURL: '/api', // Assumes the backend is served on the same domain
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = useCallback(async (firebaseUser) => {
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken();
      setUser(firebaseUser);
      setToken(idToken);
      // Set the token for all subsequent api requests
      api.defaults.headers.common['x-auth-token'] = idToken;
    } else {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['x-auth-token'];
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);

  const signup = async (email, password, firstName, lastName) => {
    // 1. Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Get Firebase token
    const idToken = await firebaseUser.getIdToken();

    // 3. Create user in our backend database
    await api.post('/auth/signup', {
      email,
      firstName,
      lastName,
      swiitchBankId: firebaseUser.uid,
    }, {
      headers: { 'x-auth-token': idToken }
    });

    // Manually update state after signup
    handleUser(firebaseUser);

    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the rest
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle the rest
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export the configured axios instance for use in other parts of the app
export const apiClient = api;