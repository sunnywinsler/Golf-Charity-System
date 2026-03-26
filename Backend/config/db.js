import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hero';
    
    // Debugging: Log the URI with masked password to see what Render sees
    const maskedURI = mongoURI.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB: ${maskedURI}`);

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully 🚀');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    if (process.env.ADMIN_BYPASS === 'true') {
      console.log('⚠️ Running in ADMIN_BYPASS mode without database 🛡️');
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
