import donationService from '../services/donationService.js';

const createDonation = async (req, res) => {
  try {
    const transaction = await donationService.createDonation(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation.' });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = await donationService.updateTransactionStatus(id, status);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction status.' });
  }
};

export default {
  createDonation,
  updateTransactionStatus,
};
