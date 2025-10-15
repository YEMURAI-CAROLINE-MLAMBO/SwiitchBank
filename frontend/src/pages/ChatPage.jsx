import React, { useState } from 'react';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user's message to the chat
    setMessages([...messages, { text: input, sender: 'user' }]);

    // TODO: Send the message to the Sophia-2 AI and get a response
    // For now, we'll just simulate a response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: `Sophia-2 AI: I received your message: "${input}"`, sender: 'sophia' }]);
    }, 1000);

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
