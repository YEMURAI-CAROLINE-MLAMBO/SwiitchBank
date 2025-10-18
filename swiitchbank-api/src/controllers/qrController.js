import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import QrPayment from '../models/QrPayment.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const generateQrCode = (QrCodeService) => async (req, res) => {

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
      qr_data: qrDataUri,
      qr_image_url: `/api/v1/qr/image/${qrPayment.qr_id}`,
      expires_at: qrPayment.expires_at,
      short_url: `https://swtch.bank/pay/${qrPayment.qr_id}`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const processQrCode = (QrCodeService) => async (req, res) => {

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
};

export const confirmPayment = (WebhookService) => async (req, res) => {

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
              plaidTransactionId: `QR-${uuidv4()}`,
              account: payer.id,
              type: 'transfer',
              amount: amountToPay,
              currency: qrPayment.currency,
              category: 'Transfer',
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
};