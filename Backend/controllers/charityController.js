import Charity from '../models/Charity.js';
import User from '../models/User.js';

export const setCharity = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Charity name required" });
    }

    // Find charity ID by name matching using regex for ilike equivalent
    const charity = await Charity.findOne({ name: { $regex: new RegExp(name, 'i') } });

    if (!charity) {
      return res.status(404).json({ message: "Charity not found in database" });
    }

    await User.findByIdAndUpdate(userId, { selected_charity_id: charity._id });

    res.json({ charity: charity.name });
  } catch (error) {
    console.error('setCharity Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCharity = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('selected_charity_id');

    res.json({ charity: user.selected_charity_id?.name || null });
  } catch (error) {
    console.error('getCharity Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};