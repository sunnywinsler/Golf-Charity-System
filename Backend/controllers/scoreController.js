import mongoose from 'mongoose';
import Score from '../models/Score.js';

export const addScore = async (req, res) => {
  try {
    const { value } = req.body;
    const userId = req.user._id;

    if (!value || value < 1 || value > 45) {
      return res.status(400).json({ message: "Score must be between 1 and 45" });
    }

    // Handle ADMIN_BYPASS without database
    if (process.env.ADMIN_BYPASS === 'true' && mongoose.connection.readyState !== 1) {
      return res.json([{ 
        value, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
      }]);
    }

    // Insert new score
    await Score.create({ user_id: userId, value, played_at: new Date() });

    // Enforce 5 scores max
    const scores = await Score.find({ user_id: userId }).sort({ played_at: -1 });
    
    if (scores.length > 5) {
      const excessScores = scores.slice(5);
      const excessIds = excessScores.map(s => s._id);
      await Score.deleteMany({ _id: { $in: excessIds } });
    }

    const updatedScores = await Score.find({ user_id: userId })
      .sort({ played_at: -1 })
      .limit(5);

    const finalScores = updatedScores.map(s => ({
      value: s.value,
      date: new Date(s.played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    res.json(finalScores);
  } catch (error) {
    console.error('addScore Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getScores = async (req, res) => {
  try {
    const userId = req.user._id;

    // Handle ADMIN_BYPASS without database
    if (process.env.ADMIN_BYPASS === 'true' && mongoose.connection.readyState !== 1) {
      return res.json([{ 
        value: 10, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
      }]);
    }

    const scores = await Score.find({ user_id: userId })
      .sort({ played_at: -1 })
      .limit(5);

    const formattedScores = scores.map(s => ({
      value: s.value,
      date: new Date(s.played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    res.json(formattedScores);
  } catch (error) {
    console.error('getScores Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};