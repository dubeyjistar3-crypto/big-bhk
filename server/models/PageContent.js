const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  icon: { type: String, default: 'Gem' },
  title: { type: String, required: true },
  text: { type: String, required: true },
}, { _id: false });

const pageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  seoTitle: { type: String, required: true },
  seoDescription: { type: String, required: true },
  eyebrow: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroText: { type: String, required: true },
  sectionEyebrow: String,
  sectionTitle: String,
  sectionText: String,
  features: [featureSchema],
  contactName: String,
  phone: String,
  email: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
