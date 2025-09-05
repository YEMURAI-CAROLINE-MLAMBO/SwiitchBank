
import React, { useState, useEffect } from 'react';
import { Button, Input } from './common';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection('transactions')
        .where('userId', '==', user.uid)
        .onSnapshot((snapshot) => {
          const newTransactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(newTransactions);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let res;
      if (prompt.toLowerCase().includes('transactions')) {
        res = await fetch('/api/transaction-analysis/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, transactions }),
        });
      } else {
        res = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
      }

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      setResponse(data.response || data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Assistant</h2>
      <p>Ask me anything about SwiitchBank!</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Your question"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., How do I add money to my account?"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h3>Answer:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
