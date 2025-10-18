import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const ErrorCard = ({ error }) => (
    <div className="error-card">
        <p><strong>ID:</strong> {error.id}</p>
        <p><strong>Message:</strong> {error.message}</p>
    </div>
);

const StabilityDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/analytics/stability');
        setMetrics(response.data);
        setErrors(response.data.recentErrors);
      } catch (error) {
        console.error("Error fetching stability data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stability-dashboard">
      <h2>System Health</h2>

      <div className="metrics-grid">
        <MetricCard title="Score" value={metrics.score ? metrics.score.toFixed(4) : 'N/A'} />
        <MetricCard title="Grade" value={metrics.grade || 'N/A'} />
        <MetricCard title="Trend" value={metrics.trend || 'N/A'} />
      </div>

      <div className="error-list">
        <h3>Recent Errors</h3>
        {errors.length > 0 ? (
          errors.map(error => (
            <ErrorCard key={error.id} error={error} />
          ))
        ) : (
          <p>No recent errors.</p>
        )}
      </div>
    </div>
  );
};

export default StabilityDashboard;
