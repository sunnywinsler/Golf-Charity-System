import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  stripe_customer_id: { type: String },
  subscription_status: { type: String, enum: ['active', 'inactive', 'past_due', 'canceled'], default: 'inactive' },
  subscription_tier: { type: String, enum: ['monthly', 'yearly'] },
  selected_charity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charity_contribution_pct: { type: Number, default: 10.0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
