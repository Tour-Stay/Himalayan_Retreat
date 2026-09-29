const cloudinary = require('cloudinary').v2;

// Cloudinary auto-configures from CLOUDINARY_URL in .env
// No manual config needed!

// Helper function: Upload a buffer (from multer memory) directly to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // e.g. 'hotel-rooms' or 'tour-packages'
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
