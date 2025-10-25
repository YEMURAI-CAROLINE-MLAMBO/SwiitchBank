import mongoose from 'mongoose';
import DatabaseResilience from './Resilience.js';

const databaseConfig = {
  // Connection settings
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,

  // Write concerns
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  },

  // Read preferences
  readPreference: 'primary',

  // Retry settings
  retryWrites: true,
  retryReads: true
};

const connectDatabase = async (uri) => {
  const connectWithResilience = () =>
    DatabaseResilience.withTimeout(() =>
      mongoose.connect(uri, {
        ...databaseConfig,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );

  try {
    const conn = await DatabaseResilience.withRetry(connectWithResilience);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create indexes in background for performance
    await createIndexes();

    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error; // Re-throw error for test environment to handle
  }
};

// Create optimal indexes
const createIndexes = async () => {
  try {
    console.log('🔄 Creating database indexes...');

    // Transaction indexes
    await mongoose.connection.collection('transactions').createIndexes([
      { key: { user: 1, date: -1 } },
      { key: { user: 1, category: 1 } },
      { key: { user: 1, amount: 1 } },
      { key: { user: 1, merchantName: 1 } },
      { key: { user: 1, pending: 1 } },
      {
        key: { name: 'text', merchantName: 'text', notes: 'text' },
        weights: { name: 10, merchantName: 5, notes: 1 },
        default_language: 'english'
      }
    ]);

    // User indexes
    await mongoose.connection.collection('users').createIndexes([
      // { key: { email: 1 } }, // This index is already created by the schema
      { key: { createdAt: -1 } },
      // { key: { plaidItemId: 1 } } // This index is also created by the schema
    ]);

    // Account indexes
    await mongoose.connection.collection('accounts').createIndexes([
      { key: { user: 1, plaidAccountId: 1 }, unique: true },
      { key: { user: 1, type: 1 } },
      { key: { user: 1, isActive: 1 } }
    ]);

    // Sophia insights indexes
    await mongoose.connection.collection('sophiainsights').createIndexes([
      { key: { user: 1, type: 1 } },
      { key: { user: 1, impact: 1 } },
      { key: { user: 1, isRead: 1 } },
      { key: { user: 1, createdAt: -1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
    ]);

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Index creation error:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📊 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB connection disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📊 MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDatabase;
