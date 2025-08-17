const { query } = require('../config/database');
const logger = require('../utils/logger');

class BusinessAccountController {
  /**
   * Create a new business account
   */
  async createBusinessAccount(req, res) {
    try {
      const { name } = req.body;
      const ownerId = req.user.id; // Assuming user ID is available from authentication middleware

      if (!name) {
        return res.status(400).json({ error: 'Business account name is required' });
      }

      // Insert new business account
      const businessAccountResult = await query(
        `INSERT INTO business_accounts (name, owner_id)
         VALUES ($1, $2)
         RETURNING id, name, owner_id, created_at`,
        [name, ownerId]
      );

      const newBusinessAccount = businessAccountResult.rows[0];

      // Link owner to the business account with 'owner' role
      await query(
        `INSERT INTO business_account_users (business_account_id, user_id, role)
         VALUES ($1, $2, $3)`,
        [newBusinessAccount.id, ownerId, 'owner']
      );

      res.status(201).json({
        message: 'Business account created successfully',
        businessAccount: newBusinessAccount,
      });

    } catch (error) {
      logger.error('Error creating business account:', error);
      res.status(500).json({ error: 'Failed to create business account' });
    }
  }

  /**
   * Get business accounts for the authenticated user
   */
  async getBusinessAccounts(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const result = await query(
        `SELECT
           ba.id,
           ba.name,
           ba.owner_id,
           ba.created_at,
           ba.updated_at,
           bau.role
         FROM business_accounts ba
         JOIN business_account_users bau ON ba.id = bau.business_account_id
         WHERE bau.user_id = $1`,
        [userId]
      );

      res.status(200).json({ businessAccounts: result.rows });
    } catch (error) {
      logger.error('Error fetching business accounts:', error);
      res.status(500).json({ error: 'Failed to fetch business accounts' });
    }
  }
}
module.exports = new BusinessAccountController();