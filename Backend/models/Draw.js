import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema({
  month_year: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'simulated', 'published'], default: 'published' },
  logic_used: { type: String, enum: ['random', 'algorithmic'], required: true },
  total_pool_amount: { type: Number, required: true },
  jackpot_rollover_amount: { type: Number, default: 0 },
  winning_sequence: [{ type: Number }]
}, { timestamps: true });

export default mongoose.model('Draw', drawSchema);
