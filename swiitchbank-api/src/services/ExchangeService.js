import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const COINAPI_KEY = process.env.COINAPI_KEY;

class ExchangeService {
  /**
   * Converts a fiat amount to a cryptocurrency using the CoinAPI.io service.
   * @param {number} amount The amount in the 'from' currency.
   * @param {string} fromCurrency The fiat currency to convert from (e.g., 'USD').
   * @param {string} toCrypto The cryptocurrency to convert to (e.g., 'BTC').
   * @returns {Promise<object>} A promise that resolves to the result of the conversion.
   */
  static async convertFiatToCrypto(amount, fromCurrency, toCrypto) {
    const url = `https://rest.coinapi.io/v1/exchangerate/${toCrypto}/${fromCurrency}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-CoinAPI-Key': COINAPI_KEY,
        },
      });

      const rate = response.data.rate;
      const cryptoAmount = amount / rate;

      return {
        from: fromCurrency,
        to: toCrypto,
        amount: amount,
        cryptoAmount: cryptoAmount,
        rate: rate,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error fetching exchange rate from CoinAPI:', error);
      throw new Error('Failed to fetch exchange rate');
    }
  }
}

export default ExchangeService;
