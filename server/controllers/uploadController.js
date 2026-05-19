exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
