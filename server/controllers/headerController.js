const HeaderSetting = require('../models/HeaderSetting');

exports.getHeader = async (req, res) => {
  const header = await HeaderSetting.findOne({ key: 'main' });
  res.json({ header });
};

exports.updateHeader = async (req, res) => {
  const { _id, __v, createdAt, updatedAt, key, ...values } = req.body;
  const header = await HeaderSetting.findOneAndUpdate(
    { key: 'main' },
    { ...values, key: 'main' },
    { new: true, runValidators: true, upsert: true },
  );
  res.json({ header });
};
