const mongoose = require('mongoose');

let listenersAttached = false;

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/star-estates';

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  if (!listenersAttached) {
    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB connection error: ${error.message}`);
    });
    listenersAttached = true;
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = connectDB;
