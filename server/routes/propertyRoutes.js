const express = require('express');
const {
  createProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updateProperty,
} = require('../controllers/propertyController');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProperties);
router.get('/:slug', getProperty);
const propertyUploads = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 12 },
]);

router.post('/', protect, propertyUploads, createProperty);
router.put('/:id', protect, propertyUploads, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
