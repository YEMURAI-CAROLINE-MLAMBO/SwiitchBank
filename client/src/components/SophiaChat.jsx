import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SophiaChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'sophia',
      text: "Hello! I'm Sophia, your intelligent financial partner. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`);

      const response = await axios.post('/api/sophia/chat', {
        message: input,
        history: conversationHistory,
      });

      const sophiaResponse = {
        sender: 'sophia',
        text: response.data.response,
      };
      setMessages((prev) => [...prev, sophiaResponse]);
    } catch (error) {
      console.error('Error communicating with Sophia API:', error);
      const errorResponse = {
        sender: 'sophia',
        text: 'Sorry, I seem to be having trouble connecting. Please try again later.',
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sophia-chat" style={styles.chatContainer}>
      <div className="header" style={styles.header}>
        <h3>🧠 Sophia AI Assistant</h3>
        <p>Your intelligent financial partner</p>
      </div>

      <div className="message-list" style={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === 'user' ? styles.userMessage : styles.sophiaMessage}>
            <p style={styles.messageText}>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div style={styles.sophiaMessage}>
            <p style={styles.messageText}><i>Sophia is thinking...</i></p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Sophia anything..."
          style={styles.input}
          disabled={isLoading}
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

// Basic inline styles to make it look like a chat window
const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '800px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },
  header: {
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#f7f7f7',
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '70%',
  },
  sophiaMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    color: 'black',
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '70%',
  },
  messageText: {
    margin: 0,
  },
  inputForm: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#0084ff',
    color: 'white',
    cursor: 'pointer',
  }
};


export default SophiaChat;
