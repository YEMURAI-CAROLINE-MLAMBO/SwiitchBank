class SeriesBRevenue {
  static getTargets() {
    return {
      current: {
        mrr: '$50K',
        sources: {
          premium_subscriptions: '60%',
          bridge_fees: '25%',
          api_usage: '15%'
        }
      },

      seriesBTargets: {
        mrr: '$500K', // 10x growth
        sources: {
          enterprise_subscriptions: '40%',
          bridge_fees: '30%',
          api_platform: '20%',
          white_label: '10%'
        },
        keyMetrics: {
          arpu: '$250', // Up from $50
          enterprise_ltv: '$5,000',
          platform_margin: '70%'
        }
      }
    };
  }
}
