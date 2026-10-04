const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    // 1. Brand & Contact Information
    company: {
      brandName: { type: String, default: 'The Kasar Himalayan Heights & Expeditions' },
      hotelName: { type: String, default: 'The Kasar Himalayan Heights' },
      travelName: { type: String, default: 'Himalayan Expeditions' },
      tagline: {
        type: String,
        default: 'High-Altitude Luxury Boutique Chalet & Chauffeured Mountain Expeditions',
      },
      elevation: { type: String, default: '6,942 ft' },
      conciergePhone: { type: String, default: '+91 96906 21247' },
      whatsappNumber: { type: String, default: '919690621247' },
      whatsappDisplay: { type: String, default: '+91 96906 21247' },
      email: { type: String, default: 'concierge@kasarhimalayanheights.com' },
      hotelAddress: {
        type: String,
        default: "Crank's Ridge, Kasar Devi, Almora, Uttarakhand, India (6,942 ft)",
      },
      travelHubAddress: {
        type: String,
        default: 'Almora Station Base, Uttarakhand, India',
      },
      instagramUrl: {
        type: String,
        default: 'https://instagram.com/kasarhimalayanheights',
      },
      facebookUrl: {
        type: String,
        default: 'https://facebook.com/kasarhimalayanheights',
      },
      upiId: { type: String, default: 'kasarhimalayan@upi' },
      googleMapsEmbedUrl: { type: String, default: '' },
    },

    // 2. Top Announcement Ribbon & Hero
    announcement: {
      enabled: { type: Boolean, default: true },
      message: {
        type: String,
        default:
          '॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥ Visiting Kainchi Dham or Kasar Devi? Consecrated yatra assistance, heated chalet suites & temple cabs are open for booking.',
      },
      linkText: { type: String, default: 'Yatra Booking ↗' },
      linkHref: { type: String, default: '#enquiry' },
    },

    landingHero: {
      devotionalGreeting: { type: String, default: 'जय श्री बाबा नीम करोली महाराज की' },
      devotionalSubGreeting: { type: String, default: 'Ram Ram • Jai Sri Hanuman' },
      teachingQuote: { type: String, default: 'Love. Serve. Remember.' },
      quoteAttribution: { type: String, default: 'Teachings of Sri Neem Karoli Baba Maharaj' },
      welcomeStatement: {
        type: String,
        default:
          'Kasar Devi and the Kumaon Himalayas have welcomed spiritual seekers, mystics, and travelers for centuries. Surrounded by ancient deodar forests and the silent majesty of snow peaks, we welcome you with deep reverence and quiet hospitality.',
      },
    },

    landingContent: {
      itinerary: [
        {
          num: { type: String, default: '01' },
          tag: { type: String, default: 'Day 1 • Arrival & Kainchi Darshan' },
          title: { type: String, default: 'Kathgodam to Kainchi Dham & Kasar Ridge' },
          items: [{ type: String }],
          note: { type: String, default: '85 km • ~3 hrs scenic mountain drive' },
        },
      ],
      faqs: [
        {
          q: { type: String, default: '' },
          a: { type: String, default: '' },
        },
      ],
    },

    // 3. Cab Fleet & Vehicle Tariffs
    cabFleet: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        model: { type: String, required: true },
        seats: { type: Number, required: true },
        luggage: { type: String, default: '2 Large Bags + 2 Cabin Bags' },
        tag: { type: String, default: 'Best for Couples & Small Families' },
        dailyRate: { type: Number, required: true },
        perKmRate: { type: Number, required: true },
        rateKathgodam: { type: String, default: '₹2,499' },
        rateDelhi: { type: String, default: '₹7,499' },
        rateUnit: { type: String, default: 'per day + fuel / transfers' },
        image: { type: String, default: '' },
        features: [{ type: String }],
        idealFor: { type: String, default: '' },
        description: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      },
    ],

    // 4. Temple & Sightseeing Route Fares
    destinations: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, enum: ['temple', 'transfer', 'hillstation'], default: 'temple' },
        categoryLabel: { type: String, default: 'Neem Karoli Baba Ashram' },
        saffronTag: { type: String, default: '॥ श्री नीब करौरी महाराज धाम ॥' },
        kmFromAlmora: { type: Number, required: true },
        duration: { type: String, default: 'Half Day / Full Day' },
        distanceText: { type: String, default: '45 km from Almora (~1.5 hrs)' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        highlights: [{ type: String }],
        typicalFareSedan: { type: String, default: '₹2,200' },
        typicalFareInnova: { type: String, default: '₹3,600' },
        isActive: { type: Boolean, default: true },
      },
    ],

    // 5. Hotel Policies & Operating Hours
    hotelPolicies: {
      checkInTime: { type: String, default: '12:00 PM' },
      checkOutTime: { type: String, default: '10:00 AM' },
      cancellationPolicy: {
        type: String,
        default: 'Free cancellation up to 48 hours prior to check-in. Non-refundable within 48 hours.',
      },
      diningHours: {
        type: String,
        default: 'Breakfast: 7:30 AM - 10:30 AM | Lunch: 12:30 PM - 3:00 PM | Dinner: 7:30 PM - 10:00 PM',
      },
      amenitiesList: [
        { type: String },
      ],
    },

    // 6. Travel Policies & FAQs
    travelPolicies: {
      nightChargeAmount: { type: Number, default: 300 },
      driverAllowancePerDay: { type: Number, default: 500 },
      faqs: [
        {
          q: { type: String },
          a: { type: String },
        },
      ],
      safetyStandards: [
        {
          title: { type: String },
          desc: { type: String },
          icon: { type: String },
        },
      ],
    },

    // 7. Dynamic Yield & Pricing Rules
    pricingRules: {
      weekendSurchargePercent: { type: Number, default: 15 }, // Applied to Friday & Saturday nights
      seasonalRules: [
        {
          id: { type: String, default: 'snowfall-peak' },
          title: { type: String, default: 'Winter Snowfall Peak' },
          multiplierPercent: { type: Number, default: 35 },
          startDate: { type: String, default: '12-20' }, // MM-DD format
          endDate: { type: String, default: '01-10' },   // MM-DD format
          isActive: { type: Boolean, default: true },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
