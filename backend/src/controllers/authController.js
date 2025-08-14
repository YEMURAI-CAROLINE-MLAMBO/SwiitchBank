const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const config = require('../config/environment');
const logger = require('../utils/logger');
const { encrypt } = require('../utils/encryption');

class AuthController {
  /**
   * Register new user
   */
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user exists
      const userCheck = await query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );
      
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
      
      // Create user
      const result = await query(
        `INSERT INTO users (email, password, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, first_name, last_name, created_at`,
        [email, hashedPassword, firstName, lastName]
      );
      
      const newUser = result.rows[0];
      
      // Create default wallet
      await query(
        `INSERT INTO wallets (user_id, currency, balance) 
         VALUES ($1, 'USD', 0)`,
        [newUser.id]
      );
      
      // Generate JWT
      const token = this.generateToken(newUser.id);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          createdAt: newUser.created_at
        },
        token
      });
    } catch (error) {
      logger.error('Registration failed:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  /**
   * Authenticate user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const result = await query(
        `SELECT id, email, password, first_name, last_name 
         FROM users WHERE email = $1`,
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT
      const token = this.generateToken(user.id);
      
      // Record login
      await query(
        `INSERT INTO user_logins (user_id) VALUES ($1)`,
        [user.id]
      );
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      });
    } catch (error) {
      logger.error('Login failed:', error);
      res.status(500).json({ error: 'Failed to authenticate' });
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpire }
    );
  }
}

module.exports = new AuthController();