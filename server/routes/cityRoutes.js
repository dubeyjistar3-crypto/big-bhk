const express = require('express');
const { getCities, updateCity } = require('../controllers/cityController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', getCities);
router.put('/:city', protect, updateCity);

module.exports = router;
