import SwiitchSafeDocument from '../models/SwiitchSafeDocument.js';

export const uploadDocument = async (userId, file, ocrText, transactionId) => {
  const documentData = {
    user: userId,
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    ocrText: ocrText,
  };

  if (transactionId) {
    documentData.transactionId = transactionId;
  }

  const document = new SwiitchSafeDocument(documentData);
  await document.save();
  return document;
};

export const listDocuments = async (userId) => {
  return await SwiitchSafeDocument.find({ user: userId });
};

export const getDocument = async (userId, documentId) => {
  return await SwiitchSafeDocument.findOne({ _id: documentId, user: userId });
};

import fs from 'fs';

export const deleteDocument = async (userId, documentId) => {
  const document = await SwiitchSafeDocument.findOne({ _id: documentId, user: userId });

  if (document) {
    // Delete the file from the filesystem
    fs.unlink(document.filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${document.filePath}`, err);
      }
    });

    // Delete the document from the database
    await document.deleteOne();
  }
};
