import { InputSanitizer } from '../security/InputSanitizer.js';

export const securityMiddleware = (req, res, next) => {
  req.body = InputSanitizer.sanitizeInput(req.body);
  req.query = InputSanitizer.sanitizeInput(req.query);
  req.params = InputSanitizer.sanitizeInput(req.params);
  next();
};