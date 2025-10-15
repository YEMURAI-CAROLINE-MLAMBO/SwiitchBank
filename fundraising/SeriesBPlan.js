class SeriesBFundraising {
  static getStrategy() {
    return {
      target_raise: '$15-20M',
      valuation: '$100-150M',
      use_of_funds: {
        team_growth: '40%', // 25 new hires
        product_development: '30%', // New features
        market_expansion: '20%', // International rollout
        infrastructure: '10%' // Technical scaling
      },

      timeline: {
        preparation: 'Next 3 months',
        outreach: 'Months 4-5',
        closing: 'Month 6',
        deployment: 'Month 7+'
      },

      target_investors: {
        lead: 'Top fintech VCs',
        participation: 'Strategic angels',
        follow_on: 'Series A investors'
      }
    };
  }
}
