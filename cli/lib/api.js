import axios from 'axios';
import { getToken } from './auth.js';

const API_URL = process.env.API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API Functions ---

export const getAccounts = async () => {
  try {
    const response = await api.get('/accounts');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch accounts.');
  }
};

export const getAccountInfo = async (accountId) => {
  try {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch account details.');
  }
};

export const getTransactions = async (accountId) => {
  try {
    const url = accountId ? `/transactions/${accountId}` : '/transactions';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch transactions.');
  }
};

export const getBalance = async (accountId) => {
  try {
    const url = accountId ? `/accounts/${accountId}/balance` : '/accounts/balances';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not fetch balance(s).');
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Should return { token: '...' }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid credentials.');
  }
};

export const register = async (firstName, lastName, email, password) => {
  try {
    const response = await api.post('/auth/signup', { firstName, lastName, email, password });
    return response.data; // Should return a success message
  } catch (error)    {
    throw new Error(error.response?.data?.message || 'Registration failed.');
  }
};