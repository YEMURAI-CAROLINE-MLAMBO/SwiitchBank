const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 */
const authenticate = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
 return res.status(401).json({ 
 errors: [
      { message: 'Authorization token required', location: 'header' }
 ] 
 });

  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.security.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
 res.status(401).json({ 
 errors: [
      { message: 'Invalid token', location: 'token' }
 ] 
 });

  }
};

module.exports = {
  authenticate
};