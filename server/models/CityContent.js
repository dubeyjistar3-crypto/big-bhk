const mongoose = require('mongoose');

const cityContentSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true, index: true },
  image: { type: String, required: true },
  tagline: String,
}, { timestamps: true });

module.exports = mongoose.model('CityContent', cityContentSchema);
