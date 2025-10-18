import { InputSanitizer } from '../security/InputSanitizer.js';

export const securityMiddleware = (req, res, next) => {
  const sanitizer = req.app.get('sanitizer') || InputSanitizer;
  req.body = sanitizer.sanitizeInput(req.body);
  req.query = sanitizer.sanitizeInput(req.query);
  req.params = sanitizer.sanitizeInput(req.params);
  next();
};