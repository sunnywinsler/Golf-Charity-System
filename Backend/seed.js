import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Charity from './models/Charity.js';

dotenv.config();

const charities = [
  {
    name: "Kids Global",
    description: "Providing education and healthcare for children in developing nations.",
    image_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400",
    is_featured: true,
    total_raised: 12500
  },
  {
    name: "Cancer Research Center",
    description: "Funding breakthrough treatments and supporting patients worldwide.",
    image_url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=400",
    is_featured: true,
    total_raised: 8400
  },
  {
    name: "Clean Water Initiative",
    description: "Building sustainable water systems for communities in need.",
    image_url: "https://images.unsplash.com/photo-1593111774240-d529126d4036?auto=format&fit=crop&q=80&w=400",
    is_featured: false,
    total_raised: 21000
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digitalheros');
    console.log('Connected to MongoDB for seeding...');

    await Charity.deleteMany({});
    await Charity.insertMany(charities);

    console.log('Database Seeded Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
