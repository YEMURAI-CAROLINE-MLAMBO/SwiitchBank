import React, { useState, useEffect } from 'react';
import SoftDataCollector from '../utils/softDataCollector';

const EnhancedSophiaChat = () => {
  const [messages, setMessages] = useState([]);
  const [userContext, setUserContext] = useState(null);
  const [personalization, setPersonalization] = useState('medium');

  useEffect(() => {
    // Collect soft data on first load (optional)
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      const context = await SoftDataCollector.collectUserContext();
      setUserContext(context);
    } catch (error) {
      console.log('Soft data collection skipped or failed');
    }
  };

  const sendMessage = async (message) => {
    const response = await fetch('/api/sophia/enhanced-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: messages,
        context: userContext,
        personalization_level: personalization
      })
    });

    const data = await response.json();
    return data;
  };

  return (
    <div className="enhanced-sophia-chat">
      <div className="personalization-controls">
        <label>
          Personalization:
          <select value={personalization} onChange={(e) => setPersonalization(e.target.value)}>
            <option value="low">Standard Advice</option>
            <option value="medium">Context-Aware</option>
            <option value="high">Highly Personalized</option>
          </select>
        </label>
      </div>

      {/* Rest of chat interface */}
    </div>
  );
};

export default EnhancedSophiaChat;
