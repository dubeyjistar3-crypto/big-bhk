const express = require('express');
const { getPage, getPages, updatePage } = require('../controllers/pageController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getPages);
router.get('/:slug', getPage);
router.put('/:slug', protect, updatePage);

module.exports = router;
