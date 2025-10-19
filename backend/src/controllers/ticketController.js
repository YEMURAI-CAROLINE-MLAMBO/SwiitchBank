import * as ticketService from '../services/ticketService.js';

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({
      message: 'Ticket created successfully!',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};
