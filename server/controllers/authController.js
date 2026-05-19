const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

function signToken(admin) {
  return jwt.sign({ id: admin._id || admin.id }, process.env.JWT_SECRET || 'change-this-secret', { expiresIn: '7d' });
}

function envAdmin() {
  return {
    id: 'env-admin',
    name: process.env.ADMIN_NAME || 'BIG BHK Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@bigbhk.com').trim().toLowerCase(),
  };
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const envEmail = (process.env.ADMIN_EMAIL || 'admin@bigbhk.com').trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const isEnvAdminLogin = normalizedEmail === envEmail && password === envPassword;

  if (mongoose.connection.readyState !== 1) {
    if (!isEnvAdminLogin) return res.status(401).json({ message: 'Invalid credentials' });
    const admin = envAdmin();
    return res.json({ token: signToken(admin), admin });
  }

  let admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin && isEnvAdminLogin) {
    admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'BIG BHK Admin',
      email: envEmail,
      password: envPassword,
    });
  }

  if (admin && isEnvAdminLogin && !(await admin.matchPassword(password))) {
    admin.password = envPassword;
    await admin.save();
  }

  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token: signToken(admin), admin: { id: admin._id, name: admin.name, email: admin.email } });
};

exports.me = async (req, res) => {
  res.json({ admin: req.admin });
};
