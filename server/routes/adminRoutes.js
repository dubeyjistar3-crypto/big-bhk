const express = require('express');
const { stats } = require('../controllers/adminController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, stats);

module.exports = router;
