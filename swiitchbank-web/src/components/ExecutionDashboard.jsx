import React, { useState, useEffect } from 'react';

const ExecutionDashboard = () => {
  const [activeDecisions, setActiveDecisions] = useState([]);
  const [implementationQueue, setImplementationQueue] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/framework/queue');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setActiveDecisions(data.activeDecisions || []);
        setImplementationQueue(data.implementationQueue || []);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError("Failed to load dashboard data. Please try again later.");
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Mock functions for demonstration purposes
  const markComplete = (id) => {
    // Logic to move item from implementationQueue to completedItems
  };

  const reportBlocker = (id, reason) => {
    // Logic to handle a blocker report
  };

  const executeDecision = async (decisionId, choice) => {
    try {
      const decision = activeDecisions.find(d => d.id === decisionId);
      if (!decision) {
        throw new Error("Decision not found");
      }

      // Create a simplified criteria object for the backend
      const criteria = {
        priority: choice === 'option_a' ? 'high' : 'low',
        impact: choice === 'option_a' ? 8 : 3,
        feasibility: 0.8
      };

      const response = await fetch('/api/framework/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: decision.question,
          criteria: criteria
        }),
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Decision result:', result);

      // Update the UI: move the decision from active to completed
      setCompletedItems(prev => [...prev, { ...decision, ...result, type: 'decision' }]);
      setActiveDecisions(prev => prev.filter(d => d.id !== decisionId));

    } catch (e) {
      console.error("Failed to execute decision:", e);
      setError("Failed to process decision. Please try again.");
    }
  };

  return (
    <div className="execution-dashboard">
      {/* Header - No Discussion Zone */}
      <div className="execution-header">
        <h1>🚀 Execution Dashboard</h1>
        <div className="execution-rules">
          <div className="rule">✅ Build First</div>
          <div className="rule">✅ Debate Never</div>
          <div className="rule">✅ Measure Always</div>
        </div>
      </div>

      {/* Active Implementation Queue */}
      <div className="implementation-queue">
        <h2>Active Implementation</h2>
        {implementationQueue.map(item => (
          <ImplementationCard
            key={item.id}
            item={item}
            onComplete={() => markComplete(item.id)}
            onBlocked={(reason) => reportBlocker(item.id, reason)}
          />
        ))}
      </div>

      {/* Binary Decision Points */}
      <div className="binary-decisions">
        <h2>Quick Decisions</h2>
        {activeDecisions.map(decision => (
          <BinaryDecisionCard
            key={decision.id}
            decision={decision}
            onDecide={(choice) => executeDecision(decision.id, choice)}
          />
        ))}
      </div>

      {/* Progress Tracking */}
      <div className="progress-metrics">
        <h2>Execution Metrics</h2>
        <div className="metrics-grid">
          <MetricCard
            title="Prototypes Built"
            value={completedItems.filter(i => i.type === 'prototype').length}
            trend="+2 this week"
          />
          <MetricCard
            title="Decisions Made"
            value={completedItems.filter(i => i.type === 'decision').length}
            trend="100% data-driven"
          />
          <MetricCard
            title="Meetings Saved"
            value={completedItems.filter(i => i.type === 'meeting_cancelled').length}
            trend="5h/week saved"
          />
        </div>
      </div>

      {/* No-Debate Zone Warning */}
      <div className="no-debate-zone">
        <div className="warning-icon">🚫</div>
        <div className="warning-text">
          <strong>No Debate Zone:</strong> Core features, architecture, and vision are decided.
          Focus on implementation and measurement.
        </div>
      </div>
    </div>
  );
};

// Binary Decision Component - Forces Action
const BinaryDecisionCard = ({ decision, onDecide }) => {
  return (
    <div className="binary-decision-card">
      <h3>{decision.question}</h3>
      <div className="decision-context">
        <p>{decision.context}</p>
        <div className="data-points">
          {decision.dataPoints.map(point => (
            <span key={point} className="data-tag">{point}</span>
          ))}
        </div>
      </div>

      <div className="binary-options">
        <button
          className="option-a"
          onClick={() => onDecide('option_a')}
        >
          ✅ {decision.optionA}
        </button>
        <button
          className="option-b"
          onClick={() => onDecide('option_b')}
        >
          ❌ {decision.optionB}
        </button>
      </div>

      <div className="decision-deadline">
        ⏰ Decide within: {decision.timeLimit}
      </div>
    </div>
  );
};

// Placeholder components for MetricCard and ImplementationCard
const MetricCard = ({ title, value, trend }) => (
    <div className="metric-card">
        <h3>{title}</h3>
        <p>{value}</p>
        <span>{trend}</span>
    </div>
);

const ImplementationCard = ({ item, onComplete, onBlocked }) => (
    <div className="implementation-card">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <button onClick={onComplete}>Complete</button>
        <button onClick={() => onBlocked('Reason')}>Block</button>
    </div>
);

export default ExecutionDashboard;
