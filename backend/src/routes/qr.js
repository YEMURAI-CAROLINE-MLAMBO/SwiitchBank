import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { generateQrCodeSchema, processQrCodeSchema, confirmPaymentSchema } from '../utils/validators/qrValidation.js';
import authMiddleware from '../middleware/auth.js';
import { generateQrCode, processQrCode, confirmPayment } from '../controllers/qrController.js';
import QrCodeService from '../services/QrCodeService.js';
import WebhookService from '../services/WebhookService.js';

const router = express.Router();

// @route   POST api/v1/qr/generate
// @desc    Generate a P2P payment QR code
// @access  Private
router.post(
  '/generate',
  authMiddleware,
  celebrate({ [Segments.BODY]: generateQrCodeSchema }),
  generateQrCode(QrCodeService)
);

// @route   POST api/v1/qr/process
// @desc    Scan and process a QR code
// @access  Private
router.post(
  '/process',
  authMiddleware,
  celebrate({ [Segments.BODY]: processQrCodeSchema }),
  processQrCode(QrCodeService)
);

// @route   POST api/v1/qr/confirm
// @desc    Confirm and execute a QR payment
// @access  Private
router.post(
  '/confirm',
  authMiddleware,
  celebrate({ [Segments.BODY]: confirmPaymentSchema }),
  confirmPayment(WebhookService)
);

export default router;