const { query } = require('../config/database');
const logger = require('../utils/logger');

class BusinessAccountController {
  /**
   * Create a new business account
   * @swagger
   * /api/business-accounts:
   *   post:
   *     summary: Create a new business account
   *     tags: [Business Accounts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBusinessAccountRequest'
   *     responses:
   *       201:
   *         description: Business account created successfully
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
   * @swagger
   * /api/business-accounts:
   *   get:
   *     summary: Get business accounts for the authenticated user
   *     tags: [Business Accounts]
   *     responses:
   *       200:
   *         description: A list of business accounts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */

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

  /**
   * Get details of a specific business account by ID
   * @swagger
   * /api/business-accounts/{id}:
   *   get:
   *     summary: Get details of a specific business account by ID
   *     tags: [Business Accounts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   */
  async getBusinessAccountById(req, res) {
    try {
      const accountId = req.params.id;
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
         WHERE ba.id = $1 AND bau.user_id = $2`,
        [accountId, userId]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ businessAccount: result.rows[0] });
      } else {
        // Return 404 if the account is not found OR the user is not associated with it
        res.status(404).json({ error: 'Business account not found or unauthorized' });
      }
    } catch (error) {
      logger.error(`Error fetching business account with ID ${accountId}:`, error);
      res.status(500).json({ error: 'Failed to fetch business account' });
    }
  }
}

  /**
   * Add a user to a business account
   * @swagger
   * /api/business-accounts/{id}/users:
   *   post:
   *     summary: Add a user to a business account
   *     tags: [Business Accounts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   */
  async addUserToBusinessAccount(req, res) {
    try {
      const accountId = req.params.id;
      const { userId, role } = req.body;
      const requestingUserId = req.user.id; // Assuming user ID is available from authentication middleware

      // 1. Verify requesting user has 'owner' role for this account
      const ownerCheck = await query(
        `SELECT role FROM business_account_users WHERE business_account_id = $1 AND user_id = $2`,
        [accountId, requestingUserId]
      );

      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].role !== 'owner') {
        return res.status(403).json({ error: 'Unauthorized to add users to this business account' });
      }

      // 2. Check if the user is already a member of this account
      const existingMemberCheck = await query(
        `SELECT * FROM business_account_users WHERE business_account_id = $1 AND user_id = $2`,
        [accountId, userId]
      );

      if (existingMemberCheck.rows.length > 0) {
        return res.status(409).json({ error: 'User is already a member of this business account' });
      }

      // 3. Insert new user into business_account_users table
      await query(
        `INSERT INTO business_account_users (business_account_id, user_id, role)
         VALUES ($1, $2, $3)`,
        [accountId, userId, role]
      );

      res.status(200).json({
        message: `User ${userId} added to business account ${accountId} with role ${role} successfully`,
      });

    } catch (error) {
      logger.error(`Error adding user to business account ${req.params.id}:`, error);
      // Consider checking for specific database errors (e.g., foreign key constraints for userId or accountId)
      res.status(500).json({ error: 'Failed to add user to business account' });
    }
  }

  /**
   * Remove a user from a business account
   * @swagger
   * /api/business-accounts/{accountId}/users/{userIdToRemove}:
   *   delete:
   *     summary: Remove a user from a business account
   *     tags: [Business Accounts]
   *     parameters:
   *       - in: path
   *         name: accountId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: userIdToRemove
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   */
  async removeUserFromBusinessAccount(req, res) {
    try {
      const accountId = req.params.accountId;
      const userIdToRemove = parseInt(req.params.userIdToRemove, 10);
      const requestingUserId = req.user.id; // Assuming user ID is available from authentication middleware

      if (isNaN(userIdToRemove)) {
        return res.status(400).json({ error: 'Invalid user ID to remove' });
      }

      // 1. Verify requesting user has 'owner' role for this account
      const ownerCheck = await query(
        `SELECT role FROM business_account_users WHERE business_account_id = $1 AND user_id = $2`,
        [accountId, requestingUserId]
      );

      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].role !== 'owner') {
        return res.status(403).json({ error: 'Unauthorized to remove users from this business account' });
      }

      // 2. Prevent removing the owner
      const businessAccount = await query(
        `SELECT owner_id FROM business_accounts WHERE id = $1`,
        [accountId]
      );

      if (businessAccount.rows.length === 0) {
        return res.status(404).json({ error: 'Business account not found' });
      }

      if (businessAccount.rows[0].owner_id === userIdToRemove) {
        return res.status(400).json({ error: 'Cannot remove the business account owner' });
      }

      // 3. Delete the user's association with the business account
      const deleteResult = await query(
        `DELETE FROM business_account_users WHERE business_account_id = $1 AND user_id = $2`,
        [accountId, userIdToRemove]
      );

      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'User not found in this business account' });
      }

      res.status(200).json({ message: `User ${userIdToRemove} removed from business account ${accountId} successfully` });

    } catch (error) {
      logger.error(`Error removing user ${req.params.userIdToRemove} from business account ${req.params.accountId}:`, error);
      res.status(500).json({ error: 'Failed to remove user from business account' });
    }
  }
}
module.exports = new BusinessAccountController();