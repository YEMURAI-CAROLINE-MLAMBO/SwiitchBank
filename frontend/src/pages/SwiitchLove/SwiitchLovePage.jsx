import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SwiitchLovePage.css';

const donationCategories = {
  'Religious': {
    'Christianity': ['Tithe', 'Offering', 'First Fruit'],
    'Islam': ['Zakat', 'Sadaqa'],
    'Hinduism': ['Dakshina', 'Daan'],
  },
  'Charity': {
    'Non-Profit': ['General Donation', 'Specific Cause'],
    'Community Project': ['Local Event', 'Fundraiser'],
  },
};

const SwiitchLovePage = () => {
  const [step, setStep] = useState(1);
  const [givingType, setGivingType] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [donation, setDonation] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { user } = useAuth();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

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
        givingType,
        subCategory,
        donation,
        type: donation.toLowerCase(),
        user: user.uid,
        currency: 'USD',
      };

      await axios.post('/api/donations', donationData);

      toast.success('Your donation was successful!');
      setAmount('');
      setRecipient('');
      setStep(1);
      setGivingType('');
      setSubCategory('');
      setDonation('');
    } catch (error) {
      toast.error('There was an error processing your donation.');
      console.error('Donation Error:', error);
    }
  };

  const renderStepOne = () => (
    <div className="form-group">
      <label htmlFor="givingType">Select Giving Type</label>
      <select id="givingType" value={givingType} onChange={(e) => setGivingType(e.target.value)} required>
        <option value="">-- Select a Type --</option>
        {Object.keys(donationCategories).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <button onClick={handleNext} disabled={!givingType} className="next-btn">Next</button>
    </div>
  );

  const renderStepTwo = () => (
    <div className="form-group">
      <label htmlFor="subCategory">Select a Sub-Category</label>
      <select id="subCategory" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
        <option value="">-- Select a Sub-Category --</option>
        {Object.keys(donationCategories[givingType]).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <div className="navigation-buttons">
        <button onClick={handleBack} className="back-btn">Back</button>
        <button onClick={handleNext} disabled={!subCategory} className="next-btn">Next</button>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <form onSubmit={handleDonate} className="swiitch-love-form">
      <div className="form-group">
        <label htmlFor="donation">Donation Type</label>
        <select id="donation" value={donation} onChange={(e) => setDonation(e.target.value)} required>
          <option value="">-- Select a Donation --</option>
          {donationCategories[givingType][subCategory].map(don => (
            <option key={don} value={don}>{don}</option>
          ))}
        </select>
      </div>
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
      <div className="navigation-buttons">
        <button type="button" onClick={handleBack} className="back-btn">Back</button>
        <button type="submit" className="submit-btn">Donate Now</button>
      </div>
    </form>
  );

  return (
    <div className="swiitch-love-page-container">
      <h2>SwiitchLove</h2>
      <p>Spread the love. Make a one-time donation to a cause or organization of your choice.</p>
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}
    </div>
  );
};

export default SwiitchLovePage;
