const stripe = require('stripe')(process.env.STRIPE_API_KEY);

/**
 * Create a new customer in Stripe.
 * @param {string} email - The customer's email address.
 * @param {string} name - The customer's full name.
 * @returns {object} The created customer object.
 */
exports.createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

/**
 * Process a payment using Stripe.
 * @param {number} amount - The payment amount in cents.
 * @param {string} currency - The currency of the payment.
 * @param {string} source - The payment source (e.g., a card token).
 * @param {string} description - A description of the payment.
 * @returns {object} The created charge object.
 */
exports.createCharge = async (amount, currency, source, description) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description,
    });
    return charge;
  } catch (error) {
    console.error('Error creating Stripe charge:', error);
    throw error;
  }
};
