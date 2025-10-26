// backend/src/config/appConfig.js

const baseConfig = {
  appName: 'SwiitchBank',
  tagline: 'Anywhere Anytime',
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
    API_KEY: process.env.MARQETA_API_KEY,
    APP_TOKEN: process.env.MARQETA_APP_TOKEN,
    ACCESS_TOKEN: process.env.MARQETA_ACCESS_TOKEN
  },
  payouts: {
    feePercentage: 0.01
  }
};

const configs = {
  development: {
    ...baseConfig,
    name: 'Development',
    port: process.env.PORT || 5001,
    marqeta: {
      ...baseConfig.marqeta,
      API_URL: 'https://sandbox-api.marqeta.com/v3',
    }
  },
  staging: {
    ...baseConfig,
    name: 'Staging',
    marqeta: {
      ...baseConfig.marqeta,
      API_URL: 'https://sandbox-api.marqeta.com/v3',
    }
  },
  production: {
    ...baseConfig,
    name: 'Production',
    marqeta: {
      ...baseConfig.marqeta,
      API_URL: 'https://api.marqeta.com/v3',
    }
  }
};

// Determine the current environment and export the correct configuration
const currentEnv = process.env.NODE_ENV || 'development';
const config = configs[currentEnv];

export default config;
