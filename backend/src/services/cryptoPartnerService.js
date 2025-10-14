// backend/src/services/cryptoPartnerService.js

// This is a hypothetical service that would interact with a crypto partner's API.
// For the purpose of this example, it will return mock data.

const getSupportedCurrencies = async () => {
  // In a real application, this would make an API call to a crypto partner.
  return Promise.resolve(['BTC', 'ETH', 'USDT', 'SOL']);
};

const getExchangeRate = async (fromCurrency, toCurrency) => {
  // In a real application, this would make an API call to a crypto partner.
  const rate = 42000 + Math.random() * 4000; // Simulate a fluctuating rate for BTC to USD
  return Promise.resolve({
    from: fromCurrency,
    to: toCurrency,
    rate: rate.toFixed(2),
  });
};

export {
  getSupportedCurrencies,
  getExchangeRate,
};
