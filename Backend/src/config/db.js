const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('MONGO_URI not set. Starting in-memory MongoDB...');
    try {
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      console.log('In-memory MongoDB started');
      
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB');
      isConnected = true;
      return;
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err);
      throw err; // Let caller handle the error
    }
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    isConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Let caller handle the error
  }
};

const closeDB = async () => {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      console.log('In-memory MongoDB stopped');
    }
    isConnected = false;
  } catch (err) {
    console.error('Error closing database:', err);
    throw err;
  }
};

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = connectDB;
module.exports.closeDB = closeDB;
