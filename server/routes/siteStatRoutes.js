const express = require('express');
const { getStats, updateStats } = require('../controllers/siteStatController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', getStats);
router.put('/', protect, updateStats);

module.exports = router;
