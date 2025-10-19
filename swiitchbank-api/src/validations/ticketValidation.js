import { Joi } from 'celebrate';

export const createTicketSchema = Joi.object({
  userId: Joi.string().required(),
  subject: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent'),
});
