require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seed = require('../seed');

async function run() {
  try {
    await connectDB();
    await seed();
    console.log('Database seed completed.');
  } catch (error) {
    console.error(`Database seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

run();
