import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const moonpay = axios.create({
  baseURL: 'https://api.moonpay.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `ApiKey ${process.env.MOONPAY_API_KEY}`,
  },
});

export const getCurrencies = async () => {
  try {
    const response = await moonpay.get('/currencies');
    return response.data;
  } catch (error) {
    logger.error('Error getting currencies from MoonPay:', error);
    throw new Error('Error getting currencies from MoonPay');
  }
};
