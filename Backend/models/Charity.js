import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image_url: { type: String },
  is_featured: { type: Boolean, default: false },
  total_raised: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Charity', charitySchema);
