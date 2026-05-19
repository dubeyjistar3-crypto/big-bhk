const mongoose = require('mongoose');

const siteStatSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: Number, required: true, default: 0 },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SiteStat', siteStatSchema);
