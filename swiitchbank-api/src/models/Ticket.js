import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Sanitize the description before saving to prevent XSS attacks
ticketSchema.pre('save', function (next) {
  if (this.isModified('description')) {
    this.description = sanitizeHtml(this.description);
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
