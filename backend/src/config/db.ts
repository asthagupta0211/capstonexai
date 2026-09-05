import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (!env.MONGODB_URI || env.MONGODB_URI.trim() === '') {
    const errorMsg = 'MONGODB_URI is not set in .env. Please add your MongoDB Atlas connection string.';
    logger.warn(errorMsg);
    isConnected = false;
    return false;
  }

  try {
    logger.info('Connecting to MongoDB Atlas...');
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    logger.info(`Successfully connected to MongoDB Atlas cluster (database: ${env.MONGODB_DB_NAME})!`);
    return true;
  } catch (error: any) {
    logger.error(`Failed to connect to MongoDB Atlas: ${error.message}`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDB(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
