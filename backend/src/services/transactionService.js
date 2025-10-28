import Transaction from '../models/Transaction.js';
import ModelContextProtocol from '../mcp/protocol.js';
import transactionRules from '../mcp/rules/transactionRules.js';
import { CONTEXTS } from '../mcp/contexts.js';

const transactionMCP = new ModelContextProtocol(transactionRules);

export const getTransactions = async (user) => {
  const transactions = await transactionMCP.apply(CONTEXTS.USER_READ, user);
  return transactions;
};
