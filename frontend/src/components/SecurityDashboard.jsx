import React, { useState, useEffect } from 'react';

const SecurityDashboard = () => {
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    setFraudAlerts([
      { id: 1, description: 'Suspicious login from a new device.', severity: 'medium' },
      { id: 2, description: 'Unusual transaction amount detected.', severity: 'high' },
    ]);
    setRiskMetrics({
      overallRisk: 75,
      transactionRisk: 80,
      accountRisk: 60,
      behavioralRisk: 70,
    });
  }, []);

  const resolveAlert = (id) => {
    setFraudAlerts(fraudAlerts.filter(alert => alert.id !== id));
  };

  const investigateAlert = (id) => {
    console.log(`Investigating alert ${id}`);
  };

  const RiskMeter = ({ score }) => (
    <div className="risk-meter">
      <div className="risk-meter-fill" style={{ width: `${score}%` }}></div>
      <span>{score}%</span>
    </div>
  );

  const RiskCategory = ({ name, score }) => (
    <div className="risk-category">
      <span>{name}</span>
      <div className="risk-bar">
        <div className="risk-bar-fill" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  const AlertCard = ({ alert, onResolve, onInvestigate }) => (
    <div className={`alert-card ${alert.severity}`}>
      <p>{alert.description}</p>
      <button onClick={() => onInvestigate(alert.id)}>Investigate</button>
      <button onClick={() => onResolve(alert.id)}>Resolve</button>
    </div>
  );

  const ToggleControl = ({ label, enabled, onChange }) => (
    <div className="toggle-control">
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={enabled} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );

  return (
    <div className="security-dashboard">
      <h2>🛡️ Fraud Protection Center</h2>

      <div className="risk-overview">
        <RiskMeter score={riskMetrics.overallRisk} />
        <div className="risk-breakdown">
          <RiskCategory name="Transaction" score={riskMetrics.transactionRisk} />
          <RiskCategory name="Account" score={riskMetrics.accountRisk} />
          <RiskCategory name="Behavioral" score={riskMetrics.behavioralRisk} />
        </div>
      </div>

      <div className="alerts-section">
        <h3>Active Security Alerts</h3>
        {fraudAlerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onResolve={resolveAlert}
            onInvestigate={investigateAlert}
          />
        ))}
      </div>

      <div className="security-controls">
        <h3>Security Settings</h3>
        <ToggleControl
          label="Enhanced Fraud Detection"
          enabled={true}
          onChange={() => {}}
        />
        <ToggleControl
          label="Transaction Limits"
          enabled={true}
          onChange={() => {}}
        />
        <ToggleControl
          label="Login Notifications"
          enabled={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default SecurityDashboard;
