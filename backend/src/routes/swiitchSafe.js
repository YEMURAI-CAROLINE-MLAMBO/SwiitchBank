import express from 'express';
import {
  uploadDocument,
  getDocument,
  listDocuments,
  deleteDocument,
  downloadDocument,
} from '../controllers/swiitchSafeController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').post(protect, upload.single('document'), uploadDocument).get(protect, listDocuments);

router
  .route('/:id')
  .get(protect, getDocument)
  .delete(protect, deleteDocument);

router.route('/:id/download').get(protect, downloadDocument);

export default router;
