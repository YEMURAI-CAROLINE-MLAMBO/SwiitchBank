// backend/src/config/appConfig.js

const configs = {
  development: {
    name: 'Development',
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://sandbox-api.marqeta.com/v3',
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN
    },
    payouts: {
      feePercentage: 0.01
    }
  },
  staging: {
    name: 'Staging',
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://sandbox-api.marqeta.com/v3',
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN
    },
    payouts: {
      feePercentage: 0.01
    }
  },
  production: {
    name: 'Production',
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    marqeta: {
      // These will be populated from GitHub environment secrets
      API_URL: 'https://api.marqeta.com/v3', // Note: Production URL is different
      API_KEY: process.env.MARQETA_API_KEY,
      APP_TOKEN: process.env.MARQETA_APP_TOKEN,
      ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN
    },
    payouts: {
      feePercentage: 0.01
    }
  }
};

// Determine the current environment and export the correct configuration
const currentEnv = process.env.NODE_ENV || 'development';
const config = configs[currentEnv];

module.exports = config;
