// backend/src/config/appConfig.js

const configs = {
  development: {
    name: 'Development',
    firebase: {
      // TODO: Add your development Firebase project configuration here
      apiKey: "your-dev-api-key",
      authDomain: "your-dev-project-id.firebaseapp.com",
      projectId: "your-dev-project-id",
      storageBucket: "your-dev-project-id.appspot.com",
      messagingSenderId: "your-dev-sender-id",
      appId: "your-dev-app-id"
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
      // TODO: Add your staging Firebase project configuration here
      apiKey: "your-staging-api-key",
      authDomain: "your-staging-project-id.firebaseapp.com",
      projectId: "your-staging-project-id",
      storageBucket: "your-staging-project-id.appspot.com",
      messagingSenderId: "your-staging-sender-id",
      appId: "your-staging-app-id"
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
      // TODO: Add your production Firebase project configuration here
      apiKey: "your-prod-api-key",
      authDomain: "your-prod-project-id.firebaseapp.com",
      projectId: "your-prod-project-id",
      storageBucket: "your-prod-project-id.appspot.com",
      messagingSenderId: "your-prod-sender-id",
      appId: "your-prod-app-id"
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
