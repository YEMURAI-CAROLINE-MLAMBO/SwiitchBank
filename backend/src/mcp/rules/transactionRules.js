import Transaction from '../../models/Transaction.js';

const transactionRules = {
  USER_READ: (user) => {
    return Transaction.find({ user: user.id }).sort({ date: -1 });
  },
  ADMIN_READ: () => {
    return Transaction.find().sort({ date: -1 });
  },
};

export default transactionRules;
