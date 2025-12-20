import React, { useState } from 'react';
import DocumentUpload from './swiitchSafe/DocumentUpload';

const UploadModal = ({ isOpen, onClose, transactionId, onUpload }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Document for Transaction</h2>
        <p>Transaction ID: {transactionId}</p>
        <DocumentUpload onUpload={onUpload} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UploadModal;
