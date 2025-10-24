import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateGrossIncome = async (startDate, endDate) => {
  let grossIncome = 0;
  let hasMore = true;
  let startingAfter = undefined;

  while (hasMore) {
    const events = await stripe.events.list({
      type: 'payment_intent.succeeded',
      created: {
        gte: startDate.getTime() / 1000,
        lte: endDate.getTime() / 1000,
      },
      limit: 100,
      starting_after: startingAfter,
    });

    for (const event of events.data) {
      grossIncome += event.data.object.amount;
    }

    if (events.has_more) {
      startingAfter = events.data[events.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  return grossIncome;
};

export default {
  calculateGrossIncome,
};
