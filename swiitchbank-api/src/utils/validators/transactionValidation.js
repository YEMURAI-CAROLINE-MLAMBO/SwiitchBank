import Joi from 'joi';

export const topupVirtualCardSchema = Joi.object({
  cardId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

export const withdrawVirtualCardSchema = Joi.object({
  cardId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

export const topupWalletSchema = Joi.object({
  walletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

export const transferFundsSchema = Joi.object({
  fromWalletId: Joi.string().required(),
  toWalletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

export const createChargeSchema = Joi.object({
  amount: Joi.number().integer().required(),
  currency: Joi.string().required(),
  source: Joi.string().required(),
  description: Joi.string().required(),
});
