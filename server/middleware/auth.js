const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret');
    if (decoded.id === 'env-admin' && mongoose.connection.readyState !== 1) {
      req.admin = {
        id: 'env-admin',
        name: process.env.ADMIN_NAME || 'BIG BHK Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@bigbhk.com').trim().toLowerCase(),
      };
      return next();
    }

    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Not authorized' });
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized' });
  }
}

module.exports = protect;
