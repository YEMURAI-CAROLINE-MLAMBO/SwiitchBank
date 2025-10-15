import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import connectDatabase from '../src/config/database.js';
import mongoose from 'mongoose';

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing SwitchBank Database...');

    // Connect to database
    await connectDatabase();

    // Create initial admin user if needed
    await createInitialData();

    console.log('✅ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

const createInitialData = async () => {
  // Add any initial data, indexes, or setup here
  console.log('📊 Database is ready for use');
};

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
