import React, { useState, useEffect } from 'react';

const TermsOfUsePage = () => {
  const [termsContent, setTermsContent] = useState(null);

  useEffect(() => {
    fetch('/terms-of-use-content.json')
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

export default TermsOfUsePage;
