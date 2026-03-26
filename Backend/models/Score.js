import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  played_at: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Score', scoreSchema);
