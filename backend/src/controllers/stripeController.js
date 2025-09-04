const { validationResult } = require('express-validator');
const stripeService = require('../services/stripe.js');

exports.createCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name } = req.body;

  try {
    const customer = await stripeService.createCustomer(email, name);
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createCharge = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, currency, source, description } = req.body;

  try {
    const charge = await stripeService.createCharge(
      amount,
      currency,
      source,
      description
    );
    res.json(charge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
