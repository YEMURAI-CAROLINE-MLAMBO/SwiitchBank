import Joi from 'joi';

export const generateQrCodeSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().required(),
  recipient_id: Joi.string().required(),
  memo: Joi.string(),
  expires_in: Joi.number().integer().positive(),
});

export const processQrCodeSchema = Joi.object({
  qr_data: Joi.string().required(),
});

export const confirmPaymentSchema = Joi.object({
  payment_id: Joi.string().required(),
  final_amount: Joi.number().positive(),
});
