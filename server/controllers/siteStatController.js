const SiteStat = require('../models/SiteStat');

exports.getStats = async (req, res) => {
  const stats = await SiteStat.find().sort({ order: 1 });
  res.json({ stats });
};

exports.updateStats = async (req, res) => {
  const stats = Array.isArray(req.body.stats) ? req.body.stats : [];
  const saved = await Promise.all(stats.map((stat, index) => SiteStat.findOneAndUpdate(
    { key: stat.key },
    {
      key: stat.key,
      value: Number(stat.value || 0),
      suffix: stat.suffix || '',
      label: stat.label || stat.key,
      order: index,
    },
    { new: true, runValidators: true, upsert: true },
  )));

  res.json({ stats: saved.sort((a, b) => a.order - b.order) });
};
