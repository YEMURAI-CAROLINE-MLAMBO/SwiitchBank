import axios from 'axios';

const API_URL = '/api/swiitch-safe';

// Upload a document
const uploadDocument = async (file, token, transactionId) => {
  const formData = new FormData();
  formData.append('document', file);
  if (transactionId) {
    formData.append('transactionId', transactionId);
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, formData, config);
  return data;
};

// List all documents
const listDocuments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get(API_URL, config);
  return data;
};

// Delete a document
const deleteDocument = async (documentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(`${API_URL}/${documentId}`, config);
};

// Download a document
const downloadDocument = async (documentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // Important for file downloads
  };

  const response = await axios.get(`${API_URL}/${documentId}/download`, config);
  return response;
};

const swiitchSafeService = {
  uploadDocument,
  listDocuments,
  deleteDocument,
  downloadDocument,
};

export default swiitchSafeService;
