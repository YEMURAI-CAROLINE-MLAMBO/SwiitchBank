import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './GivingPage.css';

const GivingPage = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [donationType, setDonationType] = useState('donation');
  const { user } = useAuth();

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to make a donation.');
      return;
    }
    if (!amount || !recipient) {
      toast.error('Please enter an amount and a recipient.');
      return;
    }

    try {
      const donationData = {
        amount: parseFloat(amount),
        recipient,
        type: donationType,
        user: user.uid,
        currency: 'USD', // Assuming USD for now, this could be dynamic
      };

      await axios.post('/api/donations', donationData);

      toast.success('Your donation was successful!');
      setAmount('');
      setRecipient('');
    } catch (error) {
      toast.error('There was an error processing your donation.');
      console.error('Donation Error:', error);
    }
  };

  return (
    <div className="giving-page-container">
      <h2>Charitable Giving</h2>
      <p>Make a one-time donation to a cause or organization of your choice.</p>
      <form onSubmit={handleDonate} className="giving-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipient">Recipient</label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient's name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="donationType">Type</label>
          <select id="donationType" value={donationType} onChange={(e) => setDonationType(e.target.value)}>
            <option value="donation">General Donation</option>
            <option value="zakat">Zakat</option>
            <option value="offering">Offering</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Donate Now</button>
      </form>
    </div>
  );
};

export default GivingPage;
