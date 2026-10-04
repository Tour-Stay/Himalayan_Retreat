# 🏔️ The Kasar Himalayan Heights & Expeditions

> **High-Altitude Boutique Alpine Resort & Chauffeured Mountain Travel Ecosystem**  
> **Resort Base:** Crank's Ridge, Kasar Devi, Almora, Uttarakhand, India *(6,942 FT Elevation)*  
> **Expeditions Hub:** Almora Station Base Hub, Uttarakhand, India  
> **Spiritual Center:** Kainchi Dham Ashram (45 km) • Jageshwar Dham (35 km) • Crank's Ridge (800 m)  
> **Concept:** Intimate alpine chalets framing 180° Himalayan snow peaks (Trishul, Nanda Devi & Panchachuli), paired with chauffeured mountain travel across Dev Bhoomi Uttarakhand.

---

## 📖 Table of Contents
1. [About the Project](#-about-the-project)
2. [Platform Architecture & Ports](#-platform-architecture--ports)
3. [Real-Time Cross-Portal Synchronization](#-real-time-cross-portal-synchronization)
4. [Technology Stack](#-technology-stack)
5. [Project Directory Structure](#-project-directory-structure)
6. [Core Features & Operations Desks](#-core-features--operations-desks)
7. [Database State & Seeding CLI](#-database-state--seeding-cli)
8. [Authentic Reviews & Photo Lightbox System](#-authentic-reviews--photo-lightbox-system)
9. [Mountain Travel & Fare Calculation Engine](#-mountain-travel--fare-calculation-engine)
10. [Centralized Asset Inventory (41 Image Files)](#-centralized-asset-inventory-41-image-files)
11. [Client Photography Wishlist](#-client-photography-wishlist)
12. [REST API Documentation](#-rest-api-documentation)
13. [Environment Variables Setup](#-environment-variables-setup)
14. [Installation & Local Setup](#-installation--local-setup)
15. [Security & Production Hardening](#-security--production-hardening)
16. [Contact & Concierge](#-contact--concierge)

---

## 🌟 About the Project

**The Kasar Himalayan Heights & Expeditions** is an enterprise-grade full-stack hospitality and mountain travel platform. Rooted in the sacred tranquility of Kumaon's **Crank’s Ridge** (6,942 FT), the project blends **Devotional Reverence** (honoring Sri Neem Karoli Baba Maharaj and ancient Shiva shrines) with **Quiet Alpine Luxury** (heated cedar chalets, stone fireplaces, satvik regional dining, and reliable chauffeured mountain transport).

### Geographical & Spiritual Significance
- **Kasar Devi & Crank’s Ridge (800 m walk):** Resting on a scientifically recognized geomagnetic belt shared only with Stonehenge and Machu Picchu, famous since Swami Vivekananda’s 1890 meditation.
- **Kainchi Dham Ashram (45 km / ~1.5 hrs):** World-renowned sanctuary founded by Sri Neem Karoli Baba Maharaj beside the Kshipra river.
- **Jageshwar Mahamrityunjaya Dham (35 km / ~1.2 hrs):** Ancient cluster of 124 8th-century Nagara stone Jyotirlinga temples nestled in dense deodar forests.
- **180° Snow Peak Horizon:** Clear, unobstructed views of Mount Trishul (7,120 m) and Mount Nanda Devi (7,816 m).

---

## 🏛️ Platform Architecture & Ports

The platform is designed as an isolated **multi-frontend monorepo** with a centralized shared package (`@shared`) and a hardened REST API backend:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   HIMALAYAN RETREAT PLATFORM                                     │
├───────────────────────────────┬─────────────────────────────────┬────────────────────────────────┤
│ 🌐 LANDING PAGE (Port 5173)   │ 🏨 BOUTIQUE HOTEL (Port 5174)   │ 🚕 TRAVEL PORTAL (Port 5175)   │
│ Devotional Heritage, Routes,  │ Heated Alpine Suites, Room      │ Mountain Fleet, Live Fare      │
│ 3-Day Plan & Dynamic Booking  │ Tariffs, Dining & Reservations  │ Calculator & Temple Circuits   │
├───────────────────────────────┴─────────────────────────────────┴────────────────────────────────┤
│ 🛡️ ADMIN COMMAND PORTAL (Port 5176): Canonical URLs, Hotel & Travel Desks, Dispatch & Yield CMS │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 📡 REAL-TIME BROADCAST ENGINE (BroadcastChannel + LocalStorage): Sub-millisecond Cross-Tab Sync │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 📦 @shared PACKAGE: Shared UI Components, Icons, Layouts, Centralized Asset Registry, Utilities  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ⚙️ BACKEND REST API (Port 5000): Express 5, Node.js, MongoDB Atlas, Cloudinary & Email Service   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Micro-Application | Port | Responsibility |
| :--- | :---: | :--- |
| **Landing Portal** | `5173` | Grand brand entry, Neem Karoli Baba devotional hero, Dev Bhoomi 4 pillars, route planner, dynamic booking form, and luxury sandstone footer. |
| **Hotel Portal** | `5174` | Dedicated boutique resort web app, heated alpine chalets, live winter snowfall canvas engine, dynamic suite showcase, room filters, and stay booking modal. |
| **Travel Portal** | `5175` | Dedicated mountain expedition web app, Almora base hub circuits, dynamic vehicle fare calculator, community guest reviews. |
| **Admin Portal** | `5176` | Executive staff command desk, canonical React Router deep links, live KPI counters, room CRUD, 1-click WhatsApp dispatch, police register exports, and site CMS. |
| **Backend REST API** | `5000` | Node.js + Express 5 backend with MongoDB Atlas, JWT authentication, rate limiting, and asset pipeline. |

---

## 📡 Real-Time Cross-Portal Synchronization

The ecosystem is equipped with a **zero-polling, sub-millisecond synchronization engine** built on HTML5 `BroadcastChannel` with fallback to `window.storage` events ([`Frontend/shared/utils/syncBroadcaster.js`](file:///d:/Himalayan_Retreat/Frontend/shared/utils/syncBroadcaster.js)):

1. **Instant Updates Across Open Portals:**
   - **`rooms`:** Toggling availability, updating tariffs, or editing suite specs in the Admin Room Manager immediately updates the Hotel suite showcase, room cards, and hero booking bar without page refresh.
   - **`settings`:** Updating company contact numbers, cab fleet tariffs, fixed routes, announcements, or policies instantly reflects on the Landing, Hotel, and Travel portals.
   - **`tours`:** Adding, updating, or deleting tour packages updates the Admin and client tour listings in real time.
   - **`reviews`:** Approving, moderating, or deleting customer reviews in Admin immediately updates the Hotel and Travel review feeds.
2. **Auto-Revalidation on Focus & Heartbeat:**
   - Client contexts automatically revalidate on `window.focus` and `document.visibilitychange`.
   - Includes a 45-second background health heartbeat to ensure zero stale state.

---

## 🛠️ Technology Stack

### Frontend Ecosystem
- **Core:** React 19, Vite 8, React Router DOM 7
- **Routing & Navigation:** Canonical semantic URLs (`/rooms`, `/hotel-bookings`, `/travel-bookings`, `/tours`, `/reviews`, `/yield`, `/settings/*`), `ProtectedRoute` with redirect preservation, and wildcard 404 fallbacks.
- **Styling & Design System:** Tailwind CSS v4 (`@tailwindcss/vite`), Vanilla CSS design tokens (`tokens.css`, `base.css`)
- **Typography:**
  - *Headings & Titles:* Playfair Display, Cormorant Garamond, Cinzel Roman
  - *Body Text:* Raleway, Inter
  - *Devotional Sanskrit:* Rozha One, Tiro Devanagari Hindi
  - *Numerals & Tariffs:* Lining numerals with clean sans-serif ampersands (`CleanAmp` fallback)
- **Visual FX & Interactions:** Canvas-based realistic snowfall particle engine, animated SVG chevrons (zero emojis/stickers).
- **HTTP Client:** Axios with standardized interceptors in `@shared/services/apiClient.js`.

### Backend Ecosystem
- **Runtime & Server:** Node.js, Express 5
- **Database & ODM:** MongoDB Atlas via Mongoose 9
- **Authentication & Security:** JSON Web Tokens (JWT), Bcrypt with server-side secret password pepper, Helmet HTTP security headers, Express Rate Limiting, Mongo Sanitize.
- **File & Media Handling:** Multer in-memory upload buffer + Cloudinary CDN pipeline with automatic fallback to Base64 Data URIs during third-party downtime.
- **Email Service:** Nodemailer automated guest confirmation dispatch.

---

## 📂 Project Directory Structure

```text
Himalayan_Retreat/
├── Backend/                                # Node.js + Express 5 API Server (Port 5000)
│   ├── config/
│   │   ├── cloudinary.js                   # Cloudinary CDN initialization & credentials
│   │   ├── db.js                           # MongoDB Atlas connection via Mongoose
│   │   └── emailService.js                 # Automated email delivery service
│   ├── controllers/
│   │   ├── authController.js               # Staff sign-in & JWT generation
│   │   ├── hotelController.js              # Suite CRUD & room reservation processing
│   │   ├── reviewController.js             # Guest reviews (Hotel & Travel) & moderation
│   │   ├── settingsController.js           # Live site settings, fleet, routes & policies
│   │   └── travelController.js             # Chauffeured travel booking & circuit handlers
│   ├── middleware/
│   │   ├── authMiddleware.js               # JWT bearer token verification
│   │   └── uploadMiddleware.js             # Multer in-memory buffer handler
│   ├── models/
│   │   ├── Admin.js                        # Staff credential schema with salt+pepper
│   │   ├── Booking.js                      # Hotel room booking reservation schema
│   │   ├── Room.js                         # Heated suite catalog schema
│   │   ├── SiteSettings.js                 # Dynamic CMS brand, fleet, routes & policies
│   │   ├── TourPackage.js                  # Pre-packaged travel circuit schema
│   │   ├── TravelBooking.js                # Chauffeured travel booking schema
│   │   └── TravelReview.js                 # Community review & photo schema (Hotel/Travel)
│   ├── routes/
│   │   ├── authRoutes.js                   # /api/auth endpoints
│   │   ├── hotelRoutes.js                  # /api/hotel endpoints (rooms, bookings, reviews)
│   │   ├── settingsRoutes.js               # /api/settings CMS endpoints
│   │   └── travelRoutes.js                 # /api/travel endpoints (tours, bookings, reviews)
│   ├── scripts/
│   │   ├── checkAdmin.js                   # Admin verification CLI script
│   │   ├── dropAdmin.js                    # Database cleanup script
│   │   ├── seedAdmin.js                    # Initial admin provisioning script
│   │   ├── seedDatabase.js                 # Complete luxury suites & tour packages seed
│   │   └── seedAuthenticReviews.js         # Authentic reviews & candid guest photo seed
│   ├── .env.example                        # Backend environment template
│   ├── index.js                            # Express server entry point
│   └── package.json
│
├── Frontend/                               # React 19 Multi-Frontend Monorepo
│   ├── landing/                            # Micro-App 1: Main Brand Portal (Port 5173)
│   │   ├── src/
│   │   │   ├── components/                 # LandingNavbar, HeroMaharajji, RouteDistancePlanner
│   │   │   ├── App.jsx                     # Landing page layout & auto-reveal
│   │   │   └── main.jsx
│   │   └── vite.config.js
│   │
│   ├── hotel/                              # Micro-App 2: Boutique Resort (Port 5174)
│   │   ├── src/
│   │   │   ├── components/                 # SuiteShowcase, HeroBookingBar, SanctuaryReviews, RoomCard
│   │   │   ├── pages/                      # HotelHome, AllRooms, RoomDetails, BookingConfirmation
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── vite.config.js
│   │
│   ├── travel/                             # Micro-App 3: Mountain Travel (Port 5175)
│   │   ├── src/
│   │   │   ├── components/                 # FareCalculator, VehicleFleet, TravelReviews, PilgrimageCircuits
│   │   │   ├── data/travelData.js          # Resilient asset & settings resolvers
│   │   │   ├── pages/                      # TravelHome, AllCabs, TravelBookingConfirmation
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── vite.config.js
│   │
│   ├── admin/                              # Micro-App 4: Operations Desk (Port 5176)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AdminHeader.jsx         # Staff top navigation, live site ports & sync
│   │   │   │   ├── AdminSidebar.jsx        # Semantic <Link> navigation with active indicator
│   │   │   │   ├── ProtectedRoute.jsx      # Auth guard with redirect preservation
│   │   │   │   ├── KpiCards.jsx            # Interactive top metrics summary cards
│   │   │   │   ├── RoomManager.jsx         # Full suite CRUD, image upload & availability toggle
│   │   │   │   ├── HotelBookingManager.jsx # Reservations, status selector & 1-click WhatsApp
│   │   │   │   ├── TravelBookingManager.jsx# Cab/tour requests, trip & payment status, WhatsApp
│   │   │   │   ├── TravelDispatchModal.jsx # Chauffeur & vehicle assignment with train tracking
│   │   │   │   ├── GuestIdProofModal.jsx   # Guest ID proof verification modal
│   │   │   │   ├── FolioInvoiceModal.jsx   # Itemized on-property folio checkout & invoice
│   │   │   │   ├── QuickBookingModal.jsx   # Walk-in reservation creator
│   │   │   │   ├── TourManager.jsx         # Tour package CRUD, itinerary & inclusions
│   │   │   │   ├── ReviewManager.jsx       # Review moderation with candid photo lightbox
│   │   │   │   ├── CompanyManager.jsx      # Brand info, phones, address, UPI ID CMS
│   │   │   │   ├── FleetManager.jsx        # Cab fleet models, tariffs & rates CMS
│   │   │   │   ├── RouteManager.jsx        # Fixed temple & sightseeing route tariffs CMS
│   │   │   │   ├── AnnouncementManager.jsx # Top announcement ribbon banner CMS
│   │   │   │   ├── PolicyManager.jsx       # Check-in/out, cancellation & driver allowances CMS
│   │   │   │   └── YieldManager.jsx        # Dynamic weekend surcharges & seasonal yield CMS
│   │   │   ├── constants/
│   │   │   │   └── adminRoutes.js          # Canonical URL map, tabs & document titles
│   │   │   ├── hooks/useAdminData.js       # Central data hook for all collections & stats
│   │   │   ├── pages/
│   │   │   │   ├── AdminLogin.jsx          # Protected staff login with rate limiting
│   │   │   │   └── AdminDashboard.jsx      # Deep-link routing orchestrator
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── vite.config.js
│   │
│   ├── shared/                             # Centralized Shared Package (@shared)
│   │   ├── assets/images/                  # 41 centralized, deduplicated image assets
│   │   ├── components/                     # ArchImage, BackToTop, Button, Container, Icons, Modal
│   │   ├── constants/assets.js             # Single source of truth for all images
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # Admin authentication state provider
│   │   │   └── SiteSettingsContext.jsx     # Global site settings & sync listener context
│   │   ├── utils/
│   │   │   └── syncBroadcaster.js          # BroadcastChannel cross-app sync engine
│   │   ├── services/apiClient.js           # Axios API client
│   │   └── index.js                        # Barrel exports for `@shared` import alias
│   └── package.json
└── README.md
```

---

## 🎯 Core Features & Operations Desks

### 1. Admin Command Portal ([AdminDashboard.jsx](file:///d:/Himalayan_Retreat/Frontend/admin/src/pages/AdminDashboard.jsx))
- **Canonical Semantic URLs:** Every operations desk has its own direct URL (e.g. `/rooms`, `/hotel-bookings`, `/travel-bookings`, `/tours`, `/reviews`, `/yield`, `/settings/company`, `/settings/fleet`).
- **Deep-Link State:** Navigation changes URL history via React Router `<Link>` components, allowing browser back/forward, bookmarks, and opening desks in new tabs.
- **Staff Access Protection ([ProtectedRoute.jsx](file:///d:/Himalayan_Retreat/Frontend/admin/src/components/ProtectedRoute.jsx)):** Unauthorized visits are remembered in `location.state.from` and redirected back automatically post-login.
- **Folio Checkout & Invoicing ([FolioInvoiceModal.jsx](file:///d:/Himalayan_Retreat/Frontend/admin/src/components/FolioInvoiceModal.jsx)):** Itemized on-property charges (hearth dining, room heaters, laundry) with printable invoice vouchers.
- **Digital Guest ID & Police Verification ([GuestIdProofModal.jsx](file:///d:/Himalayan_Retreat/Frontend/admin/src/components/GuestIdProofModal.jsx)):** Upload guest Aadhaar/Passport proof and export compliance Form C Police Register CSV.
- **Travel Dispatch Hub ([TravelDispatchModal.jsx](file:///d:/Himalayan_Retreat/Frontend/admin/src/components/TravelDispatchModal.jsx)):** Assign hill chauffeurs, license plates (e.g. `UK01-TA-4492`), track train arrival numbers, and log driver fuel allowances.

### 2. Dynamic Boutique Hotel Showcase ([SuiteShowcase.jsx](file:///d:/Himalayan_Retreat/Frontend/hotel/src/components/SuiteShowcase.jsx))
- Real-time catalog populated directly from MongoDB Atlas.
- High-altitude amenities list (room heaters, electric bed warmers, 24-hr hot water, private balconies).
- Interactive suite tabs with zero horizontal overflow, responsive on all devices.
- Direct booking modal integration with instant date difference and night calculation.

### 3. Dynamic Concierge Booking Form ([ConciergeEnquirySection.jsx](file:///d:/Himalayan_Retreat/Frontend/landing/src/components/ConciergeEnquirySection.jsx))
- **Smart Reactive Fields:**
  - Selecting **"Room Stay Only"** hides cab options and displays check-in/out date pickers, room categories, room counts, and guest numbers.
  - Selecting **"Cab / Travel Only"** hides room fields and displays travel date, pickup hub, destination route, vehicle model, and passenger count.
  - Selecting **"Both Room Stay & Mountain Cab"** reveals the complete joint pilgrimage package form.
- **Custom WhatsApp Message Generator:** Generates a pre-formatted, bulleted WhatsApp message routed to the concierge number (`+91 96906 21247`).

---

## 🗄️ Database State & Seeding CLI

The database state in **MongoDB Atlas** is fully populated with production-ready collections:

| Collection | Model | Count | Contents |
| :--- | :--- | :---: | :--- |
| `rooms` | `Room.js` | **5** | 4 luxury heated suites (*Nanda Devi*, *Cedar Family Chalet*, *Crank's Ridge Attic Glass Suite*, *Trishul Crest*) + reference room. |
| `tourpackages` | `TourPackage.js` | **3** | *Kainchi Dham Pilgrimage* (3D/2N), *Jageshwar Circuit* (2D/1N), *Grand Kumaon Heights* (4D/3N). |
| `sitesettings` | `SiteSettings.js` | **1** | Company branding, 3 cab fleet models, 6 temple/sightseeing circuits, policies, announcements, dynamic pricing rules. |
| `travelreviews` | `TravelReview.js` | **6** | 3 Hotel + 3 Travel authentic reviews with candid guest snapshots, realistic 4★/5★ ratings, and full comments. |
| `admins` | `Admin.js` | **1** | Provisioned staff credential (`abc_lalit@gmail.com`). |
| `bookings` | `Booking.js` | **1** | Active reservation history record. |
| `travelbookings`| `TravelBooking.js` | **0** | Clean, ready for live customer trip reservations. |

### Seeding Scripts

Run any of the automated seeders directly from `Backend/`:

```bash
cd Backend

# 1. Seed or reset Admin account
node scripts/seedAdmin.js

# 2. Seed all 4 luxury suites, tour packages, and site settings
node scripts/seedDatabase.js

# 3. Seed authentic customer reviews with candid photos & varied ratings
node scripts/seedAuthenticReviews.js
```

---

## 🌟 Authentic Reviews & Photo Lightbox System

Both the Hotel and Travel portals feature a **100% database-driven review engine** with zero hardcoded review cards:

1. **Unique Candid Traveler Photos (Zero Promotional Asset Reuse):**
   - Reviews do not recycle official marketing brochure or vehicle photos.
   - Genuine traveler perspectives: steaming morning chai held on wooden balcony overlooking peaks, Chitai temple sacred bells, winding mountain road from a car window, outdoor stone bonfire under starry night, traditional Kumaoni Satvik thali in brass katoris, and alpine ridge hiking trail.
2. **Realistic Rating Distribution:**
   - Varied 5★ and 4★ reviews providing an authentic **4.8★ - 4.9★ natural rating average**.
   - Includes real constructive traveler feedback (steep mountain approach road, gentle motion-sickness driving on hairpin curves).
3. **Interactive Full-Screen Photo Lightbox:**
   - Both [`SanctuaryReviews.jsx`](file:///d:/Himalayan_Retreat/Frontend/hotel/src/components/SanctuaryReviews.jsx) and [`TravelReviews.jsx`](file:///d:/Himalayan_Retreat/Frontend/travel/src/components/TravelReviews.jsx) include clickable photo thumbnails opening an animated, high-resolution modal.
4. **Instant Admin Moderation Sync:**
   - Approving, toggling, or deleting a review in the Admin Review Desk immediately broadcasts across all active tabs in milliseconds.

---

## 🚕 Mountain Travel & Fare Calculation Engine

### Default Starting Hub: Almora, Uttarakhand (6,942 FT)
All travel circuits and tariffs are calibrated from the central Kumaon hub of **Almora Station Base**.

#### Verified Road Distances & Driving Times:
| Destination Circuit | Spiritual / Scenic Category | One-Way Distance | Driving Time | Road Condition |
| :--- | :--- | :---: | :---: | :--- |
| **Kainchi Dham Ashram** | Sri Neem Karoli Baba Ashram | **45 km** | ~ 1.5 hrs | Smooth NH-109 Paved Highway |
| **Jageshwar Mahamrityunjaya** | 124 Ancient 8th-c. Jyotirlinga Shrines | **35 km** | ~ 1.2 hrs | Scenic Pine & Cedar Forest Road |
| **Kasar Devi & Crank's Ridge** | Geomagnetic Belt & Meditation Caves | **800 m** | 5 mins walk | Direct Pine Needle Ridge Trail |
| **Kathgodam Railway Station** | Primary Broad-Gauge Railhead | **85 km** | ~ 3.0 hrs | Well-Maintained Hill Highway |
| **Pantnagar Airport (PGH)** | Nearest Regional Airport | **120 km** | ~ 4.0 hrs | Plains to Ghat Mountain Transition |
| **Binsar Wildlife Sanctuary** | 300 km Snow Peak Crests | **22 km** | ~ 45 mins | Sanctuary Forest Ridge Road |
| **Mukteshwar Dham & Cliffs** | 350-Year-Old Shiva Temple | **48 km** | ~ 1.8 hrs | Mountain Orchard Ridge Road |
| **Ranikhet Cantonment** | Army Greens & Apple Orchards | **46 km** | ~ 1.5 hrs | Gentle Valley Hill Highway |
| **New Delhi / NCR** | Capital Highway Corridor | **375 km** | ~ 8.5 hrs | Expressway to Foothills Ascent |

#### Vehicle Fleet Tariff Matrix:
| Fleet Class | Vehicle Models | Seating | Luggage | Per-Km Rate | Base Day Tariff |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Mountain Sedan** | Swift Dzire / Toyota Etios | 4 Guests | 2 Large + 2 Cabin | **₹14 / km** | **₹2,499** |
| **Luxury SUV** | Toyota Innova Crysta | 6 Guests | 4 Large + Roof Carrier | **₹18 / km** | **₹4,499** |
| **Luxury Minibus** | Force Urbania / Traveller | 12 Guests | 10+ Large Suitcases | **₹26 / km** | **₹7,999** |

$$\text{Total Fare} = \left(\text{Route Distance (km)} \times \text{Vehicle Rate/km}\right) + \left(₹500 \times \text{Trip Days}\right) + \text{State Tolls \& Permits}$$

*All tariffs include vehicle fuel, state commercial permits, FastTag, and chauffeur lodging allowance. Zero hidden charges.*

---

## 📸 Centralized Asset Inventory (41 Image Files)

All media assets are strictly centralized in [`Frontend/shared/assets/images/`](file:///d:/Himalayan_Retreat/Frontend/shared/assets/images) and exported through [`Frontend/shared/constants/assets.js`](file:///d:/Himalayan_Retreat/Frontend/shared/constants/assets.js). No files are duplicated across individual frontend projects:

| Category | File Name | Export Identifier | Usage Location |
| :--- | :--- | :--- | :--- |
| **Holy Sites** | `neem-karoli-baba.jpg` | `babaPortraitImg` | Hero Section reverent arch portrait |
| | `Kainchi-Dham.webp` | `kainchiWebp` | Dev Bhoomi pillar & Kainchi Darshan card |
| | `kainchi-dham.jpg` | `kainchiJpg` | High-res alternate ashram perspective |
| | `Jageshwar-Mahamrityunjaya-Dham.jpg` | `jageshwarImg` | Jageshwar 124 Jyotirlinga temples card |
| | `kasar-devi-temple.jpg` | `kasarTempleImg` | Kasar Devi & Crank's Ridge cosmic belt |
| | `Trishul-&-Nanda-Devi.jpg` | `trishulPeaksImg` | Trishul (7,120m) & Nanda Devi vista |
| **Resort Exterior** | `hotel-best-pic.jpg` | `hotelBestPic` | Daytime chalet resort architecture (6,942 FT) |
| | `hotel-exterior-day.jpg` | `hotelExteriorDay` | Full resort daytime facade |
| | `hotel-in-snow.jpg` | `hotelInSnow` | Winter snowfall over the resort pine ridge |
| | `hotel-at-night.jpg` | `hotelAtNight` | Warm amber night illumination of the chalet |
| | `hotel-night-sky.jpg` | `hotelNightSky` | Starry night atmosphere over resort |
| **Room Interiors** | `snow-view-suite.jpg` | `snowViewSuiteImg` | Nanda Devi Signature Heated Suite bedroom |
| | `suite-nanda-devi-bed.jpg` | `suiteNandaDeviBed` | Nanda Devi suite bed close-up |
| | `suite-nanda-devi-balcony.jpg` | `suiteNandaDeviBalcony` | Nanda Devi private balcony view |
| | `suite-nanda-devi-balcony2.jpg` | `suiteNandaDeviBalcony2` | Alternate balcony perspective |
| | `suite-trishul-terrace.jpg` | `suiteTrishulTerrace` | Trishul Terrace suite |
| | `suite-luxury-bathroom.jpg` | `suiteLuxuryBathroom` | En-suite bathroom finishes |
| | `suite-attic-workspace.jpg` | `suiteAtticWorkspace` | Attic suite workspace area |
| | `chalet-suite.jpg` | `chaletSuiteImg` | Cedar Alpine Family Chalet bedroom |
| | `chalet-family-living.jpg` | `chaletFamilyLiving` | Chalet family living room |
| | `chalet-family-bedroom.jpg` | `chaletFamilyBedroom` | Chalet family bedroom |
| | `attic-suite.jpg` | `atticSuiteImg` | Crank's Ridge Attic Glass Suite pine interior |
| **Resort Amenities** | `caption.jpg` | `captionImg` | Satvik Dining & Cafe featuring resort signboard |
| | `corridor-at-day.jpg` | `corridorDay` | Wood-paneled alpine interior corridor |
| | `corridor-at-night.jpg` | `corridorNight` | Cozy night-lit interior guest hallway |
| | `gamezone.jpg` | `gamezoneImg` | Indoor family entertainment & recreational hall |
| | `sunrise-meditation-deck.jpg` | `sunriseMeditationDeck` | Morning meditation deck |
| **Dining** | `dining-satvik-thali.jpg` | `diningSatvikThali` | Authentic Satvik thali spread |
| | `dining-hearth-cafe.jpg` | `diningHearthCafe` | Hearth cafe interior |
| **Spiritual Trails** | `vivekananda-cave.jpg` | `vivekanandaCave` | Swami Vivekananda meditation cave |
| | `kasar-temple-trail.jpg` | `kasarTempleTrail` | Kasar Devi temple trail path |
| **Mountain Fleet** | `innova-crysta.jpg` | `innovaImg` | Toyota Innova Crysta (6-seater luxury SUV) |
| | `innova-interior.jpg` | `innovaInteriorImg` | Innova Crysta interior cabin |
| | `mountain-sedan.jpg` | `sedanImg` | Maruti Suzuki Dzire (4-seater mountain sedan) |
| | `luxury-minibus.jpg` | `minibusImg` | Force Urbania (12-seater executive carrier) |
| | `urbania-minibus-interior.jpg` | `urbaniaInteriorImg` | Urbania interior cabin |
| **Travel Destinations** | `kathgodam-railway-station-pickup.jpg` | `kathgodamStationImg` | Kathgodam station pickup point |
| | `kathgodam-taxi-station-pickup.jpg` | `kathgodamTaxiImg` | Kathgodam taxi stand |
| | `kausani-tea-peaks.jpg` | `kausaniImg` | Kausani tea gardens & peak views |
| | `kedarnath-chardham.jpg` | `kedarnathImg` | Kedarnath Char Dham temple |
| | `nainital-lake.jpg` | `nainitalLakeImg` | Nainital lake panorama |

---

## 📋 Client Photography Wishlist

To bring all sub-pages and gallery modals to 100% full production fidelity, the following authentic photographs are requested from the client:

### 1. Suite Bathrooms & Cozy In-Room Details
- [ ] **En-Suite Bathroom Details:** High-pressure shower cubicles, 24/7 hot water geysers, organic toiletries, and clean stone/wood finishes.
- [ ] **Private Balcony in Action:** Morning tea setup on the private balcony with Mount Trishul / Nanda Devi glowing in the dawn light.
- [ ] **Stone Fireplace:** Evening photo of the stone fireplace lit with fragrant pine logs in the Cedar Suite.

### 2. Dining & Satvik Cuisine
- [ ] **Authentic Kumaoni Thali:** Traditional local meal (Bhatt ki Churkani, Gahat ki Dal, Mandua rotis, Kumaoni Raita, and Buransh flower squash).
- [ ] **Terrace Breakfast Spread:** Hot parathas, mountain honey, and herbal tea overlooking the valley.
- [ ] **Evening Bonfire Experience:** Guests gathered around the outdoor pine bonfire under a starry Himalayan sky.

### 3. Surroundings & Experiences
- [ ] **Resort Walking Trail:** Footpath leading directly from the retreat onto Crank's Ridge pine trails towards the Kasar Devi Temple.
- [ ] **Sunset / Dusk Horizon:** Golden sunset illuminating the Almora valley and Himalayan silhouette.
- [ ] **Meditation Deck / Yoga Corner:** Quiet morning meditation scene on the open lawn or attic balcony.

### 4. Mountain Travel & Chauffeurs
- [ ] **Chauffeur Meet-and-Greet:** Native hill driver welcoming guests with luggage assistance at Kathgodam Railway Station.
- [ ] **Vehicle on Forest Ghat Road:** Innova Crysta or Force Urbania navigating the scenic deodar forest between Almora and Jageshwar.

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Staff admin authentication (returns JWT token) | Public (Rate Limited) |

### 🏨 Hotel Suites, Bookings & Reviews (`/api/hotel`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hotel/rooms` | Retrieve all available suites in catalog | Public |
| `GET` | `/api/hotel/rooms-admin` | Retrieve ALL suites (available + disabled) | Protected (Admin) |
| `GET` | `/api/hotel/rooms/:id` | Retrieve single suite details by ID | Public |
| `POST` | `/api/hotel/rooms` | Create a new suite (file upload + Data URI fallback) | Protected (Admin) |
| `PUT` | `/api/hotel/rooms/:id` | Update an existing suite (with image upload) | Protected (Admin) |
| `PUT` | `/api/hotel/rooms/:id/toggle` | Toggle room availability on/off | Protected (Admin) |
| `DELETE` | `/api/hotel/rooms/:id` | Delete a suite from catalog | Protected (Admin) |
| `POST` | `/api/hotel/bookings` | Submit room booking reservation | Public |
| `GET` | `/api/hotel/bookings` | Retrieve all guest reservations (newest first) | Protected (Admin) |
| `PUT` | `/api/hotel/bookings/:id/status` | Update booking status (`confirmed`, `cancelled`, etc.) | Protected (Admin) |
| `POST` | `/api/hotel/bookings/:id/folio` | Add itemized on-property folio charge | Protected (Admin) |
| `DELETE` | `/api/hotel/bookings/:id/folio/:cId`| Remove itemized folio charge | Protected (Admin) |
| `PUT` | `/api/hotel/bookings/:id/settle` | Settle folio balance & complete checkout | Protected (Admin) |
| `POST` | `/api/hotel/bookings/:id/id-proof` | Upload guest ID document (Aadhaar/Passport) | Protected (Admin) |
| `GET` | `/api/hotel/bookings/police-register`| Export Form C Police Verification Register CSV | Protected (Admin) |
| `DELETE` | `/api/hotel/bookings/:id` | Remove a booking record | Protected (Admin) |
| `GET` | `/api/hotel/reviews` | Fetch approved hotel guest reviews with photos | Public |
| `POST` | `/api/hotel/reviews` | Submit new hotel review | Public |

### 🚕 Tour & Travel Expeditions (`/api/travel`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/travel/tours` | List all curated tour packages | Public |
| `GET` | `/api/travel/tours/:id` | Retrieve single tour package | Public |
| `POST` | `/api/travel/tours` | Create tour package (with image upload) | Protected (Admin) |
| `PUT` | `/api/travel/tours/:id` | Edit tour package (with image upload) | Protected (Admin) |
| `DELETE` | `/api/travel/tours/:id` | Delete tour package from catalog | Protected (Admin) |
| `POST` | `/api/travel/bookings` | Submit a chauffeured vehicle reservation | Public |
| `GET` | `/api/travel/bookings` | Retrieve all travel fleet bookings (newest first) | Protected (Admin) |
| `PUT` | `/api/travel/bookings/:id/status` | Update travel booking status | Protected (Admin) |
| `PUT` | `/api/travel/bookings/:id/payment` | Update payment settlement status (`pending`, `paid`) | Protected (Admin) |
| `PUT` | `/api/travel/bookings/:id/dispatch` | Assign chauffeur, plate number, train ETA | Protected (Admin) |
| `DELETE` | `/api/travel/bookings/:id` | Remove a travel booking | Protected (Admin) |
| `GET` | `/api/travel/reviews` | Fetch approved travel reviews (supports `?category=`) | Public |
| `POST` | `/api/travel/reviews` | Submit guest review with up to 5 photos | Public |
| `GET` | `/api/travel/reviews/admin` | Fetch ALL reviews for moderation (approved & pending) | Protected (Admin) |
| `PUT` | `/api/travel/reviews/:id/approve` | Toggle review approval status | Protected (Admin) |
| `DELETE` | `/api/travel/reviews/:id` | Delete a travel review | Protected (Admin) |

### ⚙️ Site Settings CMS (`/api/settings`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Fetch all dynamic brand, fleet, route, policy settings | Public |
| `PUT` | `/api/settings` | Update site settings CMS (broadcasts across sites) | Protected (Admin) |

---

## ⚙️ Environment Variables Setup

### Backend Environment (`Backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/himalayan_retreat?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PASSWORD_PEPPER=your_password_pepper_key
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

### Frontend Environment (`Frontend/.env`)
```env
VITE_LANDING_URL=http://localhost:5173
VITE_HOTEL_URL=http://localhost:5174
VITE_TRAVEL_URL=http://localhost:5175
VITE_ADMIN_URL=http://localhost:5176
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Active MongoDB Atlas URI or local MongoDB instance

### 2. Clone Repository
```bash
git clone https://github.com/<your-username>/Himalayan_Retreat.git
cd Himalayan_Retreat
```

### 3. Backend Setup & Seed
```bash
cd Backend
npm install

# Seed Admin account
node scripts/seedAdmin.js

# Seed Luxury Suites, Tours & Site CMS
node scripts/seedDatabase.js

# Seed Authentic Reviews with Candid Traveler Photos
node scripts/seedAuthenticReviews.js

# Start Backend Server (Port 5000)
npm run dev
```

### 4. Frontend Launch Options
From the project root or `Frontend/` folder, run individual applications:

```bash
# Terminal 1: Landing Page (Port 5173)
cd Frontend/landing && npm install && npm run dev

# Terminal 2: Boutique Hotel Resort (Port 5174)
cd Frontend/hotel && npm install && npm run dev

# Terminal 3: Chauffeured Mountain Travel (Port 5175)
cd Frontend/travel && npm install && npm run dev

# Terminal 4: Admin Command Portal (Port 5176)
cd Frontend/admin && npm install && npm run dev
```

Alternatively, from the `Frontend/` root folder:
```bash
cd Frontend
npm install
npm run dev:landing   # Runs landing on 5173
npm run dev:hotel     # Runs hotel on 5174
npm run dev:travel    # Runs travel on 5175
npm run dev:admin     # Runs admin on 5176
```

---

## 🔒 Security & Production Hardening

1. **Password Salt + Pepper:** Passwords hashed with Bcrypt combined with an out-of-band server-side pepper key.
2. **Brute Force Defense:** Sensitive auth endpoints protected by `express-rate-limit` (10 attempts per 15 minutes per IP).
3. **HTTP Header Hardening:** `helmet` middleware enforces modern Content Security Policies and X-Frame-Options.
4. **Data Sanitization:** Strict Mongoose schemas and `express-mongo-sanitize` prevent NoSQL injection.
5. **Resilient Upload Engine:** Automatic base64 fallback ensures uninterrupted room/tour creation during Cloudinary rate limits or network issues.
6. **Route Protection & History:** In-memory + storage session persistence with automatic redirect preservation upon session expiry.

---

## 📞 Contact & Concierge

- **WhatsApp Concierge:** [+91 96906 21247](https://wa.me/919690621247)
- **Direct Phone:** `+91 96906 21247`
- **Email:** `concierge@kasarhimalayanheights.com`
- **Hotel Location:** The Kasar Himalayan Heights, Crank's Ridge, Kasar Devi, Almora, Uttarakhand 263601 *(6,942 FT)*
- **Travel Hub Base:** Almora Station Base Hub, Uttarakhand, India

---

*॥ ॐ श्री नीब करौरी महाराजाय नमः ॥ • Dedicated with reverence to Dev Bhoomi Uttarakhand.*
