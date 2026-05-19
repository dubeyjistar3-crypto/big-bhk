const PageContent = require('../models/PageContent');

exports.getPage = async (req, res) => {
  const page = await PageContent.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json({ page });
};

exports.getPages = async (req, res) => {
  const pages = await PageContent.find({ slug: { $in: ['about', 'contact'] } }).sort({ slug: 1 });
  res.json({ pages });
};

exports.updatePage = async (req, res) => {
  const { _id, createdAt, updatedAt, __v, slug, ...values } = req.body;
  const page = await PageContent.findOneAndUpdate(
    { slug: req.params.slug },
    { ...values, slug: req.params.slug },
    { new: true, runValidators: true, upsert: true },
  );

  res.json({ page });
};
