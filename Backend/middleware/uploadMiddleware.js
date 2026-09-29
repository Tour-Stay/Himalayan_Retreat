const multer = require('multer');

// Use MEMORY storage — files stay in RAM as buffers
// They are uploaded directly to Cloudinary, NEVER saved locally
const storage = multer.memoryStorage();

// File filter: Only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB per image
  },
});

module.exports = upload;
