
import { Joi } from 'celebrate';

export const createLoanOfferValidation = {
  body: Joi.object({
    amount: Joi.number().positive().required(),
    interestRate: Joi.number().min(0).max(100).required(),
    term: Joi.number().integer().min(1).required(),
  }),
};
