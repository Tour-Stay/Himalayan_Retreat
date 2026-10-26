// ===============================================================
// THE KASAR HIMALAYAN HEIGHTS & EXPEDITIONS — CENTRAL SITE CONFIG
// ===============================================================

// Dynamic Cross-App Local Port & Production URL Mappings
const cleanUrl = (url, fallback) => (url || fallback).trim().replace(/\/+$/, '');

export const APP_URLS = {
  landing: cleanUrl(
    import.meta.env.VITE_LANDING_URL,
    import.meta.env.PROD ? 'https://himalayanretreathotel.netlify.app' : 'http://localhost:5173'
  ),
  hotel: cleanUrl(
    import.meta.env.VITE_HOTEL_URL,
    import.meta.env.PROD ? 'https://hotlhimalayanretreat.netlify.app' : 'http://localhost:5174'
  ),
  travel: cleanUrl(
    import.meta.env.VITE_TRAVEL_URL,
    import.meta.env.PROD ? 'https://travelhimalayan.netlify.app' : 'http://localhost:5175'
  ),
  admin: cleanUrl(
    import.meta.env.VITE_ADMIN_URL,
    import.meta.env.PROD ? 'https://adminhimalayan.netlify.app' : 'http://localhost:5176'
  ),
};

// Core Brand Metadata & Geolocation Details
export const SITE_CONFIG = {
  brandName: 'The Kasar Himalayan Heights & Expeditions',
  hotelName: 'The Kasar Himalayan Heights (Satya’s)',
  travelName: 'Himalayan Expeditions',
  elevation: '6,942 ft',
  tagline: 'High-Altitude Luxury Boutique Chalet & Chauffeured Mountain Expeditions',
  hotelLocation: 'Kasar Devi, Almora, Uttarakhand, India (6,942 ft)',
  travelHub: 'Almora Station Base, Uttarakhand, India',
  conciergePhone: '+91 88999 33339',
  whatsappNumber: '918899933339',
  whatsappDisplay: '+91 88999 33339',
  email: 'concierge@kasarhimalayanheights.com',
  mapsUrl: 'https://maps.google.com/?q=The+Kasar+Himalayan+Heights,+Kasar+Devi,+Almora,+Uttarakhand',
  socials: {
    instagram: 'https://www.instagram.com/the_kasar_himalyan_heights/?hl=en',
    facebook: 'https://www.facebook.com/61555816868523/',
  },
};
