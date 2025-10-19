import { Joi } from 'celebrate';

export default {
  createPaymentIntent: {
    body: Joi.object({
      amount: Joi.number().required().min(1),
      currency: Joi.string().required().length(3),
    }),
  },
};
