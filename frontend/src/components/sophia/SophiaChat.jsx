import React, { useState } from 'react';

const SophiaChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Sophia, your AI financial assistant. How can I help you today?",
      sender: 'sophia',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const sophiaResponse = {
        id: Date.now() + 1,
        text: getSophiaResponse(text),
        sender: 'sophia',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sophiaResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getSophiaResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('spend') || lowerMessage.includes('where did my money')) {
      return "I see you spent $847 this month. Your top categories are dining ($324) and groceries ($487). Would you like me to suggest a budget?";
    } else if (lowerMessage.includes('save') || lowerMessage.includes('budget')) {
      return "Based on your income, you could save about $500 monthly by reducing dining out and optimizing grocery spending. Want me to create a savings plan?";
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('grow money')) {
      return "You have $4,006 in savings. Consider moving $3,000 to a high-yield savings account earning 4.5% APY. This could earn you $135 annually with no risk.";
    } else {
      return "I can help you understand your spending, create budgets, find savings opportunities, and plan for your financial goals. What would you like to focus on?";
    }
  };

  return (
    <div className="sophia-chat">
      <div className="chat-header">
        <div className="sophia-avatar">🧠</div>
        <div className="sophia-info">
          <h3>Sophia</h3>
          <p>AI Financial Assistant</p>
        </div>
        <div className="chat-status">
          {isTyping ? 'Sophia is typing...' : 'Online'}
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message sophia typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="quick-questions">
        <button onClick={() => sendMessage("Where did I spend most this month?")}>
          💰 Spending Summary
        </button>
        <button onClick={() => sendMessage("How can I save more money?")}>
          🎯 Savings Tips
        </button>
        <button onClick={() => sendMessage("What bills can I optimize?")}>
          📊 Bill Optimization
        </button>
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask Sophia about your finances..."
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SophiaChat;
