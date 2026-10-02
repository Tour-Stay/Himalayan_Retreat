// ===============================================================
// THE KASAR HIMALAYAN HEIGHTS & EXPEDITIONS — CENTRAL SITE CONFIG
// ===============================================================

// Dynamic Cross-App Local Port & Production URL Mappings
export const APP_URLS = {
  landing: import.meta.env.VITE_LANDING_URL || 'http://localhost:5173',
  hotel: import.meta.env.VITE_HOTEL_URL || 'http://localhost:5174',
  travel: import.meta.env.VITE_TRAVEL_URL || 'http://localhost:5175',
  admin: import.meta.env.VITE_ADMIN_URL || 'http://localhost:5176',
};

// Core Brand Metadata & Geolocation Details
export const SITE_CONFIG = {
  brandName: 'The Kasar Himalayan Heights & Expeditions',
  hotelName: 'The Kasar Himalayan Heights',
  travelName: 'Himalayan Expeditions',
  elevation: '6,942 ft',
  tagline: 'High-Altitude Luxury Boutique Chalet & Chauffeured Mountain Expeditions',
  hotelLocation: 'Kasar Devi, Almora, Uttarakhand, India (6,942 ft)',
  travelHub: 'Almora Station Base, Uttarakhand, India',
  conciergePhone: '+91 96906 21247',
  whatsappNumber: '919690621247',
  whatsappDisplay: '+91 96906 21247',
  email: 'concierge@kasarhimalayanheights.com',
  peaks: ['Trishul (7,120 m)', 'Nanda Devi (7,816 m)', 'Panchachuli', 'Chaukhamba', 'Maiktoli'],
  socials: {
    instagram: 'https://instagram.com/kasarhimalayanheights',
    facebook: 'https://facebook.com/kasarhimalayanheights',
  },
};
