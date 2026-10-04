const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TravelReview = require('../models/TravelReview');

// Helper to convert local image to base64 data URI
const getBase64Image = (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../Frontend/shared/assets/images', fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(fileName).toLowerCase().replace('.', '');
      const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
      const fileBuffer = fs.readFileSync(filePath);
      return `data:${mime};base64,${fileBuffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn(`Could not load image ${fileName}:`, err.message);
  }
  return '';
};

const reviewsToSeed = [
  // ====================
  // HOTEL REVIEWS
  // ====================
  {
    name: 'Sunita & Arvind Sharma',
    email: 'sharma.sunita.delhi@gmail.com',
    location: 'New Delhi • Devotees of Kainchi Dham',
    category: 'hotel',
    stayedIn: 'Nanda Devi Snow View Suite',
    tripType: 'Spiritual Retreat & Temple Yatra',
    rating: 5,
    review:
      'Waking up to snow peaks shining in the morning sun with a warm heated bed was pure joy. The room heater, electric bed warmers, and hot ginger tea kept us so comfortable. The quiet peace here in Kasar Devi is something we will never forget.',
    photoFiles: ['suite-nanda-devi-balcony.jpg', 'Trishul-&-Nanda-Devi.jpg'],
    isApproved: true,
  },
  {
    name: 'David & Claire M.',
    email: 'claire.david.m@outlook.com',
    location: 'Melbourne, Australia • Peaceful Holiday',
    category: 'hotel',
    stayedIn: "Crank's Ridge Attic Glass Suite",
    tripType: 'Stargazing & Himalayan Silence',
    rating: 5,
    review:
      'The glass ceiling let us watch thousands of stars right from our warm bed. Kasar Devi has a uniquely calming geomagnetic vibration. The home-cooked vegetarian food and hot ginger lemon tea were fresh, light, and delicious.',
    photoFiles: ['attic-suite.jpg', 'hotel-night-sky.jpg'],
    isApproved: true,
  },
  {
    name: 'Raghavendra K. & Family',
    email: 'raghav.k.blr@yahoo.co.in',
    location: 'Bengaluru • Family Yatra',
    category: 'hotel',
    stayedIn: 'Cedar Family Chalet',
    tripType: 'Family Pilgrimage to Jageshwar & Kasar',
    rating: 5,
    review:
      'We visited Kasar Devi and Jageshwar with my elderly parents. The room heater, electric bed warmers, 24-hour hot water, and direct car parking made everything so comfortable for them. The staff treated us like family.',
    photoFiles: ['chalet-family-living.jpg', 'dining-satvik-thali.jpg'],
    isApproved: true,
  },

  // ====================
  // TRAVEL / CAB REVIEWS
  // ====================
  {
    name: 'Harish Rawat & Family',
    email: 'harish.rawat78@rediffmail.com',
    location: 'Ghaziabad, NCR',
    category: 'travel',
    tripType: 'Kainchi Dham Ashram Darshan (Innova Crysta)',
    rating: 5,
    review:
      'We booked the Innova for our family trip to Kainchi Dham. Our driver Ramesh ji was very polite and knew the best time for the evening aarti so we did not face rush. The cab was spotless and warm on cold mountain mornings. Truly trusted service!',
    photoFiles: ['innova-crysta.jpg', 'kainchi-dham.jpg'],
    isApproved: true,
  },
  {
    name: 'Dr. Anand Verma',
    email: 'dr.anand.verma@kgmu.edu.in',
    location: 'Lucknow',
    category: 'travel',
    tripType: 'Jageshwar Dham & Kasar Sunrise Tour (Swift Dzire Sedan)',
    rating: 5,
    review:
      'Best cab service in Almora. Fixed transparent price without any bargaining. The driver drove very gently on hill turns, which was great since my mother gets motion sickness. Highly recommend for any temple tour in Uttarakhand.',
    photoFiles: ['mountain-sedan.jpg', 'Jageshwar-Mahamrityunjaya-Dham.jpg'],
    isApproved: true,
  },
  {
    name: 'Pooja Agarwal & Friends',
    email: 'pooja.agarwal.blr@gmail.com',
    location: 'Bengaluru',
    category: 'travel',
    tripType: '3-Day Kumaon Circuit (Force Urbania Minibus)',
    rating: 5,
    review:
      'We traveled in a group of 10 people in the luxury Urbania. The pushback seats and wide windows gave us incredible views of Trishul and Nanda Devi snow peaks. Driver was punctual and very helpful with luggage.',
    photoFiles: ['luxury-minibus.jpg', 'kausani-tea-peaks.jpg'],
    isApproved: true,
  },
];

const seedReviews = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    for (const rData of reviewsToSeed) {
      const existing = await TravelReview.findOne({ email: rData.email });
      const photos = rData.photoFiles.map((f) => getBase64Image(f)).filter(Boolean);

      if (!existing) {
        const doc = new TravelReview({
          name: rData.name,
          email: rData.email,
          location: rData.location,
          category: rData.category,
          stayedIn: rData.stayedIn || '',
          tripType: rData.tripType || '',
          rating: rData.rating,
          review: rData.review,
          photos: photos,
          isApproved: rData.isApproved,
        });
        await doc.save();
        console.log(` Created [${rData.category.toUpperCase()}] review from: "${rData.name}" (${photos.length} photos)`);
      } else {
        existing.category = rData.category;
        existing.stayedIn = rData.stayedIn || '';
        existing.tripType = rData.tripType || '';
        existing.photos = photos;
        existing.isApproved = true;
        await existing.save();
        console.log(` Updated existing review: "${rData.name}"`);
      }
    }

    const totalApproved = await TravelReview.countDocuments({ isApproved: true });
    const hotelCount = await TravelReview.countDocuments({ category: 'hotel' });
    const travelCount = await TravelReview.countDocuments({ category: 'travel' });

    console.log('\n==========================================');
    console.log(' REVIEWS SEEDING COMPLETED!');
    console.log(` • Total Approved Reviews in DB: ${totalApproved}`);
    console.log(` • Hotel Reviews: ${hotelCount}`);
    console.log(` • Travel Reviews: ${travelCount}`);
    console.log('==========================================\n');
  } catch (err) {
    console.error('Error seeding reviews:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedReviews();
