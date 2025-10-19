import React from 'react';

const ReactMarkdown = ({ children }) => {
  // A simple mock that renders the markdown content as HTML
  const html = children.toString().replace(/# (.*)/g, '<h1>$1</h1>').replace(/- (.*)/g, '<li>$1</li>');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default ReactMarkdown;
