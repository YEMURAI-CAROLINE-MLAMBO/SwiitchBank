/**
 * Firestore Collection Structure: savings_goals
 *
 * This defines the structure for documents within the 'savings_goals' collection.
 * Each document represents a specific savings goal for a user.
 *
 * {
 *   goalId: "string",         // Unique ID for the savings goal
 *   userId: "string",         // ID of the user who owns the goal
 *   title: "string",          // Title of the goal (e.g., "Emergency Fund", "Vacation")
 *   targetAmount: "number",   // The target amount for the goal
 *   currentAmount: "number",  // The current amount saved towards the goal
 *   currency: "string",       // Currency of the goal (e.g., "USD")
 *   deadline: "timestamp",    // Optional deadline for the goal
 *   type: "string",           // Type of goal (e.g., "emergency_fund", "vacation", "investment")
 *   status: "string",         // Current status of the goal ("active", "completed", "abandoned")
 *   progress: "number",       // Calculated progress towards the goal (currentAmount / targetAmount)
 *
 *   // Gamification fields
 *   milestones: "array",      // Array of milestone objects
 *     // { percentage: "number", achieved: "boolean", reward: "string" }
 *
 *   // Social features fields
 *   isPublic: "boolean",      // Whether the goal is publicly visible to friends/supporters
 *   supporters: "array",      // Array of user IDs who support this goal
 *   cheerMessages: "array",   // Array of cheer message objects { userId: "string", message: "string", timestamp: "timestamp" }
 * }
 */

/**
 * Firestore Subcollection Structure: users/{userId}/savings_transactions
 *
 * This defines the structure for documents within the 'savings_transactions' subcollection
 * for each user. Each document represents an individual transaction related to savings.
 *
 * {
 *   transactionId: "string",    // Unique ID for the savings transaction
 *   userId: "string",           // ID of the user the transaction belongs to
 *   amount: "number",           // Amount of the transaction (positive for contributions, negative for withdrawals)
 *   currency: "string",         // Currency of the transaction (e.g., "USD")
 *   type: "string",             // Type of savings transaction (e.g., "round_up", "auto_save", "manual_contribution", "withdrawal", "interest")
 *   timestamp: "timestamp",     // Timestamp of the transaction
 *   details: "map",             // Optional details about the transaction (e.g., original transaction ID for round-ups)
 * }
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(); // Initialize Firebase Admin SDK

class RoundUpEngine {
  constructor() {
    this.db = admin.firestore();
  }

  // Process transactions for round-ups
  async processTransactionRoundup(transaction) {
    const userId = transaction.userId;
    const amount = transaction.amount;

    // Get user's savings preferences
    const userPrefs = await this.getUserSavingsPrefs(userId);

    if (!userPrefs.roundUp.enabled) return null;

    // Calculate round-up amount
    const roundUpAmount = this.calculateRoundUp(amount, userPrefs.roundUp.mode, userPrefs.roundUp.customRule);

    if (roundUpAmount > 0) {
      // Create savings transaction
      await this.createSavingsTransaction(userId, roundUpAmount, 'round_up', {
        originalTransaction: transaction.id,
        roundedAmount: amount,
        roundUp: roundUpAmount
      });

      // Check for milestone achievements
      await this.checkMilestones(userId);
    }

    return roundUpAmount;
  }

  // Different round-up modes
  calculateRoundUp(amount, mode, customRule) {
    const roundedAmount = parseFloat(amount.toFixed(2)); // Ensure we are working with two decimal places
    let roundUpAmount = 0;

    switch (mode) {
      case 'traditional':
        // Round up to the nearest whole unit (e.g., $1.23 rounds up to $2.00, round-up is $0.77)
        roundUpAmount = Math.ceil(roundedAmount) - roundedAmount;
        break;
      case 'dollar':
        // Round up to the nearest whole dollar (same as traditional for USD-like currencies)
        roundUpAmount = Math.ceil(roundedAmount) - roundedAmount;
        break;
      case 'percentage':
        // Round up by a fixed percentage (e.g., 5%)
        roundUpAmount = roundedAmount * 0.05; // 5% round-up as per your plan's example
        break;
      case 'aggressive':
        // Round up to the nearest multiple of 10 (e.g., $12.34 rounds up to $20.00, round-up is $7.66)
        roundUpAmount = Math.ceil(roundedAmount / 10) * 10 - roundedAmount;
        break;
      case 'custom':
        if (customRule && customRule.type === 'fixed' && customRule.value > 0) {
          roundUpAmount = customRule.value;
        } else if (customRule && customRule.type === 'percentage' && customRule.value > 0) {
          roundUpAmount = roundedAmount * (customRule.value / 100);
        } else {
          // Default to 0 if custom rule is not valid or not implemented
          roundUpAmount = 0;
        }
        break;
      default:
        // Default to traditional if mode is not recognized
        roundUpAmount = Math.ceil(roundedAmount) - roundedAmount;
    }

    // Ensure round-up amount is non-negative and rounded to two decimal places
    return parseFloat(Math.max(0, roundUpAmount).toFixed(2));
  }

  // Get user's savings preferences (placeholder)
  async getUserSavingsPrefs(userId) {
    try {
      const userRef = this.db.collection('users').doc(userId);
      const savingsSettingsRef = userRef.collection('savings_settings').doc('roundUp'); // Assuming savings settings are stored in a document named 'roundUp' within a subcollection
      const doc = await savingsSettingsRef.get();

      if (doc.exists) {
        return doc.data();
      } else {
        return { roundUp: { enabled: false, mode: 'traditional' } }; // Default if document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching user savings preferences:', error);
      return { roundUp: { enabled: false, mode: 'traditional' } }; // Default in case of error
    }
  }

  // Create savings transaction (placeholder)
  async createSavingsTransaction(userId, amount, type, details) {
    try {
      const transactionData = {
        userId: userId,
        amount: amount,
        type: type,
        details: details || {}, // Ensure details is an object
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };
      await this.db.collection('users').doc(userId).collection('savings_transactions').add(transactionData);
    } catch (error) {
      console.error('Error creating savings transaction:', error);
    }
  }

  // Check for milestone achievements
  async checkMilestones(userId) {
    const goalsRef = this.db.collection('savings_goals').where('userId', '==', userId).where('status', '==', 'active');
    const snapshot = await goalsRef.get();

    if (snapshot.empty) {
      return;
    }

    snapshot.forEach(async (doc) => {
      const goal = doc.data();
      const goalId = doc.id;
      const progress = (goal.currentAmount / goal.targetAmount) * 100;

      const milestones = goal.milestones || [];
      let milestonesUpdated = false;

      milestones.forEach((milestone) => {
        if (!milestone.achieved && progress >= milestone.percentage) {
          milestone.achieved = true;
          milestonesUpdated = true;
          // Here you could trigger a reward or notification
          console.log(`Milestone of ${milestone.percentage}% achieved for goal ${goalId}!`);
        }
      });

      if (milestonesUpdated) {
        await this.db.collection('savings_goals').doc(goalId).update({ milestones });
      }
    });
  }
}

// You can export the class or an instance of it as needed
module.exports = RoundUpEngine;
// or
// module.exports = new RoundUpEngine();