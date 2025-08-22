import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TermsAcceptance = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // Assuming your terms-content.json is hosted or accessible via an API endpoint
        const response = await axios.get('/terms-content.json'); // Adjust the URL as needed
        setTermsContent(response.data.content);
        setLoading(false);
      } catch (err) {
        setError('Failed to load terms and conditions.');
        setLoading(false);
        console.error("Error fetching terms:", err);
      }
    };

    fetchTerms();
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    // You might want to perform an action here, like updating user status on the backend
    onAccept();
  };

  if (loading) {
    return <p>Loading terms and conditions...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Terms and Conditions</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '200px', overflowY: 'scroll' }}>
        {termsContent ? (
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        ) : (
          <p>Terms and conditions content is not available.</p>
        )}
      </div>
      <label style={{ marginTop: '10px', display: 'block' }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleAccept}
        />
        I agree to the terms and conditions
      </label>
      {accepted && <p style={{ color: 'green' }}>Thank you for accepting the terms.</p>}
    </div>
  );
};

export default TermsAcceptance;