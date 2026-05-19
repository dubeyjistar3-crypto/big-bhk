const Property = require('../models/Property');
const slugify = require('../utils/slugify');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePropertyBody(body, files = {}) {
  const heroUpload = files.heroImage?.[0] ? `/uploads/${files.heroImage[0].filename}` : null;
  const galleryUploads = (files.galleryImages || []).map((file) => `/uploads/${file.filename}`);
  const {
    _id,
    __v,
    slug,
    heroImage,
    images,
    active,
    createdAt,
    updatedAt,
    ...editableFields
  } = body;
  const amenities = typeof body.amenities === 'string'
    ? body.amenities.split(',').map((item) => item.trim()).filter(Boolean)
    : body.amenities || [];

  const payload = {
    ...editableFields,
    price: Number(body.price),
    bedrooms: Number(body.bedrooms),
    bathrooms: Number(body.bathrooms),
    area: Number(body.area),
    featured: body.featured === 'true' || body.featured === true,
    amenities,
  };

  if (heroUpload) {
    payload.heroImage = heroUpload;
  }

  if (galleryUploads.length) {
    payload.images = galleryUploads;
    if (!payload.heroImage) payload.heroImage = galleryUploads[0];
  }

  return payload;
}

exports.getProperties = async (req, res) => {
  const { city, type, status, featured, search, minPrice, maxPrice } = req.query;
  const query = { active: true };
  if (city) query.city = city;
  if (type) query.type = type;
  if (status) query.status = status;
  if (featured) query.featured = featured === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    query.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { city: searchRegex },
    ];
  }

  const properties = await Property.find(query).sort({ featured: -1, createdAt: -1 });
  res.json({ properties });
};

exports.getProperty = async (req, res) => {
  const property = await Property.findOne({ slug: req.params.slug, active: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property });
};

exports.createProperty = async (req, res) => {
  const payload = normalizePropertyBody(req.body, req.files);
  payload.slug = slugify(payload.title);
  const exists = await Property.findOne({ slug: payload.slug });
  if (exists) payload.slug = `${payload.slug}-${Date.now()}`;
  const property = await Property.create(payload);
  res.status(201).json({ property });
};

exports.updateProperty = async (req, res) => {
  const payload = normalizePropertyBody(req.body, req.files);
  if (payload.title) payload.slug = slugify(payload.title);
  const property = await Property.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property });
};

exports.deleteProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ message: 'Property deleted' });
};
