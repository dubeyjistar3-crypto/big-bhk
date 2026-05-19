const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  location: { type: String, required: true },
  city: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['Apartment', 'Villa', 'Penthouse', 'Plot'] },
  status: { type: String, required: true, enum: ['New Launch', 'Under Construction', 'Ready To Move'] },
  price: { type: Number, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, required: true },
  heroImage: String,
  images: [String],
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  amenities: [String],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

propertySchema.index({ title: 'text', location: 'text', city: 'text' });

module.exports = mongoose.model('Property', propertySchema);
