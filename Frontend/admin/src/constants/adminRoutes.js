/**
 * ===============================================================
 * THE KASAR HIMALAYAN HEIGHTS — ADMIN ROUTING CONFIGURATION
 * ===============================================================
 * Canonical URL routes, tab identifiers, and metadata for the
 * Staff Operations & Headless CMS Command Portal.
 */

export const ADMIN_ROUTES = {
  // Desk Operations
  rooms: '/rooms',
  'hotel-bookings': '/hotel-bookings',
  'travel-bookings': '/travel-bookings',
  tours: '/tours',
  reviews: '/reviews',

  // Yield & Pricing
  yield: '/yield',

  // Headless CMS & Global Settings
  company: '/settings/company',
  fleet: '/settings/fleet',
  drivers: '/settings/drivers',
  routes: '/settings/routes',
  announcements: '/settings/announcements',
  'landing-cms': '/settings/landing-cms',
  policies: '/settings/policies',
};

// Reverse lookup table: maps any path or alias to a valid tabId
export const PATH_TO_TAB = {
  '': 'rooms',
  'rooms': 'rooms',
  'dashboard': 'rooms',
  'dashboard/rooms': 'rooms',
  'hotel-bookings': 'hotel-bookings',
  'dashboard/hotel-bookings': 'hotel-bookings',
  'travel-bookings': 'travel-bookings',
  'dashboard/travel-bookings': 'travel-bookings',
  'tours': 'tours',
  'dashboard/tours': 'tours',
  'reviews': 'reviews',
  'dashboard/reviews': 'reviews',
  'yield': 'yield',
  'dashboard/yield': 'yield',

  // CMS paths
  'company': 'company',
  'settings': 'company',
  'settings/company': 'company',
  'dashboard/company': 'company',
  'fleet': 'fleet',
  'settings/fleet': 'fleet',
  'dashboard/fleet': 'fleet',
  'drivers': 'drivers',
  'settings/drivers': 'drivers',
  'dashboard/drivers': 'drivers',
  'routes': 'routes',
  'settings/routes': 'routes',
  'dashboard/routes': 'routes',
  'announcements': 'landing-cms',
  'settings/announcements': 'landing-cms',
  'dashboard/announcements': 'landing-cms',
  'landing-cms': 'landing-cms',
  'landing': 'landing-cms',
  'settings/landing-cms': 'landing-cms',
  'dashboard/landing-cms': 'landing-cms',
  'policies': 'policies',
  'settings/policies': 'policies',
  'dashboard/policies': 'policies',
};

export const ADMIN_TAB_TITLES = {
  rooms: 'Suites & Mountain Rooms | Admin Command Portal',
  'hotel-bookings': 'Guest Reservations & Folio Billing | Admin Command Portal',
  'travel-bookings': 'Chauffeur Fleet & Dispatch Desk | Admin Command Portal',
  tours: 'Curated Tour Packages | Admin Command Portal',
  reviews: 'Guest Review Moderation | Admin Command Portal',
  yield: 'Seasonal Yield & Weekend Rates | Admin Command Portal',
  company: 'Company Profile & Universal Contacts | Admin CMS',
  fleet: 'Cab Fleet Tariffs & Per-KM Matrix | Admin CMS',
  drivers: 'Chauffeur Tariffs, Night Charges & Driver Directory | Admin CMS',
  routes: 'Temple & Sightseeing Route Fares | Admin CMS',
  announcements: 'Emergency Notice Ribbon & Devotional Hero | Admin CMS',
  'landing-cms': 'Mandir Mala (7 Sacred Stops) & Visitor FAQs | Admin CMS',
  policies: 'Resort Policies, Dining Hours & FAQs | Admin CMS',
};

export const isValidTab = (tabId) => Boolean(ADMIN_ROUTES[tabId]);

export const resolveTabFromLocation = (pathname, search) => {
  // 1. Check search parameter ?tab=...
  if (search) {
    const params = new URLSearchParams(search);
    const queryTab = params.get('tab');
    if (queryTab && isValidTab(queryTab)) return queryTab;
  }

  // 2. Normalize pathname: remove leading and trailing slashes
  const clean = (pathname || '').replace(/^\/+|\/+$/g, '');
  if (PATH_TO_TAB[clean]) return PATH_TO_TAB[clean];

  // 3. Check if pathname matches /dashboard/:tab
  if (clean.startsWith('dashboard/')) {
    const sub = clean.replace(/^dashboard\//, '');
    if (isValidTab(sub)) return sub;
  }

  return 'rooms';
};
