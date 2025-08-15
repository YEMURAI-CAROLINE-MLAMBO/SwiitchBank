const db = require('./database');
const bcrypt = require('bcryptjs');
const config = require('../config/environment');

class UserService {
  async findUserByEmail(email) {
    const users = db.findByIndex('users', 'email', email);
    return users[0];
  }

  async createUser(userData) {
    const { email, password, firstName, lastName } = userData;

    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

    const newUser = db.insert('users', {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Create a default USD wallet for the new user
    db.insert('wallets', {
      userId: newUser.id,
      currency: 'USD',
      balance: 0,
    });

    return newUser;
  }

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new UserService();
