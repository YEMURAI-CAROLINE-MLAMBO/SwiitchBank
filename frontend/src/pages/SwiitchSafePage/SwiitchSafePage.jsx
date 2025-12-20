import React, { useState, useEffect } from 'react';
import DocumentList from '../../components/swiitchSafe/DocumentList';
import DocumentUpload from '../../components/swiitchSafe/DocumentUpload';
import swiitchSafeService from '../../services/swiitchSafeService';
import { useAuth } from '../../context/AuthContext';

const SwiitchSafePage = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchDocuments = async () => {
    try {
      if (user) {
        const docs = await swiitchSafeService.listDocuments(user.token);
        setDocuments(docs);
      }
    } catch (err) {
      setError('Error fetching documents.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpload = async (file) => {
    try {
      if (user) {
        await swiitchSafeService.uploadDocument(file, user.token);
        fetchDocuments(); // Refresh the list after upload
      }
    } catch (err) {
      setError('Error uploading document.');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      if (user) {
        await swiitchSafeService.deleteDocument(documentId, user.token);
        fetchDocuments(); // Refresh the list after delete
      }
    } catch (err) {
      setError('Error deleting document.');
    }
  };

  return (
    <div>
      <h1>SwiitchSafe</h1>
      <p>Your secure document vault.</p>

      <div>
        <h2>Upload New Document</h2>
        <DocumentUpload onUpload={handleUpload} />
      </div>

      <div>
        <h2>Your Documents</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <DocumentList documents={documents} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default SwiitchSafePage;
