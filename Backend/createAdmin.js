import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/digitalheros';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected ✅');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@digitalheros.com' });
    if (existing) {
      console.log('⚠️  Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      full_name: 'Admin',
      email: 'admin@digitalheros.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:    admin@digitalheros.com');
    console.log('   Password: Admin@123');
    console.log('   Role:     admin');
    console.log('   ID:      ', admin._id);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
