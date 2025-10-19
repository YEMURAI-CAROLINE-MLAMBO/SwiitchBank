import { analyzeTransaction } from './security.js';

export const transactionMiddleware = (req, res, next) => {
  // Add any additional transaction-related middleware logic here
  analyzeTransaction(req, res, next);
};
