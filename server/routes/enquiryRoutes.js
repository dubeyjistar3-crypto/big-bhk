const express = require('express');
const { createEnquiry, getEnquiries, updateEnquiry } = require('../controllers/enquiryController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protect, getEnquiries);
router.patch('/:id', protect, updateEnquiry);

module.exports = router;
