import React, { useState, useEffect } from 'react';

// --- Placeholder Components ---
const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const ThreatCard = ({ threat, onAction }) => (
  <div className="threat-card">
    <h5>{threat.type}</h5>
    <p>Level: {threat.level} | {new Date(threat.timestamp).toLocaleString()}</p>
    <p>Details: {threat.details}</p>
    <button onClick={() => onAction(threat.id, 'view')}>View Details</button>
    <button onClick={() => onAction(threat.id, 'quarantine')}>Quarantine</button>
  </div>
);

const SecurityDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [threats, setThreats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsRes = await fetch('/api/security/metrics');
        if (!metricsRes.ok) throw new Error('Failed to fetch metrics');
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);

        const threatsRes = await fetch('/api/security/threats');
        if (!threatsRes.ok) throw new Error('Failed to fetch threats');
        const threatsData = await threatsRes.json();
        setThreats(threatsData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load security data:", err);
      }
    };
    fetchData();
  }, []);

  const handleThreatAction = (threatId, action) => {
    console.log(`Action: ${action} on threat: ${threatId}`);
    // In a real app, this would trigger a POST request to the backend.
  };

  const runSecurityScan = () => alert('Running security scan...');
  const viewQuarantine = () => alert('Viewing quarantine...');
  const exportSecurityLogs = () => alert('Exporting security logs...');

  if (error) {
    return <div className="error-message">Error loading security dashboard: {error}</div>;
  }

  return (
    <div className="security-dashboard">
      <h2>🛡️ Data Security Center</h2>

      <div className="security-metrics" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <MetricCard title="Threats Blocked" value={metrics.threatsBlocked ?? '...'} />
        <MetricCard title="Data Quarantined" value={metrics.dataQuarantined ?? '...'} />
        <MetricCard title="Clean Rate" value={metrics.cleanRate ? `${metrics.cleanRate}%` : '...'} />
      </div>

      <div className="recent-threats">
        <h3>Recent Security Events</h3>
        {threats.length > 0 ? threats.map(threat => (
          <ThreatCard
            key={threat.id}
            threat={threat}
            onAction={handleThreatAction}
          />
        )) : <p>No recent threats to display.</p>}
      </div>

      <div className="security-actions" style={{ marginTop: '20px' }}>
        <button onClick={runSecurityScan}>Run Security Scan</button>
        <button onClick={viewQuarantine}>View Quarantine</button>
        <button onClick={exportSecurityLogs}>Export Security Logs</button>
      </div>
    </div>
  );
};

export default SecurityDashboard;