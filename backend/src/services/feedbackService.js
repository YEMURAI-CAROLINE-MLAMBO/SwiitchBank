const logger = require('../utils/logger');
const { query } = require('../config/database');

class FeedbackService {
  async submitFeedback(userId, feedbackData) {
    const { type, message, rating } = feedbackData;
    logger.info(`Received feedback from user ${userId}`);

    await query(
      `INSERT INTO user_feedback (user_id, type, message, rating)
       VALUES ($1, $2, $3, $4)`,
      [userId, type, message, rating]
    );

    return { success: true, message: 'Thank you for your feedback!' };
  }
}

module.exports = new FeedbackService();
