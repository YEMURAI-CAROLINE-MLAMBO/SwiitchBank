import sophiaService from './HighCapacitySophiaService.js';

const createManualPaymentNotification = (donationType, amount, recipient) => {
  const amountInDollars = amount / 100;
  const message = `
    A ${donationType} of $${amountInDollars.toFixed(2)} is due to ${recipient}.
    Please make the payment manually through their official website.
  `;
  sophiaService.sendNotification(message);
};

export default {
  createManualPaymentNotification,
};
