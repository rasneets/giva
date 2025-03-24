import mongoose from 'mongoose';
import { log } from './vite';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    log('Connecting to MongoDB...', 'mongodb');
    
    mongoose.set('strictQuery', false);
    
    cached.promise = mongoose.connect(MONGODB_URI as string)
      .then((mongoose) => {
        log('Connected to MongoDB', 'mongodb');
        return mongoose;
      })
      .catch((err) => {
        log(`Error connecting to MongoDB: ${err.message}`, 'mongodb');
        throw err;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;