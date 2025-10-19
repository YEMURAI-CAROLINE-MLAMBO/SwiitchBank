import express from 'express';
import { celebrate } from 'celebrate';
import * as ticketController from '../controllers/ticketController.js';
import * as ticketValidation from '../validations/ticketValidation.js';

const router = express.Router();

router.post(
  '/',
  celebrate({ body: ticketValidation.createTicketSchema }),
  ticketController.createTicket
);

export default router;
