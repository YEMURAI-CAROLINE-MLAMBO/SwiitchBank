import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Assuming the backend is running on the same host or proxied
      const response = await axios.post('/api/ai/ask', { prompt: input });
      const aiMessage = { sender: 'ai', text: response.data.response };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <h1 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid #ccc', backgroundColor: '#f7f7f7' }}>Jools AI Assistant</h1>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '15px',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef',
              color: msg.sender === 'user' ? 'white' : 'black',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div style={{ textAlign: 'left' }}><i>Jools is typing...</i></div>}
      </div>
      <div style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="Ask Jools anything..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white' }}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
