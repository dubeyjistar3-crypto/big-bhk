const multer = require('multer');

const fileFilter = (req, file, cb) => {
  cb(null, file.mimetype.startsWith('image/'));
};

module.exports = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
