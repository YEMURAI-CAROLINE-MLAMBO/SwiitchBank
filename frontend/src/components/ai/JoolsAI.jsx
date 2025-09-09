import React, { useState } from 'react';
import api from '../../services/api';

const JoolsAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/ai/ask', { prompt });
      const aiMessage = response.data.message;
      setMessages([...newMessages, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Failed to get AI response', error);
      setMessages([
        ...newMessages,
        { role: 'ai', content: 'Sorry, I am having trouble responding right now.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Jools AI Assistant</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <p>
              <strong>{msg.role === 'user' ? 'You' : 'Jools'}:</strong> {msg.content}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Jools anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default JoolsAI;
