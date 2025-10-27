import axios from 'axios';

const moonpayApi = axios.create({
  baseURL: 'https://api.moonpay.com',
  headers: {
    'Authorization': `ApiKey ${process.env.MOONPAY_API_KEY}`
  }
});

export const getSupportedCurrencies = async () => {
  const response = await moonpayApi.get('/v3/currencies');
  return response.data;
};

export const getQuote = async (baseCurrencyCode, quoteCurrencyCode, baseCurrencyAmount) => {
  const response = await moonpayApi.get(`/v3/currencies/${baseCurrencyCode}/quote`, {
    params: {
      quoteCurrencyCode,
      baseCurrencyAmount
    }
  });
  return response.data;
};
