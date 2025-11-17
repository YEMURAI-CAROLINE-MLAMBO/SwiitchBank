import Transaction from '../models/Transaction.js';
import notificationService from './notificationService.js';

/**
 * Creates a new donation transaction record.
 * This function is designed to be generic to support various types of charitable giving.
 *
 * @param {object} donationData - The data for the donation.
 * @param {number} donationData.amount - The amount of the donation.
 * @param {string} donationData.recipient - The recipient of the donation.
 * @param {string} donationData.type - The type of donation (e.g., 'donation', 'zakat', 'offering').
 * @param {mongoose.Schema.Types.ObjectId} donationData.user - The user making the donation.
 * @returns {Promise<Document>} The saved transaction document.
 */
const createDonation = async (donationData) => {
  const { amount, recipient, type, user } = donationData;

  // Create a generic transaction record for the donation
  const transactionRecord = new Transaction({
    ...donationData,
    status: 'completed', // Assuming direct donations are completed on creation
  });

  const savedTransaction = await transactionRecord.save();

  // Send a notification about the donation
  // The notification message can be customized based on the donation type
  notificationService.createManualPaymentNotification(
    `Your ${type} to ${recipient}`,
    amount,
    `Thank you for your generous contribution.`
  );

  return savedTransaction;
};

/**
 * Updates the status of a specific transaction.
 *
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {string} status - The new status of the transaction.
 * @returns {Promise<Document|null>} The updated transaction document.
 */
const updateTransactionStatus = async (transactionId, status) => {
  return await Transaction.findByIdAndUpdate(
    transactionId,
    { status },
    { new: true }
  );
};

export default {
  createDonation,
  updateTransactionStatus,
};
