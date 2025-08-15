const logger = require('../utils/logger');
const { query } = require('../config/database');

class InfluencerService {
  async createCampaign(influencerId, campaignDetails) {
    const { name, budget, target_cpa } = campaignDetails;
    logger.info(`Creating new campaign for influencer ${influencerId}`);

    const result = await query(
      `INSERT INTO influencer_campaigns (influencer_id, name, budget, target_cpa)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [influencerId, name, budget, target_cpa]
    );

    return { success: true, campaignId: result.rows[0].id };
  }

  async getCampaignPerformance(campaignId) {
    logger.info(`Getting performance for campaign ${campaignId}`);
    // In a real system, this would aggregate data from sign-ups, etc.
    return {
      id: campaignId,
      signups: 120,
      cost: 600,
      cpa: 5,
    };
  }
}

module.exports = new InfluencerService();
