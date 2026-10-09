const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

// Explicitly initialize Cloudinary SDK configuration
if (process.env.CLOUDINARY_URL) {
  try {
    const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      cloudinary.config({
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3],
        secure: true,
      });
    } else {
      cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
        secure: true,
      });
    }
  } catch (err) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
      secure: true,
    });
  }
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Helper function: Upload a buffer (from multer memory) directly to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'travel-reviews') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      return reject(new Error('Invalid file buffer passed to uploadToCloudinary'));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // e.g. 'travel-reviews', 'hotel-rooms', 'tour-packages'
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.warn(`[Cloudinary] Upload failed (${error.message || error}). Falling back to resilient data URI.`);
          // Automatic resilient fallback to Base64 Data URI if Cloudinary credentials or network fail
          const base64Data = fileBuffer.toString('base64');
          return resolve({
            secure_url: `data:image/jpeg;base64,${base64Data}`,
            public_id: `fallback-${Date.now()}`,
            format: 'jpeg',
            fallback: true,
          });
        }
        resolve(result);
      }
    );

    stream.on('error', (err) => {
      console.warn(`[Cloudinary] Stream error (${err.message || err}). Falling back to resilient data URI.`);
      const base64Data = fileBuffer.toString('base64');
      resolve({
        secure_url: `data:image/jpeg;base64,${base64Data}`,
        public_id: `fallback-${Date.now()}`,
        format: 'jpeg',
        fallback: true,
      });
    });

    stream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
