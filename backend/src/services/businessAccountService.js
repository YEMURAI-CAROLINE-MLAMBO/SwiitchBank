import Business from '../models/Business.js';

/**
 * Creates a new business account.
 * @param {object} accountDetails - The details of the business account to create.
 * @returns {Promise<object>} The newly created business account.
 */
const createBusinessAccount = async (accountDetails) => {
  const business = new Business(accountDetails);
  await business.save();
  return business;
};

/**
 * Checks if a business name is available.
 * @param {string} businessName - The business name to check.
 * a @returns {Promise<boolean>} True if the name is available, false otherwise.
 */
const checkBusinessNameAvailability = async (businessName) => {
  const business = await Business.findOne({ businessName });
  return business === null;
};

export {
  createBusinessAccount,
  checkBusinessNameAvailability,
};
