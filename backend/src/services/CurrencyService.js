import mongoose from 'mongoose';
import User from '../models/User.js';
import Account from '../models/Account.js';
import ExchangeRate from '../models/ExchangeRate.js';
import CacheService from './CacheService.js';

// A mock API client for fetching exchange rates
const ExchangeRateApiClient = {
  async fetch(base, targets) {
    console.log(`Simulating API call to fetch rates for base ${base} against ${targets.join(',')}`);
    // In a real app, this would be an axios call to a real API like Fixer.io or Open Exchange Rates
    const mockRates = {
      USD: 1.0,
      EUR: 1.08,
      GBP: 1.25,
      JPY: 0.0067,
      AUD: 0.66,
      CAD: 0.73,
    };

    const results = {};
    for (const target of targets) {
      if (base === target) {
        results[target] = 1;
        continue;
      }
      const rate = (mockRates[target] || 1) / (mockRates[base] || 1);
      const fluctuation = 1 + (Math.random() - 0.5) * 0.02; // +/- 1%
      results[target] = rate * fluctuation;
    }
    return results;
  }
};

class CurrencyService {
  /**
   * Fetches the exchange rate for a single currency pair.
   * Caches the result for 5 minutes.
   */
  async getExchangeRate(baseCurrency, targetCurrency) {
    if (baseCurrency === targetCurrency) return 1;

    const cacheKey = `fx:${baseCurrency}:${targetCurrency}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const rates = await ExchangeRateApiClient.fetch(baseCurrency, [targetCurrency]);
    const rate = rates[targetCurrency];

    if (!rate) {
      throw new Error(`Could not retrieve exchange rate for ${baseCurrency} to ${targetCurrency}`);
    }

    await CacheService.set(cacheKey, rate, 300); // Cache for 5 minutes

    // Log historical rate
    await ExchangeRate.create({
      baseCurrency,
      targetCurrency,
      rate,
      source: 'simulated-api'
    });

    return rate;
  }

  /**
   * Converts a single amount between two currencies.
   */
  async convertAmount(amount, fromCurrency, toCurrency) {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return {
      originalAmount: amount,
      convertedAmount: amount * rate,
      fromCurrency,
      toCurrency,
      rate,
    };
  }

  /**
   * Calculates the total net worth of a user across all their currency accounts.
   *
   * @param {string} userId - The ID of the user.
   * @returns {object} An object containing the total net worth, a breakdown by currency,
   *                   the user's base currency, and the last updated timestamp.
   */
  async calculateMultiCurrencyNetWorth(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const baseCurrency = user.personalization.currency || 'USD';

    // Fetch all accounts for the user
    const accounts = await Account.find({ userId });

    if (accounts.length === 0) {
      return {
        totalNetWorth: 0,
        currencyBreakdown: [],
        baseCurrency,
        lastUpdated: new Date(),
      };
    }

    // Get unique currencies from accounts
    const currencies = [...new Set(accounts.map(acc => acc.currency))];

    // Fetch all required exchange rates in one go
    const rates = await this.getMultipleExchangeRates(currencies, baseCurrency);

    let totalNetWorth = 0;
    const currencyBreakdown = [];

    // Calculate total balance for each currency and convert to base currency
    for (const currency of currencies) {
      const accountsInCurrency = accounts.filter(acc => acc.currency === currency);
      const totalBalance = accountsInCurrency.reduce((sum, acc) => sum + acc.balance, 0);

      const rate = rates[currency];
      const valueInBaseCurrency = totalBalance * rate;

      totalNetWorth += valueInBaseCurrency;

      currencyBreakdown.push({
        currency,
        totalBalance,
        valueInBaseCurrency,
        rate,
      });
    }

    return {
      totalNetWorth,
      currencyBreakdown,
      baseCurrency,
      lastUpdated: new Date(),
    };
  }

  /**
   * Fetches multiple exchange rates relative to a single base currency.
   */
  async getMultipleExchangeRates(targetCurrencies, baseCurrency) {
    const rates = {};
    const missingFromCache = [];

    // Check cache for each currency
    for (const target of targetCurrencies) {
      if (target === baseCurrency) {
        rates[target] = 1;
        continue;
      }
      const cacheKey = `fx:${baseCurrency}:${target}`;
      const cachedRate = await CacheService.get(cacheKey);
      if (cachedRate) {
        rates[target] = cachedRate;
      } else {
        missingFromCache.push(target);
      }
    }

    // Fetch missing rates from the API
    if (missingFromCache.length > 0) {
      const fetchedRates = await ExchangeRateApiClient.fetch(baseCurrency, missingFromCache);
      for (const target of missingFromCache) {
        const rate = fetchedRates[target];
        if (rate) {
          rates[target] = rate;
          const cacheKey = `fx:${baseCurrency}:${target}`;
          await CacheService.set(cacheKey, rate, 300); // Cache for 5 minutes
          await ExchangeRate.create({ baseCurrency, targetCurrency: target, rate, source: 'simulated-api' });
        }
      }
    }

    return rates;
  }

  /**
   * Retrieves the user's preferred base currency.
   */
  async getUserBaseCurrency(userId) {
    const user = await User.findById(mongoose.Types.ObjectId(userId));
    return user ? user.personalization.currency : 'USD';
  }
}

export default new CurrencyService();