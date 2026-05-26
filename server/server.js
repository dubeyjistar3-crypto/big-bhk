require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const seed = require('./seed');

const app = express();
const port = process.env.API_PORT || process.env.PORT || 5000;
const basePath = process.env.BASE_PATH || '/bigbhk';
const mongoStatus = { lastError: null, seeded: false };
const mongoReadyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res) => res.status(404).json({ message: 'Upload not found' }));

const mountRoutes = (prefix = '') => {
  app.get(`${prefix}/api/health`, (req, res) => res.json({
    ok: true,
    service: 'bigbhk-api',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoReadyState: mongoReadyStates[mongoose.connection.readyState] || 'unknown',
    mongoUriConfigured: Boolean(process.env.MONGO_URI),
    mongoLastError: mongoStatus.lastError,
  }));
  app.use(`${prefix}/api/auth`, require('./routes/authRoutes'));
  app.use(`${prefix}/api/properties`, require('./routes/propertyRoutes'));
  app.use(`${prefix}/api/enquiries`, require('./routes/enquiryRoutes'));
  app.use(`${prefix}/api/pages`, require('./routes/pageRoutes'));
  app.use(`${prefix}/api/cities`, require('./routes/cityRoutes'));
  app.use(`${prefix}/api/site-stats`, require('./routes/siteStatRoutes'));
  app.use(`${prefix}/api/header`, require('./routes/headerRoutes'));
  app.use(`${prefix}/api/uploads`, require('./routes/uploadRoutes'));
  app.use(`${prefix}/api/admin`, require('./routes/adminRoutes'));
};

mountRoutes('');
if (basePath) mountRoutes(basePath);

app.use(basePath, express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function connectMongoWithRetry() {
  try {
    await connectDB();
    mongoStatus.lastError = null;
    if (!mongoStatus.seeded) {
      await seed();
      mongoStatus.seeded = true;
    }
  } catch (error) {
    mongoStatus.lastError = error.message;
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn('Retrying MongoDB connection in 30 seconds.');
    setTimeout(connectMongoWithRetry, 30000);
  }
}

app.listen(port, () => {
  console.log(`API running on port ${port}`);
  connectMongoWithRetry();
});
