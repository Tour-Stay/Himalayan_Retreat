const { uploadToCloudinary } = require('../config/cloudinary');

async function test() {
  try {
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    const result = await uploadToCloudinary(buffer, 'travel-reviews');
    console.log('Success!', result);
  } catch (err) {
    console.error('Error details:', err);
  }
}

test();
