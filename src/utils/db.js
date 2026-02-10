/**
 * Database Connection Utility
 * Handles MongoDB connection using Mongoose
 * Used by backend server to establish database connectivity
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 * Exits process if connection fails (critical error)
 * 
 * Environment Variables Required:
 * - MONGO_URI: MongoDB connection string
 * 
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using connection string from env
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Log error details for debugging
    console.error('❌ MongoDB connection failed:', error.message);

    // Exit process with failure code (1)
    // This is critical - app cannot function without database
    process.exit(1);
  }
};

module.exports = connectDB;
