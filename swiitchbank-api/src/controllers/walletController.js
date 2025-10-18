import Wallet from '../models/Wallet.js';
import logger from '../utils/logger.js';

export const createWallet = async (req, res) => {
  const { walletType, currency, balance } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  if (!walletType || !currency || balance === undefined) {
    return res.status(400).json({ message: 'Missing required wallet details' });
  }

  try {
    const wallet = await Wallet.create({
      userId,
      walletType,
      currency,
      balance,
    });
    res.status(201).json({ message: 'Wallet created successfully', wallet });
  } catch (error) {
    logger.error('Error creating wallet:', error);
    res.status(500).json({ message: 'Error creating wallet' });
  }
};

export const listWallets = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  try {
    const wallets = await Wallet.find({ userId });
    res.status(200).json(wallets);
  } catch (error) {
    logger.error('Error listing wallets:', error);
    res.status(500).json({ message: 'Error listing wallets' });
  }
};

export const getWalletById = async (req, res) => {
  const { walletId } = req.params;
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  try {
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    logger.error('Error getting wallet:', error);
    res.status(500).json({ message: 'Error getting wallet' });
  }
};

export const topupWallet = async (req, res) => {
  const { walletId } = req.params;
  const userId = req.user.id; // Assuming user ID is available from authenticated user
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid top-up amount' });
  }

  try {
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found or does not belong to user' });
    }

    wallet.balance += amount;
    await wallet.save();
    res.status(200).json({ message: 'Wallet topped up successfully', wallet });
  } catch (error) {
    logger.error('Error topping up wallet:', error);
    res.status(500).json({ message: 'Error topping up wallet' });
  }
};

export const transferFunds = async (req, res) => {
  const { fromWalletId, toWalletId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authenticated user

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer amount' });
  }

  if (fromWalletId === toWalletId) {
    return res.status(400).json({ message: 'Cannot transfer to the same wallet' });
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    const fromWallet = await Wallet.findOne({ _id: fromWalletId, userId }).session(session);
    if (!fromWallet) {
      throw new Error('Source wallet not found or does not belong to user');
    }

    if (fromWallet.balance < amount) {
      throw new Error('Insufficient funds in source wallet');
    }

    const toWallet = await Wallet.findById(toWalletId).session(session);
    if (!toWallet) {
      throw new Error('Destination wallet not found');
    }

    fromWallet.balance -= amount;
    toWallet.balance += amount;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Funds transferred successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error('Error transferring funds:', error);
    res.status(500).json({ message: 'Error transferring funds' });
  }
};
