import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log(`🔄 Attempting to connect to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on('connecting', () => {
  console.log('🔄 MongoDB is connecting...');
});

db.on('connected', () => {
  console.log('✅ MongoDB connected successfully.');
});

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

db.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
});

db.once('open', () => {
  console.log('🚀 MongoDB connection is open and ready.');
});

export default db;
