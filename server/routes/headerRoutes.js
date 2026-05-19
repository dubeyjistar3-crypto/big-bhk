const express = require('express');
const { getHeader, updateHeader } = require('../controllers/headerController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', getHeader);
router.put('/', protect, updateHeader);

module.exports = router;
