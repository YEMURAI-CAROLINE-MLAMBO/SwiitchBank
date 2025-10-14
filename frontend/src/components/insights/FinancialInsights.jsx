import React, { useState } from 'react';

const FinancialInsights = () => {
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'savings_opportunity',
      title: 'Savings Opportunity Found',
      description: 'You could save $120/month by reducing dining out from 12 to 8 times monthly',
      impact: 'high',
      action: 'Set dining budget'
    },
    {
      id: 2,
      type: 'spending_trend',
      title: 'Grocery Spending Increased',
      description: 'Your grocery spending is 15% higher than last month',
      impact: 'medium',
      action: 'Review grocery habits'
    },
    {
      id: 3,
      type: 'subscription_alert',
      title: 'Unused Subscriptions',
      description: 'You have 3 subscriptions costing $45/month with low usage',
      impact: 'low',
      action: 'Cancel subscriptions'
    }
  ]);

  return (
    <div className="financial-insights">
      <div className="insights-header">
        <h2>Financial Insights</h2>
        <p>Personalized recommendations from Sophia</p>
      </div>

      <div className="insights-grid">
        {insights.map(insight => (
          <div key={insight.id} className={`insight-card ${insight.impact}`}>
            <div className="insight-icon">
              {insight.type === 'savings_opportunity' && '💰'}
              {insight.type === 'spending_trend' && '📈'}
              {insight.type === 'subscription_alert' && '🔔'}
            </div>

            <div className="insight-content">
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>

              <div className="insight-actions">
                <button className="primary-action">
                  {insight.action}
                </button>
                <button className="secondary-action">
                  Learn More
                </button>
              </div>
            </div>

            <div className={`impact-badge ${insight.impact}`}>
              {insight.impact === 'high' ? 'High Impact' :
               insight.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Sophia Section */}
      <div className="ask-sophia-section">
        <h3>Need Specific Advice?</h3>
        <p>Ask Sophia about any financial topic</p>

        <div className="sophia-questions">
          <button onClick={() => {}}>
            💬 How can I save for a house?
          </button>
          <button onClick={() => {}}>
            📊 Should I invest more?
          </button>
          <button onClick={() => {}}>
            🎯 What's my best debt payoff strategy?
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;
