import mongoose from 'mongoose';
import { log } from './vite';
import dotenv from 'dotenv'; // Import dotenv package
import { MongoClient } from 'mongodb';

dotenv.config(); // Load environment variables from .env file

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    log('Connecting to MongoDB...', 'mongodb');
    
    mongoose.set('strictQuery', false);
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is undefined');
    }
    
    try {
      // Use mongoose connection instead of MongoClient
      // Add connection options for better reliability
      cached.promise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // Timeout after 10s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      
      cached.conn = await cached.promise;
      log('Connected to MongoDB', 'mongodb');
      return cached.conn;
    } catch (error: any) {
      log(`Error connecting to MongoDB: ${error.message}`, 'mongodb');
      cached.promise = null; // Clear the promise so we can retry
      throw error;
    }
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null; // Clear the promise so we can retry
    log(`Error waiting for MongoDB connection: ${error.message}`, 'mongodb');
    throw error;
  }
}

export default connectToDatabase;
