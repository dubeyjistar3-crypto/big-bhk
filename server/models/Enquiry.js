const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: String,
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyTitle: String,
  status: { type: String, enum: ['New', 'Contacted', 'Site Visit', 'Closed'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
