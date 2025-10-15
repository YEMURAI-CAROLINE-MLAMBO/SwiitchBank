class GlobalExpansion {
  static getExpansionPlan() {
    return {
      phase1: {
        regions: ['UK', 'EU', 'Canada'],
        focus: 'English-speaking markets',
        timeline: 'Q1-Q2',
        localization: ['currency', 'tax', 'banking_rules']
      },

      phase2: {
        regions: ['Mexico', 'Brazil', 'Australia'],
        focus: 'High-growth fintech markets',
        timeline: 'Q3-Q4',
        localization: ['language', 'payment_methods', 'regulations']
      },

      phase3: {
        regions: ['Singapore', 'UAE', 'Japan'],
        focus: 'Wealth management hubs',
        timeline: 'Next Year',
        localization: ['wealth_products', 'high_net_worth_features']
      }
    };
  }
}
