const Enquiry = require('../models/Enquiry');

exports.createEnquiry = async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({ enquiry });
};

exports.getEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).populate('propertyId', 'title slug');
  res.json({ enquiries });
};

exports.updateEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
  res.json({ enquiry });
};
