import cron from 'node-cron';
import donationService from './donationService.js';

const getWeekOfYear = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const start = () => {
  // Schedule the cron job to run every Sunday at midnight.
  cron.schedule('0 0 * * 0', async () => {
    const weekNumber = getWeekOfYear(new Date());
    if (weekNumber % 2 === 0) {
      try {
        console.log('Running bi-weekly tithe calculation...');
        await donationService.calculateAndNotifyTithe();
      } catch (error) {
        console.error('Error calculating and notifying tithe:', error);
      }
    }
  });

  // Schedule the cron job to run on January 1st at midnight.
  cron.schedule('0 0 1 1 *', async () => {
    try {
      console.log('Running annual covenant seed calculation...');
      await donationService.calculateAndNotifyCovenantSeed();
    } catch (error) {
      console.error('Error calculating and notifying covenant seed:', error);
    }
  });

  // Schedule the cron job to run on January 1st at midnight.
  // cron.schedule('0 0 1 1 *', async () => {
  //   try {
  //     console.log('Running annual covenant partnership calculation...');
  //     await donationService.calculateAndNotifyCovenantPartnership();
  //   } catch (error) {
  //     console.error('Error calculating and notifying covenant partnership:', error);
  //   }
  // });
};

export default {
  start,
};
