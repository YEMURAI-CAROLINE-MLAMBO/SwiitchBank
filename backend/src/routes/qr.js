import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import authMiddleware from '../middleware/auth.js';
import QrPayment from '../models/QrPayment.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import QrCodeService from '../services/QrCodeService.js';
import WebhookService from '../services/WebhookService.js'; // Assuming this service exists

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, recipient_id, memo, expires_in } = req.body;

    try {
      const recipient = await User.findById(recipient_id);
      if (!recipient) {
        return res.status(404).json({ msg: 'Recipient not found' });
      }

      const { payload, signature, qrDataUri } = await QrCodeService.generateP2pQrCode(
        recipient_id,
        amount,
        currency,
        memo,
        expires_in,
        process.env.QR_CODE_HMAC_SECRET
      );

      const qrPayment = new QrPayment({
        qr_id: uuidv4(),
        recipient: recipient_id,
        amount,
        currency,
        memo,
        expires_at: new Date(payload.expires * 1000),
        signature,
      });

      await qrPayment.save();

      res.json({
        qr_id: qrPayment.qr_id,
        qr_data: qrDataUri, // The data URL for the QR image
        qr_image_url: `/api/v1/qr/image/${qrPayment.qr_id}`, // A URL to fetch the image itself
        expires_at: qrPayment.expires_at,
        short_url: `https://swtch.bank/pay/${qrPayment.qr_id}`, // Placeholder
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { qr_data } = req.body;

    try {
        const base64Payload = qr_data.split('/').pop();
        const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));

        if (!QrCodeService.verifyP2pQrCode(decodedPayload, process.env.QR_CODE_HMAC_SECRET)) {
            return res.status(400).json({ msg: 'Invalid QR code signature.' });
        }

        const qrPayment = await QrPayment.findOne({ signature: decodedPayload.signature });

        if (!qrPayment) {
            return res.status(404).json({ msg: 'QR Payment not found or already processed.' });
        }

        if (qrPayment.status !== 'pending') {
            return res.status(400).json({ msg: `QR code has already been ${qrPayment.status}.` });
        }

        if (new Date() > qrPayment.expires_at) {
            qrPayment.status = 'expired';
            await qrPayment.save();
            return res.status(400).json({ msg: 'QR code has expired.' });
        }

        const recipient = await User.findById(qrPayment.recipient);

        res.json({
            payment_id: qrPayment.qr_id,
            qr_details: {
                type: 'p2p',
                amount: qrPayment.amount,
                currency: qrPayment.currency,
                recipient: { user_id: recipient._id, name: recipient.name },
                memo: qrPayment.memo,
            },
            actions: ['confirm'],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  }
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
        // Allow final_amount to be optional, but if present, must be numeric
        if (value !== undefined && typeof value !== 'number') {
            throw new Error('Final amount must be a number');
        }
        return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { payment_id, final_amount } = req.body;
    const payerId = req.user.id;

    try {
        const qrPayment = await QrPayment.findOne({ qr_id: payment_id });

        if (!qrPayment) {
            return res.status(404).json({ msg: 'Payment not found.' });
        }
        if (qrPayment.status !== 'pending') {
            return res.status(400).json({ msg: 'Payment is not pending.' });
        }

        const amountToPay = final_amount !== undefined ? final_amount : qrPayment.amount;

        const payer = await User.findById(payerId);
        const recipient = await User.findById(qrPayment.recipient);

        if (payer.balance < amountToPay) {
            qrPayment.status = 'failed';
            await qrPayment.save();

            const eventData = {
                payment_id: qrPayment.qr_id,
                error_code: 'insufficient_funds',
                error_message: 'User has insufficient balance',
                amount: amountToPay,
                currency: qrPayment.currency,
            };
            // In a real app, these URLs would come from the user/merchant profile
            const payerWebhookUrl = 'https://webhook.site/mock-payer-endpoint';
            const recipientWebhookUrl = 'https://webhook.site/mock-recipient-endpoint';
            await WebhookService.trigger('qr.payment_failed', eventData, payerWebhookUrl, process.env.WEBHOOK_SECRET);
            await WebhookService.trigger('qr.payment_failed', eventData, recipientWebhookUrl, process.env.WEBHOOK_SECRET);

            return res.status(400).json({ msg: 'Insufficient funds' });
        }

        const executeTransaction = async (session) => {
            payer.balance -= amountToPay;
            recipient.balance += amountToPay;

            const transaction = new Transaction({
                user: payerId,
                date: new Date(),
                name: `QR Transfer to ${recipient.firstName}`,
                plaidTransactionId: `QR-${uuidv4()}`, // Placeholder
                account: payer.id, // Placeholder, assuming internal account
                type: 'transfer',
                amount: amountToPay,
                currency: qrPayment.currency,
                category: 'Transfer', // Add required category
                status: 'completed',
                description: `QR Payment to ${recipient.name}: ${qrPayment.memo || ''}`,
                related_user: recipient._id,
            });

            await payer.save({ session });
            await recipient.save({ session });
            await transaction.save({ session });

            qrPayment.status = 'completed';
            qrPayment.transaction = transaction._id;
            await qrPayment.save({ session });

            return transaction._id;
        };

        let transactionId;

        if (process.env.NODE_ENV === 'test') {
            // Don't use transactions in the test environment to avoid replica set requirement
            transactionId = await executeTransaction(null);
        } else {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    transactionId = await executeTransaction(session);
                });
            } finally {
                session.endSession();
            }
        }

        const eventData = {
            payment_id: qrPayment.qr_id,
            transaction_id: transactionId,
            status: 'completed',
            amount: amountToPay,
            currency: qrPayment.currency,
        };
        const payerWebhookUrl = 'https://webhook.site/mock-payer-endpoint';
        const recipientWebhookUrl = 'https://webhook.site/mock-recipient-endpoint';
        await WebhookService.trigger('qr.payment_completed', eventData, payerWebhookUrl, process.env.WEBHOOK_SECRET);
        await WebhookService.trigger('qr.payment_completed', eventData, recipientWebhookUrl, process.env.WEBHOOK_SECRET);

        res.json({
            transaction_id: transactionId,
            status: 'completed',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  }
);

export default router;