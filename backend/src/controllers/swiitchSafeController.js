import * as swiitchSafeService from '../services/swiitchSafeService.js';
import { extractTextFromFile } from '../services/ocrService.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Upload a document
// @route   POST /api/swiitch-safe
// @access  Private
export const uploadDocument = asyncHandler(async (req, res) => {
  const file = req.file;
  const userId = req.user._id;
  const { transactionId } = req.body; // Get optional transactionId from the body

  if (!file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const ocrText = await extractTextFromFile(file);
  const result = await swiitchSafeService.uploadDocument(userId, file, ocrText, transactionId);

  res.status(201).json(result);
});

// @desc    Get a single document by ID
// @route   GET /api/swiitch-safe/:id
// @access  Private
export const getDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;
  const document = await swiitchSafeService.getDocument(userId, documentId);
  res.status(200).json(document);
});

// @desc    List all documents for a user
// @route   GET /api/swiitch-safe
// @access  Private
export const listDocuments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const documents = await swiitchSafeService.listDocuments(userId);
  res.status(200).json(documents);
});

// @desc    Delete a document
// @route   DELETE /api/swiitch-safe/:id
// @access  Private
export const deleteDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;
  await swiitchSafeService.deleteDocument(userId, documentId);
  res.status(200).json({ message: 'Document removed' });
});

// @desc    Download a document
// @route   GET /api/swiitch-safe/:id/download
// @access  Private
export const downloadDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;

  const document = await swiitchSafeService.getDocument(userId, documentId);

  if (document) {
    res.download(document.filePath, document.fileName);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});
