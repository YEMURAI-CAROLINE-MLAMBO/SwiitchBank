const { validationResult } = require('express-validator');

/**
 * Validate request middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        param: err.param,
        message: err.msg,
        location: err.location,
      })),
    });
  }
  next();
};

module.exports = {
  validate,
};
