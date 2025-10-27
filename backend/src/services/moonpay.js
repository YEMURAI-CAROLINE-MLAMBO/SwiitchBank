import axios from 'axios';

const moonpay = axios.create({
  baseURL: 'https://api.moonpay.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSupportedCurrencies = async () => {
  const response = await moonpay.get(`/currencies?apiKey=${process.env.MOONPAY_API_KEY}`);
  return response.data;
};

export const getQuote = async (baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount) => {
  const response = await moonpay.get(
    `/currencies/${baseCurrencyCode}/quote?apiKey=${process.env.MOONPAY_API_KEY}&quoteCurrencyCode=${quoteCurrencyCode}&baseCurrencyAmount=${baseCurrencyAmount}`
  );
  return response.data;
};
