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
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI as string, {
        bufferCommands: false, // Disable mongoose buffering
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        maxPoolSize: 10, // Maintain up to 10 socket connections
        retryWrites: true, // Retry failed writes
        w: 'majority', // Write to primary and replicas
      });
      
      cached.conn = await cached.promise;
      log('Connected to MongoDB', 'mongodb');
      return cached.conn;
    } catch (error: any) {
      log(`Error connecting to MongoDB: ${error.message}`, 'mongodb');
      cached.promise = null;
      throw error;
    }
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    log(`Error waiting for MongoDB connection: ${error.message}`, 'mongodb');
    throw error;
  }
}

export default connectToDatabase;
