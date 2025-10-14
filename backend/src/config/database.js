import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected...');
  } catch (err) {
    console.error(err.message);
    throw new Error(`Database disconnection failed: ${err.message}`);
  }
};
