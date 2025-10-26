import { describe, it, expect, jest } from '@jest/globals';
import cron from 'node-cron';
import tithingService from '../src/services/tithingService.js';
import incomeService from '../src/services/incomeService.js';
import sophiaService from '../src/services/HighCapacitySophiaService.js';
import donationService from '../src/services/donationService.js';

describe('Tithing Automation', () => {
  it('should schedule the cron jobs correctly', async () => {
    const cronSpy = jest.spyOn(cron, 'schedule').mockImplementation(() => {});

    // Dynamically import the cronService to ensure the mock is used
    const cronService = await import('../src/services/cronService.js');
    cronService.default.start();

    expect(cronSpy).toHaveBeenCalledWith('0 0 * * 0', expect.any(Function));
    expect(cronSpy).toHaveBeenCalledWith('0 0 1 1 *', expect.any(Function));

    cronSpy.mockRestore();
  });
});

describe('Tithing Service', () => {
  it('should calculate and notify the bi-weekly tithe', async () => {
    const incomeSpy = jest.spyOn(incomeService, 'calculateGrossIncome').mockResolvedValue(100000);
    const sophiaSpy = jest.spyOn(sophiaService, 'sendNotification').mockImplementation(() => {});
    const transactionSpy = jest.spyOn(donationService, 'createTransactionRecord').mockResolvedValue({});

    await tithingService.calculateAndNotifyTithe();

    expect(incomeSpy).toHaveBeenCalled();
    expect(sophiaSpy).toHaveBeenCalledWith(expect.stringContaining('bi-weekly tithe'));
    expect(transactionSpy).toHaveBeenCalledWith({
      transactionId: expect.any(String),
      amount: 10000,
      recipient: 'Kenneth Copeland Ministries',
      type: 'tithe',
    });

    incomeSpy.mockRestore();
    sophiaSpy.mockRestore();
    transactionSpy.mockRestore();
  });

  it('should calculate and notify the annual covenant seed', async () => {
    const incomeSpy = jest.spyOn(incomeService, 'calculateGrossIncome').mockResolvedValue(10000000);
    const sophiaSpy = jest.spyOn(sophiaService, 'sendNotification').mockImplementation(() => {});
    const transactionSpy = jest.spyOn(donationService, 'createTransactionRecord').mockResolvedValue({});

    await tithingService.calculateAndNotifyCovenantSeed();

    expect(incomeSpy).toHaveBeenCalled();
    expect(sophiaSpy).toHaveBeenCalledWith(expect.stringContaining('annual covenant seed'));
    expect(transactionSpy).toHaveBeenCalledWith({
      transactionId: expect.any(String),
      amount: 200000,
      recipient: 'Kenneth Copeland Ministries',
      type: 'covenant_seed',
    });

    incomeSpy.mockRestore();
    sophiaSpy.mockRestore();
    transactionSpy.mockRestore();
  });
});
