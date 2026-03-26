import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow development bypass
      if (process.env.ADMIN_BYPASS === 'true') {
        req.user = { id: 'bypass-id', role: 'admin', full_name: 'Bypass Admin' };
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Check if it is a bypass token
    if (process.env.ADMIN_BYPASS === 'true' && token === 'bypass-token') {
      req.user = { id: 'bypass-id', role: 'admin', full_name: 'Bypass Admin' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
