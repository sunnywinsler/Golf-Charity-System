import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  draw_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match_type: { type: String, enum: ['5-match', '4-match', '3-match'], required: true },
  prize_amount: { type: Number, required: true },
  proof_image_url: { type: String },
  status: { type: String, enum: ['pending_proof', 'pending_review', 'approved', 'paid', 'rejected'], default: 'pending_proof' }
}, { timestamps: true });

export default mongoose.model('Winner', winnerSchema);
