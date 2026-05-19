const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

exports.stats = async (req, res) => {
  const [properties, enquiries, activeListings, pipeline] = await Promise.all([
    Property.countDocuments(),
    Enquiry.countDocuments(),
    Property.countDocuments({ active: true }),
    Property.aggregate([{ $match: { active: true } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
  ]);

  res.json({
    stats: {
      properties,
      enquiries,
      activeListings,
      pipelineValue: pipeline[0]?.total || 0,
    },
  });
};
