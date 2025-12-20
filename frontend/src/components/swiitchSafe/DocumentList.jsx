import React from 'react';

import swiitchSafeService from '../../services/swiitchSafeService';
import { useAuth } from '../../context/AuthContext';

const DocumentList = ({ documents, onDelete }) => {
  const { user } = useAuth();

  const handleDownload = async (doc) => {
    try {
      const response = await swiitchSafeService.downloadDocument(doc._id, user.token);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (!documents || documents.length === 0) {
    return <p>You have no documents saved.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Upload Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc._id}>
            <td>{doc.fileName}</td>
            <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={() => handleDownload(doc)}>Download</button>
              <button onClick={() => onDelete(doc._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DocumentList;
