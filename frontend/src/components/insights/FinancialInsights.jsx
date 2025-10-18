import React, { useState, useEffect } from 'react';
import { apiClient } from '../../context/AuthContext';
import './FinancialInsights.css'; // Dedicated stylesheet

const LoadingSpinner = () => <div className="insight-spinner"></div>;

const FinancialInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // This endpoint will use the HighCapacitySophiaService on the backend
        const response = await apiClient.get('/sophia/generated-insights');
        setInsights(response.data.insights);
      } catch (err) {
        setError('Could not fetch financial insights.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleAskSophia = async (e, predefinedQuestion = null) => {
    if (e) e.preventDefault();
    const query = predefinedQuestion || question;
    if (!query) return;

    setAsking(true);
    setAnswer('');
    try {
      // This endpoint will use the transactionAnalysisService's getAnalysis function
      const response = await apiClient.post('/sophia/ask', { question: query });
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('Sorry, I was unable to answer your question at this time.');
      console.error(err);
    } finally {
      setAsking(false);
      setQuestion('');
    }
  };

  const getIconForInsight = (type) => {
    switch (type) {
      case 'savings_opportunity': return '💰';
      case 'spending_trend': return '📈';
      case 'subscription_alert': return '🔔';
      case 'income_boost': return '💸';
      default: return '💡';
    }
  };

  return (
    <div className="financial-insights-container">
      <div className="insights-header">
        <h2>Sophia's AI Insights</h2>
        <p>Your personalized financial analysis and recommendations.</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="insights-error">{error}</p>}

      {!loading && !error && (
        <div className="insights-grid">
          {insights.map((insight) => (
            <div key={insight.id} className={`insight-card impact-${insight.impact}`}>
              <div className="insight-icon">{getIconForInsight(insight.type)}</div>
              <div className="insight-content">
                <h3>{insight.title}</h3>
                <p>{insight.description}</p>
                <div className="insight-actions">
                  <button className="primary-action">{insight.action}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ask-sophia-section">
        <h3>Ask Sophia a Question</h3>
        <p>Get instant answers about your finances.</p>
        <div className="predefined-questions">
          <button onClick={(e) => handleAskSophia(e, 'Where can I cut my spending?')}>Where can I cut my spending?</button>
          <button onClick={(e) => handleAskSophia(e, 'What was my largest transaction last month?')}>What was my largest transaction?</button>
          <button onClick={(e) => handleAskSophia(e, 'Summarize my spending on groceries.')}>Summarize my grocery spending.</button>
        </div>
        <form onSubmit={handleAskSophia} className="ask-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Or type your own question..."
            className="ask-input"
            disabled={asking}
          />
          <button type="submit" className="ask-button" disabled={asking}>
            {asking ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        {answer && (
          <div className="sophia-answer">
            <p><strong>Sophia:</strong> {answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;