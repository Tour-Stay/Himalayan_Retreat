const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Room = require('../models/Room');
const TourPackage = require('../models/TourPackage');
const SiteSettings = require('../models/SiteSettings');
const { uploadToCloudinary } = require('../config/cloudinary');

// Helper to upload local image to Cloudinary
const uploadLocalImageToCloudinary = async (fileName, folder) => {
  try {
    const filePath = path.join(__dirname, '../../Frontend/shared/assets/images', fileName);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const result = await uploadToCloudinary(fileBuffer, folder);
      return result.secure_url;
    }
  } catch (err) {
    console.warn(`Could not upload image ${fileName}:`, err.message);
  }
  return '';
};

const seed = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // ==========================================
    // 1. SEED HOTEL ROOMS
    // ==========================================
    const roomsToSeed = [
      {
        name: 'Nanda Devi Snow View Heated Suite',
        description:
          'Wake up to clear 180° views of snow-capped Himalayan peaks. Features warm pine wood interiors, a private balcony facing Trishul and Nanda Devi, room heater, and electric bed warmers.',
        pricePerNight: 8500,
        capacity: { adults: 2, children: 1 },
        view: '180° Snow Peak View (Trishul & Nanda Devi)',
        amenities: [
          'Room Heater',
          'Electric Bed Warmer',
          'Private Snow-View Balcony',
          '24-Hour Hot Water',
          'Free Fast Wi-Fi',
          'Tea & Coffee Kettle',
          'Clean Mountain Water',
          'Smart TV',
        ],
        imageFiles: [
          'suite-nanda-devi-bed.jpg',
          'suite-nanda-devi-balcony.jpg',
          'suite-nanda-devi-balcony2.jpg',
          'snow-view-suite.jpg',
        ],
        isAvailable: true,
      },
      {
        name: 'Cedar Family Chalet',
        description:
          'A large two-bedroom mountain sanctuary surrounded by deodars and pine trees. Perfect for families, with heated wooden floors, comfortable beds, warm room heaters, and garden views.',
        pricePerNight: 12500,
        capacity: { adults: 4, children: 2 },
        view: 'Pine Valley & Sunrise Garden',
        amenities: [
          'Warm Room Heaters',
          'Private Garden Deck',
          'Electric Bed Warmers',
          'Warm Wooden Flooring',
          '2 Private Bathrooms',
          'Free Fast Wi-Fi',
          '24-Hour Hot Water',
          'Evening Bonfire Access',
        ],
        imageFiles: [
          'chalet-family-living.jpg',
          'chalet-family-bedroom.jpg',
          'chalet-suite.jpg',
        ],
        isAvailable: true,
      },
      {
        name: "Crank's Ridge Attic Glass Suite",
        description:
          'Cozy wooden attic room with big glass ceiling windows to watch the stars at night. Loved by couples and peaceful travelers looking for quiet mountain days.',
        pricePerNight: 7200,
        capacity: { adults: 2, children: 0 },
        view: 'Glass Ceiling Stargazing & Valley View',
        amenities: [
          'Glass Ceiling Stargazing',
          'Quiet Room Heater',
          'Electric Bed Warmer',
          'Work Desk & Fast Wi-Fi',
          'Tea & Coffee Kettle',
          '24-Hour Hot Water',
          'Peaceful & Quiet',
        ],
        imageFiles: [
          'attic-suite.jpg',
          'suite-attic-workspace.jpg',
          'corridor-at-night.jpg',
        ],
        isAvailable: true,
      },
      {
        name: 'Trishul Crest Luxury Suite',
        description:
          'Our largest luxury suite with unbroken views of Trishul and Nanda Devi peaks. Includes a big private wooden terrace, cozy seating area, and attentive room service.',
        pricePerNight: 14500,
        capacity: { adults: 4, children: 2 },
        view: '180° Snow Mountain Range',
        amenities: [
          'Big Private Snow Terrace',
          'Room Heaters in Every Room',
          'Electric Bed Warmers',
          'Pure Veg Room Service',
          '24-Hour Hot Water',
          'Free Fast Wi-Fi',
          'Direct Parking Access',
        ],
        imageFiles: [
          'suite-trishul-terrace.jpg',
          'suite-luxury-bathroom.jpg',
          'hotel-exterior-day.jpg',
          'hotel-in-snow.jpg',
        ],
        isAvailable: true,
      },
    ];

    console.log('\n--- Checking Rooms ---');
    for (const rData of roomsToSeed) {
      const existing = await Room.findOne({ name: rData.name });
      if (!existing) {
        const imageURLs = [];
        for (const f of rData.imageFiles) {
          const url = await uploadLocalImageToCloudinary(f, 'hotel-rooms');
          if (url) imageURLs.push(url);
        }

        const newRoom = new Room({
          name: rData.name,
          description: rData.description,
          pricePerNight: rData.pricePerNight,
          capacity: rData.capacity,
          view: rData.view,
          amenities: rData.amenities,
          imageURLs: imageURLs,
          isAvailable: rData.isAvailable,
        });
        await newRoom.save();
        console.log(` Created suite: "${rData.name}" (Rs.${rData.pricePerNight})`);
      } else {
        console.log(` Suite "${rData.name}" already exists in DB.`);
      }
    }

    // ==========================================
    // 2. SEED TOUR PACKAGES
    // ==========================================
    console.log('\n--- Checking Tour Packages ---');
    const toursToSeed = [
      {
        title: 'Divine Kainchi Dham & Kasar Devi Pilgrimage',
        destination: "Kainchi Dham Ashram & Crank's Ridge",
        duration: { days: 3, nights: 2 },
        pricePerPerson: 6999,
        inclusions: [
          'Dedicated Chauffeur & Mountain Vehicle',
          'Heated Chalet Suite Accommodation',
          'VIP Darshan Assistance at Kainchi Dham',
          'Morning & Evening Satvik Meals',
          'Sunrise Meditation & Temple Excursions',
          'All Fuel, Tolls & Parking Charges',
        ],
        itinerary: [
          {
            day: 1,
            description:
              'Kathgodam Station pickup. Scenic mountain drive to Kasar Devi. Check-in, evening aarti walk at Kasar Devi Temple and meditation at Vivekananda Rock.',
          },
          {
            day: 2,
            description:
              'Early morning pilgrimage to Sri Neem Karoli Baba Ashram Kainchi Dham. Darshan, prasad, and quiet contemplative time. Return to Kasar for sunset dinner.',
          },
          {
            day: 3,
            description:
              'Morning breakfast with 180° Himalayan view. Almora heritage bazaar tour for authentic Bal Mithai and drop back to Kathgodam Station.',
          },
        ],
        imageFiles: ['kainchi-dham.jpg', 'kasar-devi-temple.jpg'],
      },
      {
        title: 'Sacred Jageshwar Mahamrityunjaya & Deodar Circuit',
        destination: 'Jageshwar Dham & Kumaon Sacred Forests',
        duration: { days: 2, nights: 1 },
        pricePerPerson: 4999,
        inclusions: [
          'Chauffeured Mountain Sedan / SUV',
          'Boutique Mountain Stay with Breakfast',
          'Priest Darshan Guide at 124 Jyotirlinga Complex',
          'Visit to Chitai Golu Devta (God of Justice)',
          'Evening Bonfire with Mountain Herbal Tea',
        ],
        itinerary: [
          {
            day: 1,
            description:
              'Morning pickup and drive through ancient deodar cedar forests to the 8th-century Jageshwar Mahamrityunjaya complex. Evening return to Kasar Devi for starlit dinner.',
          },
          {
            day: 2,
            description:
              'Sunrise Himalayan views from Crank Ridge, visit to Chitai Golu Devta temple with thousands of bells, and drop to Almora/Kathgodam.',
          },
        ],
        imageFiles: ['Jageshwar-Mahamrityunjaya-Dham.jpg', 'kasar-temple-trail.jpg'],
      },
      {
        title: 'Grand Kumaon Heights & Kausani 300km Snow Panorama',
        destination: 'Kasar Devi, Binsar & Kausani',
        duration: { days: 4, nights: 3 },
        pricePerPerson: 11499,
        inclusions: [
          'Private Toyota Innova Crysta throughout',
          '3 Nights Luxury Boutique Accommodations',
          'Satvik Breakfast & Dinner Included Daily',
          'Binsar Sanctuary Forest Entry Permits',
          'Visit to Kausani Tea Gardens & Baijnath Temples',
        ],
        itinerary: [
          {
            day: 1,
            description:
              'Kathgodam to Kasar Devi scenic climb. Warm welcoming herbal tea, sunset over Trishul peak, check-in to heated mountain chalet.',
          },
          {
            day: 2,
            description:
              'Day expedition to Binsar Wildlife Sanctuary Zero Point for unobstructed 300-km Himalayan panorama from Kedarnath to Nanda Kot.',
          },
          {
            day: 3,
            description:
              'Drive to Kausani (the Switzerland of India), tour of high-altitude tea gardens, 12th-century stone carvings at Baijnath.',
          },
          {
            day: 4,
            description:
              'Final morning photography session, authentic Kumaoni breakfast, and return drop to Kathgodam Railway Station.',
          },
        ],
        imageFiles: ['kausani-tea-peaks.jpg', 'Trishul-&-Nanda-Devi.jpg'],
      },
    ];

    for (const tData of toursToSeed) {
      const existing = await TourPackage.findOne({ title: tData.title });
      if (!existing) {
        const imageURLs = [];
        for (const f of tData.imageFiles) {
          const url = await uploadLocalImageToCloudinary(f, 'tour-packages');
          if (url) imageURLs.push(url);
        }

        const newTour = new TourPackage({
          title: tData.title,
          destination: tData.destination,
          duration: tData.duration,
          pricePerPerson: tData.pricePerPerson,
          inclusions: tData.inclusions,
          itinerary: tData.itinerary,
          imageURLs: imageURLs,
        });
        await newTour.save();
        console.log(` Created tour package: "${tData.title}" (Rs.${tData.pricePerPerson})`);
      } else {
        console.log(` Tour package "${tData.title}" already exists in DB.`);
      }
    }

    // ==========================================
    // 3. FINAL VERIFICATION
    // ==========================================
    const totalRooms = await Room.countDocuments();
    const totalTours = await TourPackage.countDocuments();
    const totalSettings = await SiteSettings.countDocuments();

    console.log('\n==========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(` • Total Rooms in DB: ${totalRooms}`);
    console.log(` • Total Tour Packages in DB: ${totalTours}`);
    console.log(` • Site Settings in DB: ${totalSettings}`);
    console.log('==========================================\n');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seed();
