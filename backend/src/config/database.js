import mongoose from 'mongoose';

const databaseConfig = {
  // Connection pooling
  poolSize: 50, // Increased from default 5
  bufferMaxEntries: 0,
  bufferCommands: false,

  // Performance optimizations
  autoIndex: false, // Disable in production
  maxTimeMS: 30000, // Query timeout
  socketTimeoutMS: 45000, // Socket timeout
};

// Connection with retry logic
export const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      ...databaseConfig,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Database connected with optimized settings');
  } catch (err) {
    console.error('Database connection failed, retrying in 5 seconds:', err);
    setTimeout(connectWithRetry, 5000);
  }
};

// Index optimization for large datasets
export const createOptimalIndexes = async () => {
  await mongoose.connection.collection('transactions').createIndexes([
    { key: { user_id: 1, date: -1 } }, // Compound index for user queries
    { key: { user_id: 1, category: 1 } },
    { key: { date: 1 } }, // Date-based queries
    { key: { amount: 1 } } // Amount-based queries
  ]);
};
