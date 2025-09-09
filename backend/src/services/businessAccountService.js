const Business = require('../models/Business');

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

const addTeamMember = async (businessId, email, role) => {
  // In a real application, you would first find the user by email to get their ID
  // For now, we'll use a placeholder user ID
  const userId = 'placeholder-user-id';
  const teamMember = { userId, role };
  await Business.updateOne(
    { _id: businessId },
    { $push: { teamMembers: teamMember } }
  );
  return teamMember;
};

const updateTeamMember = async (businessId, memberId, role) => {
  await Business.updateOne(
    { _id: businessId, 'teamMembers.userId': memberId },
    { $set: { 'teamMembers.$.role': role } }
  );
  return { userId: memberId, role };
};

const removeTeamMember = async (businessId, memberId) => {
  await Business.updateOne(
    { _id: businessId },
    { $pull: { teamMembers: { userId: memberId } } }
  );
};

module.exports = {
  createBusinessAccount,
  checkBusinessNameAvailability,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
};
