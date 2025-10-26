import incomeService from './incomeService.js';
import notificationService from './notificationService.js';
import donationService from './donationService.js';

const calculateAndNotifyTithe = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  const grossIncome = await incomeService.calculateGrossIncome(startDate, endDate);
  const titheAmount = grossIncome * 0.1;

  notificationService.createManualPaymentNotification(
    'bi-weekly tithe',
    titheAmount,
    'Kenneth Copeland Ministries'
  );

  await donationService.createTransactionRecord({
    transactionId: `tithe-${Date.now()}`,
    amount: titheAmount,
    recipient: 'Kenneth Copeland Ministries',
    type: 'tithe',
  });
};

const calculateAndNotifyCovenantSeed = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const grossIncome = await incomeService.calculateGrossIncome(startDate, endDate);
  const covenantSeedAmount = grossIncome * 0.02;

  notificationService.createManualPaymentNotification(
    'annual covenant seed',
    covenantSeedAmount,
    'Kenneth Copeland Ministries'
  );

  await donationService.createTransactionRecord({
    transactionId: `covenant-seed-${Date.now()}`,
    amount: covenantSeedAmount,
    recipient: 'Kenneth Copeland Ministries',
    type: 'covenant_seed',
  });
};

const calculateAndNotifyCovenantPartnership = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const grossIncome = await incomeService.calculateGrossIncome(startDate, endDate);
  const covenantPartnershipAmount = grossIncome * 0.02;

  notificationService.createManualPaymentNotification(
    'annual covenant partnership',
    covenantPartnershipAmount,
    'Revival Ministries International'
  );

  await donationService.createTransactionRecord({
    transactionId: `covenant-partnership-${Date.now()}`,
    amount: covenantPartnershipAmount,
    recipient: 'Revival Ministries International',
    type: 'covenant_partnership',
  });
};

export default {
  calculateAndNotifyTithe,
  calculateAndNotifyCovenantSeed,
  calculateAndNotifyCovenantPartnership,
};
