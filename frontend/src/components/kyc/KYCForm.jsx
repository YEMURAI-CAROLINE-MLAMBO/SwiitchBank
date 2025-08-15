import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import DocumentUpload from './DocumentUpload';

const KYCForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    address: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, document: file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <Input
        name="dob"
        label="Date of Birth"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        required
      />
      <Input
        name="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <DocumentUpload onFileSelect={handleFileChange} />
      <Button type="submit" variant="primary">Submit for Verification</Button>
    </form>
  );
};

export default KYCForm;
