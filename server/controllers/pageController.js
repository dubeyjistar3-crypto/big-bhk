const PageContent = require('../models/PageContent');

exports.getPage = async (req, res) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    return res.json({ page });
  } catch (error) {
    return res.status(503).json({ message: 'Page content is temporarily unavailable. Please try again.' });
  }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await PageContent.find({ slug: { $in: ['about', 'contact'] } }).sort({ slug: 1 });
    return res.json({ pages });
  } catch (error) {
    return res.status(503).json({ message: 'Page content is temporarily unavailable. Please try again.' });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, slug, ...values } = req.body;
    const page = await PageContent.findOneAndUpdate(
      { slug: req.params.slug },
      { ...values, slug: req.params.slug },
      { new: true, runValidators: true, upsert: true },
    );

    return res.json({ page });
  } catch (error) {
    return res.status(503).json({ message: 'Page content could not be saved right now. Please try again.' });
  }
};
