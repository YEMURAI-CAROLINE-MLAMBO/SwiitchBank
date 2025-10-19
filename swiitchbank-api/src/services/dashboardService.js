import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import CryptoAccount from '../models/CryptoAccount.js';

export const getDashboardSummary = async (userId) => {
  const accounts = await Account.find({ user: userId });
  const cryptoAccounts = await CryptoAccount.find({ user: userId });
  const transactions = await Transaction.find({ user: userId });

  const totalFiat = accounts.reduce((acc, account) => acc + account.balance, 0);
  const totalCrypto = cryptoAccounts.reduce((acc, account) => acc + account.balance, 0);

  const netWorth = totalFiat + totalCrypto;

  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const monthlySpending = transactions
    .filter(t => new Date(t.date) > oneMonthAgo && t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const recentIncome = transactions
    .filter(t => new Date(t.date) > oneMonthAgo && t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    netWorth: {
      totalNetWorth: netWorth,
      baseCurrency: 'USD',
    },
    monthlySpending,
    recentIncome,
  };
};
