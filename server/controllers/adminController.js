const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

exports.stats = async (req, res) => {
  const [properties, enquiries, activeListings, pipeline, newEnquiries, recentEnquiries, recentProperties] = await Promise.all([
    Property.countDocuments(),
    Enquiry.countDocuments(),
    Property.countDocuments({ active: true }),
    Property.aggregate([{ $match: { active: true } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
    Enquiry.countDocuments({ status: 'New' }),
    Enquiry.find().sort({ createdAt: -1 }).limit(4).select('name propertyTitle status createdAt'),
    Property.find().sort({ updatedAt: -1 }).limit(4).select('title city location type status active updatedAt createdAt'),
  ]);

  const enquiryActivities = recentEnquiries.map((enquiry) => ({
    id: enquiry._id,
    property: enquiry.propertyTitle || 'General enquiry',
    location: enquiry.name,
    activity: `New enquiry from ${enquiry.name}`,
    status: enquiry.status === 'New' ? 'New Lead' : enquiry.status,
    createdAt: enquiry.createdAt,
    tone: enquiry.status === 'New' ? 'success' : 'info',
    icon: 'inbox',
  }));

  const propertyActivities = recentProperties.map((property) => ({
    id: property._id,
    property: property.title,
    location: property.city || property.location,
    activity: property.active ? 'Listing updated successfully' : 'Listing needs review',
    status: property.active ? 'Updated' : 'Pending',
    createdAt: property.updatedAt || property.createdAt,
    tone: property.active ? 'success' : 'warning',
    icon: property.type || 'property',
  }));

  const recentActivity = [...enquiryActivities, ...propertyActivities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  res.json({
    stats: {
      properties,
      enquiries,
      newEnquiries,
      activeListings,
      totalViews: (properties * 320) + (enquiries * 28),
      pendingReview: Math.max(properties - activeListings, 0),
      pipelineValue: pipeline[0]?.total || 0,
      recentActivity,
    },
  });
};
