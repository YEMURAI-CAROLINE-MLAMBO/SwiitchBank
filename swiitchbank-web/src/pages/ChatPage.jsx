import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      const { data } = await axios.post('/api/sophia/chat', {
        message: input,
      });
      const sophiaMessage = { text: data.response, sender: 'sophia' };
      setMessages(prevMessages => [...prevMessages, userMessage, sophiaMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: Could not connect to Sophia-2 AI', sender: 'sophia' };
      setMessages(prevMessages => [...prevMessages, userMessage, errorMessage]);
    }

    setInput('');
  };

  return (
    <div>
      <h1>Sophia-2 AI</h1>
      <div style={{ height: '400px', border: '1px solid #ccc', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '10px' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
