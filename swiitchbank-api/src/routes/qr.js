import express from 'express';
import { body } from 'express-validator';
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
  [
    authMiddleware,
    body('type').equals('p2p'),
    body('amount', 'Amount is required and must be numeric').isNumeric().toFloat(),
    body('currency', 'Currency is required').not().isEmpty(),
    body('recipient_id', 'Recipient ID is required').isMongoId(),
    body('expires_in', 'Expiration is required and must be an integer').isInt({ min: 60, max: 3600 }),
    body('memo', 'Memo must be a string').optional().isString(),
  ],
  generateQrCode(QrCodeService)
);

// @route   POST api/v1/qr/process
// @desc    Scan and process a QR code
// @access  Private
router.post(
  '/process',
  [
    authMiddleware,
    body('qr_data', 'QR data is required').not().isEmpty(),
  ],
  processQrCode(QrCodeService)
);

// @route   POST api/v1/qr/confirm
// @desc    Confirm and execute a QR payment
// @access  Private
router.post(
  '/confirm',
  [
    authMiddleware,
    body('payment_id', 'Payment ID is required').not().isEmpty(),
    body('final_amount').custom((value, { req }) => {
        if (value !== undefined && typeof value !== 'number') {
            throw new Error('Final amount must be a number');
        }
        return true;
    }),
  ],
  confirmPayment(WebhookService)
);

export default router;