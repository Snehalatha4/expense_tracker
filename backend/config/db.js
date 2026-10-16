const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendsmart';

    // If explicit memory DB mode is enabled (for automated tests or offline demo mode)
    if (process.env.USE_MEMORY_DB === 'true') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        console.log('⚡ Using MongoMemoryServer for isolated testing/in-memory instance.');
      } catch (memErr) {
        console.warn('⚠️ Could not start MongoMemoryServer, falling back to MONGODB_URI:', memErr.message);
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // fail fast if local mongod is not reachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`
----------------------------------------------------------------------
Prerequisite Notice:
SpendSmart requires a running MongoDB database.
To run MongoDB locally:
  1. Download & install MongoDB Community Server: https://www.mongodb.com/try/download/community
  2. Start MongoDB service: net start MongoDB (or run 'mongod' in terminal)
  OR
  3. Use MongoDB Atlas cloud connection:
     Set MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/spendsmart" in backend/.env
----------------------------------------------------------------------
    `);
    // Don't kill process if in test mode or if caller handles it
    if (process.env.NODE_ENV !== 'test') {
      // In development server, keep process alive so health check reports DB disconnected
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
