// Mock data for accounts and transactions
const mockAccounts = [
  { id: 'acc_1234', name: 'Main Checking', type: 'checking', balance: 15420.68, currency: 'USD' },
  { id: 'acc_5678', name: 'High-Yield Savings', type: 'savings', balance: 89300.12, currency: 'USD' },
  { id: 'acc_9012', name: 'World Traveler Card', type: 'credit', balance: -2100.45, currency: 'USD' },
];

const mockTransactions = {
  'acc_1234': [
    { id: 'txn_1', date: '2025-10-16', description: 'Morning Coffee', amount: -4.75, currency: 'USD' },
    { id: 'txn_2', date: '2025-10-15', description: 'Salary Deposit', amount: 2500.00, currency: 'USD' },
    { id: 'txn_3', date: '2025-10-14', description: 'Grocery Store', amount: -123.50, currency: 'USD' },
  ],
  'acc_5678': [
    { id: 'txn_4', date: '2025-10-01', description: 'Monthly Interest', amount: 35.12, currency: 'USD' },
  ],
  'acc_9012': [
    { id: 'txn_5', date: '2025-10-17', description: 'Airline Ticket', amount: -450.00, currency: 'USD' },
    { id: 'txn_6', date: '2025-10-16', description: 'Restaurant', amount: -85.20, currency: 'USD' },
  ]
};


// Mock API functions
export const getAccounts = async (token) => {
  if (!token) throw new Error('Authentication error. Please log in.');
  await new Promise(resolve => setTimeout(resolve, 150)); // Simulate network delay
  return mockAccounts;
};

export const getAccountInfo = async (token, accountId) => {
  if (!token) throw new Error('Authentication error. Please log in.');
  await new Promise(resolve => setTimeout(resolve, 150));
  const account = mockAccounts.find(acc => acc.id === accountId);
  if (!account) {
    throw new Error('Account not found.');
  }
  return account;
};

export const getTransactions = async (token, accountId) => {
    if (!token) throw new Error('Authentication error. Please log in.');
    await new Promise(resolve => setTimeout(resolve, 150));
    if (accountId) {
        return mockTransactions[accountId] || [];
    }
    return Object.values(mockTransactions).flat().sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getBalance = async (token, accountId) => {
    if (!token) throw new Error('Authentication error. Please log in.');
    await new Promise(resolve => setTimeout(resolve, 150));
    if (accountId) {
        const account = mockAccounts.find(acc => acc.id === accountId);
        if (!account) throw new Error('Account not found.');
        return { accountId: account.id, name: account.name, balance: account.balance, currency: account.currency };
    }
    // Return all balances if no accountId is specified
    return mockAccounts.map(acc => ({ accountId: acc.id, name: acc.name, balance: acc.balance, currency: acc.currency }));
};

export const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (email === 'test@example.com' && password === 'password123') {
        return { token: 'fake-jwt-token-for-testing' };
    } else {
        throw new Error('Invalid credentials');
    }
};

export const register = async (firstName, lastName, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    // In a real scenario, this would create a user. Here we just simulate success.
    if (email === 'test@example.com') {
        throw new Error('User already exists');
    }
    return { msg: 'Registration successful! You can now log in.' };
};