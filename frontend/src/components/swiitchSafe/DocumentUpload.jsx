import React, { useState } from 'react';

const DocumentUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null); // Reset after upload
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} aria-label="File upload" />
      <button type="submit" disabled={!file}>
        Upload
      </button>
    </form>
  );
};

export default DocumentUpload;
