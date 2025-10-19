import Ticket from '../models/Ticket.js';
import sanitizeHtml from 'sanitize-html';

export const createTicket = async (ticketData) => {
  // Sanitize description to prevent XSS attacks
  const sanitizedDescription = sanitizeHtml(ticketData.description);

  const newTicket = new Ticket({
    ...ticketData,
    description: sanitizedDescription,
  });

  return await newTicket.save();
};
