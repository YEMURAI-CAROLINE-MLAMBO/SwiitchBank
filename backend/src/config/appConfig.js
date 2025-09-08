// backend/src/config/appConfig.js

const configs = {
  development: {
    name: 'Development',
    firebase: {
      apiKey: 'AIzaSyDxPY90kj3ueTNF9IGYQLyuHiDOa_CCv-E',
      authDomain: 'swiitchbank-09410265.firebaseapp.com',
      projectId: 'swiitchbank-09410265',
      storageBucket: 'swiitchbank-09410265.appspot.com',
      messagingSenderId: '24016491102',
      appId: '1:24016491102:web:4f1c72e3895e0b69401acf',
      measurementId: 'G-F9W3SZ2GCC',
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://sandbox-api.marqeta.com/v3',
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN,
    },
    payouts: {
      feePercentage: 0.01,
    },
  },
  staging: {
    name: 'Staging',
    firebase: {
      apiKey: 'AIzaSyDxPY90kj3ueTNF9IGYQLyuHiDOa_CCv-E',
      authDomain: 'swiitchbank-09410265.firebaseapp.com',
      projectId: 'swiitchbank-09410265',
      storageBucket: 'swiitchbank-09410265.appspot.com',
      messagingSenderId: '24016491102',
      appId: '1:24016491102:web:4f1c72e3895e0b69401acf',
      measurementId: 'G-F9W3SZ2GCC',
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://sandbox-api.marqeta.com/v3',
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN,
    },
    payouts: {
      feePercentage: 0.01,
    },
  },
  production: {
    name: 'Production',
    firebase: {
      apiKey: 'AIzaSyDxPY90kj3ueTNF9IGYQLyuHiDOa_CCv-E',
      authDomain: 'swiitchbank-09410265.firebaseapp.com',
      projectId: 'swiitchbank-09410265',
      storageBucket: 'swiitchbank-09410265.appspot.com',
      messagingSenderId: '24016491102',
      appId: '1:24016491102:web:4f1c72e3895e0b69401acf',
      measurementId: 'G-F9W3SZ2GCC',
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://api.marqeta.com/v3', // Note: Production URL is different
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN,
    },
    payouts: {
      feePercentage: 0.01,
    },
  },
};

// Determine the current environment and export the correct configuration
const currentEnv = process.env.NODE_ENV || 'development';
const config = configs[currentEnv];

module.exports = config;
