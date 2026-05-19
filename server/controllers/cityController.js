const CityContent = require('../models/CityContent');

exports.getCities = async (req, res) => {
  const cities = await CityContent.find().sort({ city: 1 });
  res.json({ cities });
};

exports.updateCity = async (req, res) => {
  const { _id, __v, createdAt, updatedAt, city, ...values } = req.body;
  const content = await CityContent.findOneAndUpdate(
    { city: req.params.city },
    { ...values, city: req.params.city },
    { new: true, runValidators: true, upsert: true },
  );
  res.json({ city: content });
};
