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
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      log('Connected to MongoDB', 'mongodb');
      return client;
    } catch (error: any) {
      log(`Error connecting to MongoDB: ${error.message}`, 'mongodb');
      throw error;
    } finally {
      await client.close();
    }
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
