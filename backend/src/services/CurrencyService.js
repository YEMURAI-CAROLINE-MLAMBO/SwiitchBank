import ExchangeRate from '../models/ExchangeRate.js';
import CacheService from './CacheService.js';
import Transaction from '../models/Transaction.js';

class CurrencyService {
  /**
   * REAL-TIME EXCHANGE RATES
   */
  async getExchangeRate(baseCurrency, targetCurrency) {
    const cacheKey = `fx:${baseCurrency}:${targetCurrency}`;

    // Check cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    // Fetch from external API (placeholder)
    const rate = await this.fetchLiveRate(baseCurrency, targetCurrency);

    // Cache for 5 minutes
    await CacheService.set(cacheKey, rate, 300);

    // Store in database for historical tracking
    await ExchangeRate.create({
      baseCurrency,
      targetCurrency,
      rate,
      source: 'fixer' // Placeholder source
    });

    return rate;
  }

  // Placeholder for fetching live rate from an external API
  async fetchLiveRate(baseCurrency, targetCurrency) {
    console.log(`Fetching mock live rate for ${baseCurrency} to ${targetCurrency}`);
    if (baseCurrency === targetCurrency) return 1;

    // Simulate some variability
    const baseRates = {
      USD: 1.0,
      EUR: 1.08,
      GBP: 1.25,
      JPY: 0.0067,
    };

    const rate = (baseRates[targetCurrency] || 1) / (baseRates[baseCurrency] || 1);
    // Add a small random fluctuation to simulate a live market
    const fluctuation = 1 + (Math.random() - 0.5) * 0.02; // +/- 1%

    return rate * fluctuation;
  }

  async getExchangeRates(baseCurrency, symbols) {
    const rates = {};
    for (const symbol of symbols) {
        rates[symbol] = await this.getExchangeRate(baseCurrency, symbol);
    }
    return rates;
  }

  /**
   * CONVERT AMOUNTS ACROSS CURRENCIES
   */
  async convertAmount(amount, fromCurrency, toCurrency, date = new Date()) {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const converted = amount * rate;

    return {
      original: { amount, currency: fromCurrency },
      converted: { amount: converted, currency: toCurrency },
      rate,
      timestamp: date
    };
  }

  /**
   * BATCH CONVERSION FOR PERFORMANCE
   */
  async convertMultipleAmounts(conversions) {
    // Group by currency pairs for efficient API calls
    const currencyPairs = [...new Set(
      conversions.map(c => `${c.fromCurrency}_${c.toCurrency}`)
    )];

    // Fetch all rates in parallel
    const ratePromises = currencyPairs.map(pair => {
      const [from, to] = pair.split('_');
      return this.getExchangeRate(from, to);
    });

    const rates = await Promise.all(ratePromises);
    const rateMap = Object.fromEntries(
      currencyPairs.map((pair, i) => [pair, rates[i]])
    );

    // Convert all amounts
    return conversions.map(conv => {
      const rate = rateMap[`${conv.fromCurrency}_${conv.toCurrency}`];
      return {
        ...conv,
        convertedAmount: conv.amount * rate,
        rate
      };
    });
  }

  /**
   * MULTI-CURRENCY PORTFOLIO AGGREGATION
   */
  async calculateMultiCurrencyNetWorth(userId) {
    // FLAWED LOGIC: This is a placeholder implementation.
    // Net worth should be calculated from account balances, not transaction history.
    // Using Transaction model as a stand-in for the missing Account model.
    const transactions = await Transaction.find({ marqetaUserToken: userId });

    if (!transactions || transactions.length === 0) {
      return {
        totalNetWorth: 0,
        currencyBreakdown: [],
        baseCurrency: await this.getUserBaseCurrency(userId),
        lastUpdated: new Date()
      };
    }

    const amountsByCurrency = transactions.reduce((acc, tx) => {
      const currency = tx.originalCurrency || tx.currency;
      const amount = tx.originalAmount || tx.amount;
      if (acc[currency]) {
        acc[currency] += amount;
      } else {
        acc[currency] = amount;
      }
      return acc;
    }, {});

    const baseCurrency = await this.getUserBaseCurrency(userId);
    const conversions = Object.keys(amountsByCurrency).map(currency => ({
      amount: amountsByCurrency[currency],
      fromCurrency: currency,
      toCurrency: baseCurrency
    }));

    const convertedBalances = await this.convertMultipleAmounts(conversions);

    const totalNetWorth = convertedBalances.reduce(
      (sum, conv) => sum + conv.convertedAmount, 0
    );

    return {
      totalNetWorth,
      currencyBreakdown: convertedBalances,
      baseCurrency: await this.getUserBaseCurrency(userId),
      lastUpdated: new Date()
    };
  }

  async getUserBaseCurrency(userId) {
      // Helper to get user's base currency
      // This would typically involve fetching the User model
      return 'USD';
  }
}

export default new CurrencyService();
