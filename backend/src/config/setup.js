const db = require('../services/database');

// Initialize database schema
const initDatabase = () => {
  // Users table
  db.createTable('users', {
    indexes: ['email']
  });

  // Cards table
  db.createTable('cards', {
    indexes: ['userId']
  });

  // Wallets table
  db.createTable('wallets', {
    indexes: ['userId', 'currency']
  });

  // Transactions table
  db.createTable('transactions', {
    indexes: ['userId', 'type']
  });

  console.log('Database initialized with in-memory storage');
};

// Seed initial data
const seedDatabase = () => {
  // Create admin user
  db.insert('users', {
    email: 'admin@swiitchbank.com',
    password: 'hashed_password', // In real app, use bcrypt
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  });

  console.log('Database seeded with initial data');
};

module.exports = { initDatabase, seedDatabase };
