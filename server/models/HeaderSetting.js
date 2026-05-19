const mongoose = require('mongoose');

const navLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  to: { type: String, required: true },
}, { _id: false });

const headerSettingSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true, index: true },
  brandName: { type: String, required: true },
  logoUrl: String,
  enquiryLabel: { type: String, required: true },
  exploreLabel: { type: String, required: true },
  exploreLink: { type: String, required: true },
  links: [navLinkSchema],
}, { timestamps: true });

module.exports = mongoose.model('HeaderSetting', headerSettingSchema);
