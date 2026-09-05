import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (!env.MONGODB_URI || env.MONGODB_URI.trim() === '') {
    const errorMsg = '❌ [Database Error] MONGODB_URI is not set in .env. Please add your MongoDB Atlas connection string (e.g. mongodb+srv://<user>:<password>@cluster.mongodb.net/capstonex).';
    console.error(errorMsg);
    isConnected = false;
    return false;
  }

  try {
    console.log('⏳ [Database] Connecting to MongoDB Atlas...');
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ [Database] Successfully connected to MongoDB Atlas cluster (database: ${env.MONGODB_DB_NAME})!`);
    return true;
  } catch (error: any) {
    console.error(`❌ [Database Error] Failed to connect to MongoDB Atlas: ${error.message}`);
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
