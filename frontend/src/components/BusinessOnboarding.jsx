import React, { useState } from 'react';
import TeamMembers from './business-accounts/TeamMembers';

const BusinessOnboarding = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    taxId: '',
  });
  const [nameAvailable, setNameAvailable] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  const { businessName, businessAddress, taxId } = formData;

  const checkNameAvailability = async (name) => {
    if (name.length > 2) {
      try {
        const res = await fetch(
          `/api/onboarding/business/availability?businessName=${name}`
        );
        const data = await res.json();
        setNameAvailable(data.isAvailable);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'businessName') {
      checkNameAvailability(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!nameAvailable) {
      alert('Business name is not available. Please choose another one.');
      return;
    }
    try {
      const res = await fetch('/api/onboarding/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setBusinessId(data._id);
      alert('Business account created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating business account');
    }
  };

  return (
    <div>
      <h2>Create a Business Account</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Business Name"
            name="businessName"
            value={businessName}
            onChange={onChange}
            required
          />
          {!nameAvailable && (
            <p style={{ color: 'red' }}>Business name not available</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Business Address"
            name="businessAddress"
            value={businessAddress}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Tax ID"
            name="taxId"
            value={taxId}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Create Account" />
      </form>
      {businessId && <TeamMembers businessId={businessId} />}
    </div>
  );
};

export default BusinessOnboarding;
