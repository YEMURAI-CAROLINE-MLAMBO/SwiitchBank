import React, { useState, useEffect } from 'react';

const TermsAndConditionsPage = () => {
  const [termsContent, setTermsContent] = useState(null);

  useEffect(() => {
    // Since we can't directly import the JSON file from the root in a standard
    // Create React App setup without ejecting, we'll fetch it.
    // In a real-world scenario, this might be an API call or the JSON could be moved into the src directory.
    fetch('/terms-content.json')
      .then(response => response.json())
      .then(data => setTermsContent(data))
      .catch(error => console.error('Error fetching terms content:', error));
  }, []);

  if (!termsContent) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{termsContent.title}</h1>
      {termsContent.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.heading}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TermsAndConditionsPage;
