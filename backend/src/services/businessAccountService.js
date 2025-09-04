const Business = require('../models/Business'); // Assuming a Business model exists

/**
 * Creates a new business account.
 * @param {object} accountDetails - The details of the business account to create.
 * @returns {Promise<object>} The newly created business account.
 */
const createBusinessAccount = async (accountDetails) => {
  // For now, we'll just simulate the creation of a business account.
  // In a real application, you would save this to a database.
  console.log('Creating business account with details:', accountDetails);
  return { id: Date.now(), ...accountDetails, status: 'active' };
};

/**
 * Checks if a business name is available.
 * @param {string} businessName - The business name to check.
 * @returns {Promise<boolean>} True if the name is available, false otherwise.
 */
const checkBusinessNameAvailability = async (businessName) => {
  // For now, we'll simulate checking name availability.
  // In a real application, you would query the database.
  console.log(`Checking availability of business name: ${businessName}`);
  return !['existing business', 'another business'].includes(businessName.toLowerCase());
};

module.exports = {
  createBusinessAccount,
  checkBusinessNameAvailability,
};
