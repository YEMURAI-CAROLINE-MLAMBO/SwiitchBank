import React, { useState } from 'react';

const BehavioralDashboard = () => {
  const [behavioralInsights, setBehavioralInsights] = useState(null);

  const loadBehavioralInsights = async () => {
    const response = await fetch('/api/sophia/behavioral-insights');
    const insights = await response.json();
    setBehavioralInsights(insights);
  };

  return (
    <div className="behavioral-dashboard">
      {/* Soft data insights */}
      {behavioralInsights && (
        <div className="behavioral-insights">
          <h3>Personalized Insights</h3>

          <div className="habit-analysis">
            <h4>Your Financial Habits</h4>
            <p>{behavioralInsights.behavioral_analysis.spending_habits.impulse_pattern}</p>
          </div>

          <div className="personalized-tips">
            <h4>Tips for You</h4>
            {behavioralInsights.recommended_actions.map((action, index) => (
              <div key={index} className="tip">{action}</div>
            ))}
          </div>
        </div>
      )}

      <button onClick={loadBehavioralInsights}>
        Get Personalized Insights
      </button>
    </div>
  );
};

export default BehavioralDashboard;
