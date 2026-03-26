import mongoose from 'mongoose';
import User from '../models/User.js';

export const setSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    // Handle ADMIN_BYPASS without database
    if (process.env.ADMIN_BYPASS === 'true' && mongoose.connection.readyState !== 1) {
      return res.json({ subscription: plan });
    }

    const tier = plan.toLowerCase() === 'yearly' ? 'yearly' : 'monthly';

    await User.findByIdAndUpdate(userId, { 
      subscription_tier: tier, 
      subscription_status: 'active' 
    });

    res.json({ subscription: plan });
  } catch (error) {
    console.error('setSubscription Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const userId = req.user._id;

    // Handle ADMIN_BYPASS without database
    if (process.env.ADMIN_BYPASS === 'true' && mongoose.connection.readyState !== 1) {
      return res.json({ subscription: "Monthly", status: "active" });
    }

    const user = await User.findById(userId).select('subscription_tier subscription_status');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uiPlan = user.subscription_tier ? user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1) : null;

    res.json({ subscription: uiPlan, status: user.subscription_status });
  } catch (error) {
    console.error('getSubscription Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};