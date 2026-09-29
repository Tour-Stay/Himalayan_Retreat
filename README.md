# 🏔️ Devbhoomi Retreat & Expeditions

> **Luxury Boutique Mountain Hotel & Chauffeured Himalayan Travel**  
> **Hotel Base:** Mukteshwar Ridge, Nainital District, Uttarakhand, India *(7,500 ft elevation)*  
> **Expeditions Hub:** Almora Station Base, Uttarakhand, India  
> **Concept:** High-altitude alpine chalet framing 180° Himalayan snow peaks (Trishul, Nanda Devi & Panchachuli), paired with chauffeured mountain travel across Kumaon & Garhwal.

---

## 🌟 Executive Summary

**Devbhoomi Retreat & Expeditions** is an enterprise-grade, full-stack hospitality and mountain travel web platform. Built with modern web architecture (React 19, Vite, Tailwind CSS v4, Node.js, Express, and MongoDB Atlas), the platform provides two isolated luxury experiences:

1. **Devbhoomi Retreat (Hotel Experience):**
   - Bespoke alpine chalet aesthetic inspired by Aman and Oberoi Wildflower Hall.
   - Heated mountain suites, 180° snow peak balconies, live winter snowfall particle engine.
   - Real-time stay cost calculator, quick-view suite modals, and direct reservation flow.

2. **Devbhoomi Expeditions (Tour & Travel Experience):**
   - Dedicated chauffeured mountain fleet: **4-Seater Sedans**, **6-Seater SUVs**, and **12-Seater Luxury Minibuses**.
   - **Almora as Default Starting Station & Origin Base** with real road distances calibrated for Uttarakhand hill circuits and sacred pilgrimage dhams.
   - **Interactive Distance & Vehicle Fare Calculator**: Real-time pricing based on route distance (km), vehicle per-km tariff, driver mountain allowance, and state tolls.
   - Dual booking modes: Instant WhatsApp concierge dispatch and direct database reservation.

3. **Secure Operations & Management Suite (Admin Portal):**
   - Protected with JWT authentication, Argon/Bcrypt hashing with secondary password pepper protection.
   - Comprehensive dashboard managing Hotel Suites, Room Bookings, and Tour & Travel Fleet Bookings.

---

## 📁 Repository Architecture

```text
Himalayan_Retreat/
├── Backend/                                # Node.js + Express + MongoDB Atlas API
│   ├── config/                             # Database & cloud storage configs
│   │   ├── cloudinary.js                   # Cloudinary asset uploads
│   │   ├── db.js                           # MongoDB connection via Mongoose
│   │   └── emailService.js                 # Automated guest confirmation emails
│   ├── controllers/                        # Route business logic
│   │   ├── authController.js               # Admin authentication & token generation
│   │   ├── hotelController.js              # Suite CRUD & reservation handlers
│   │   └── travelController.js             # Travel bookings & tour package handlers
│   ├── middleware/                         # Express middlewares
│   │   ├── authMiddleware.js               # JWT bearer token verification
│   │   └── uploadMiddleware.js             # Multer in-memory file handler
│   ├── models/                             # Mongoose database schemas
│   │   ├── Admin.js                        # Staff credential schema
│   │   ├── Booking.js                      # Hotel room booking schema
│   │   ├── Room.js                         # Hotel suite catalog schema
│   │   ├── TourPackage.js                  # Pre-packaged tour schema
│   │   └── TravelBooking.js                # Chauffeured travel booking schema
│   ├── routes/                             # API endpoints
│   │   ├── authRoutes.js                   # /api/auth
│   │   ├── hotelRoutes.js                  # /api/hotel
│   │   └── travelRoutes.js                 # /api/travel
│   ├── scripts/                            # Operational database scripts
│   │   ├── checkAdmin.js                   # Verifies existing admin credentials & pepper
│   │   ├── dropAdmin.js                    # Clears admin collection safely
│   │   └── seedAdmin.js                    # Seeds initial admin credentials
│   ├── .env.example                        # Backend environment variable template
│   ├── index.js                            # Express server entry point (Port 5000)
│   └── package.json
│
├── Frontend/                               # React 19 + Vite 6 + Tailwind CSS v4
│   ├── public/                             # Public static assets & SVGs
│   │   ├── favicon.svg                     # Custom mountain crest vector tab icon
│   │   ├── hero-hotel.jpg                  # High-resolution alpine chalet hero
│   │   ├── logo.svg                        # Standalone vector crest emblem
│   │   ├── placeholder-room.jpg            # Suite fallback banner
│   │   └── placeholder-room.svg            # Minimal SVG fallback asset
│   ├── src/
│   │   ├── assets/                         # Local imagery and assets
│   │   ├── components/                     # Modular, reusable UI components
│   │   │   ├── AmenitiesGrid.jsx           # Winter heating, power backup & geysers
│   │   │   ├── BookingForm.jsx             # Hotel stay date & guest booking form
│   │   │   ├── Experiences.jsx             # Bonfire, sunrise & trail showcases
│   │   │   ├── Footer.jsx                  # Hotel footer with newsletter & links
│   │   │   ├── Hero.jsx                    # High-altitude hero with live snowfall
│   │   │   ├── HeroBookingBar.jsx          # Hotel floating reservation bar
│   │   │   ├── Icons.jsx                   # Curated luxury SVG vector icons
│   │   │   ├── Loader.jsx                  # Mountain crest loading spinner
│   │   │   ├── Logo.jsx                    # Scalable vector crest logo
│   │   │   ├── Navbar.jsx                  # Frosted glass luxury hotel navigation
│   │   │   ├── RoomCard.jsx                # Suite card with image carousel
│   │   │   ├── RoomModal.jsx               # Suite quick-view modal dialog
│   │   │   ├── SnowEffect.jsx              # Canvas-based snowfall particle animation
│   │   │   ├── SuiteShowcase.jsx           # Split-screen editorial suite showcase
│   │   │   ├── TestimonialCard.jsx         # Guest review card component
│   │   │   ├── TiltCard.jsx                # Interactive 3D perspective card wrapper
│   │   │   ├── TravelFooter.jsx            # Tour & Travel dedicated footer
│   │   │   ├── TravelNavbar.jsx            # Tour & Travel dedicated navigation
│   │   │   └── WhatsAppButton.jsx          # Floating WhatsApp concierge trigger
│   │   ├── context/
│   │   │   └── AuthContext.jsx             # Staff session & token state management
│   │   ├── data/
│   │   │   └── mockRooms.js                # Offline fallback suite dataset
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx          # Management panel (Rooms, Bookings, Travel)
│   │   │   ├── AdminLogin.jsx              # Secure staff sign-in
│   │   │   ├── AllRooms.jsx                # Complete heated suite catalog with filters
│   │   │   ├── BookingConfirmation.jsx     # Hotel reservation success summary
│   │   │   ├── Home.jsx                    # Primary luxury hotel landing page
│   │   │   ├── RoomDetails.jsx             # Individual suite detail & gallery view
│   │   │   └── TourAndTravel.jsx           # Complete chauffeured expeditions page
│   │   ├── App.css
│   │   ├── App.jsx                         # Dynamic layout & route configuration
│   │   ├── index.css                       # Luxury design tokens, typography & buttons
│   │   └── main.jsx
│   ├── .env.example                        # Frontend environment variable template
│   ├── index.html                          # PWA meta, Google Fonts (Playfair & Inter)
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                              # Comprehensive multi-tier gitignore
└── README.md
```

---

## 🚕 Tour & Travel Mountain Fare Calculation Engine

### Default Starting Station: Almora, Uttarakhand
All route distances and tariffs originate from the central Kumaon hub of **Almora Station Base**.

#### Verified Road Distances from Almora Base:
| Destination Circuit | Category | One-Way Distance | Round-Trip (RT) Distance |
|:---|:---|:---:|:---:|
| **Jageshwar Mahamrityunjaya Dham** | Sacred 124 Jyotirlinga Shrines | 35 km | 70 km |
| **Kainchi Dham Ashram** | Neem Karoli Baba Ashram | 45 km | 90 km |
| **Ranikhet Orchards & Kasar Devi** | Cosmic Ridge & Tea Gardens | 46 km | 92 km |
| **Mukteshwar Dham & Chauli Ki Jali** | Himalayan Ridge & Cliffs | 50 km | 100 km |
| **Kausani Himalayan Panorama** | 300 km Snow Peak Vista | 52 km | 104 km |
| **Nainital Lake & Naina Devi** | Colonial Lake & Sacred Temple | 63 km | 126 km |
| **Kathgodam Railway Station** | Shatabdi / Ranikhet Express Base | 85 km | 170 km |
| **Grand Chardham Circuit** | Yamunotri, Gangotri, Kedarnath, Badrinath | 475 km | 950 km |

### Vehicle Fleet Tariff Matrix:
| Fleet Class | Vehicle Models | Seating Capacity | Luggage Capacity | Mountain Tariff |
|:---|:---|:---:|:---:|:---:|
| **Mountain Sedan** | Maruti Dzire / Toyota Etios | 4 Guests | 2 Large + 2 Cabin | **₹14 / km** |
| **Luxury SUV** | Toyota Innova Crysta / Ertiga ZXi | 6 Guests | 4 Large + Roof Carrier | **₹18 / km** |
| **Luxury Minibus** | Force Urbania / Tempo Traveller | 12 Guests | 10+ Large Bay Bags | **₹26 / km** |

### Mathematical Pricing Formula:
$$\text{Total Fare} = \left(\text{Route Distance (km)} \times \text{Vehicle Rate / km}\right) + \left(₹500 \times \text{Trip Days}\right) + \text{State Tolls \& Permits}$$

- **Route Modes:**
  - 🔄 **Round Trip (Return to Almora):** $2 \times \text{One-Way Distance}$
  - ➡️ **One-Way Drop / Transfer:** $1 \times \text{One-Way Distance}$
- **Interactive Custom Distance:** Guests can select destinations or override distance directly via the interactive range slider (20 km – 1,000 km) and direct numerical kilometer input.
- **Inclusions:** 100% Uttarakhand commercial passenger permits, FastTag, fuel, and chauffeur hill night lodging. Zero hidden ghat surcharges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend Framework** | React 19, Vite 6 |
| **Styling & Design System** | Tailwind CSS v4, Custom CSS Utilities (`.btn-gold`, `.glass-surface`, `.glass-pill-dark`) |
| **Typography** | Playfair Display (Serif Headings), Inter (Sans-serif Body), JetBrains Mono (Tariffs & Numbers) |
| **Routing** | React Router v6 (Isolated Layout for Hotel vs Travel) |
| **Backend Runtime** | Node.js, Express.js |
| **Database** | MongoDB Atlas via Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt, Password Pepper Hashing, Helmet HTTP Headers, Rate Limiting |
| **Storage & Media** | Cloudinary API, Wikimedia Commons (Authentic Himalayan Heritage) |

---

## ⚙️ Environment Configuration

### 1. Backend Configuration (`Backend/.env`)
Copy `Backend/.env.example` to `Backend/.env` and update your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/himalayan_retreat?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
PASSWORD_PEPPER=your_password_pepper_secret_here
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

### 2. Frontend Configuration (`Frontend/.env`)
Copy `Frontend/.env.example` to `Frontend/.env` (optional in development; defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)
- MongoDB Atlas cluster URI or local MongoDB instance

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/Himalayan_Retreat.git
cd Himalayan_Retreat
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Seed Initial Admin Account
node scripts/seedAdmin.js

# Start Development API Server
npm run dev
```
* Backend runs on: `http://localhost:5000`
* Health Check: `http://localhost:5000/` returns `"Backend API is running!"`

### 3. Frontend Setup
In a new terminal window:
```bash
cd Frontend
npm install

# Start Vite Development Server
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/api/auth/login` | Staff admin authentication (returns JWT token) | Public (Rate Limited) |

### 🏨 Hotel Suites & Bookings (`/api/hotel`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/hotel/rooms` | Retrieve all hotel rooms and suites | Public |
| `GET` | `/api/hotel/rooms/:id` | Retrieve single room details by ID | Public |
| `POST` | `/api/hotel/rooms` | Add a new suite (supports image upload) | Protected (Admin) |
| `PUT` | `/api/hotel/rooms/:id` | Update an existing suite | Protected (Admin) |
| `DELETE` | `/api/hotel/rooms/:id` | Delete a suite | Protected (Admin) |
| `POST` | `/api/hotel/bookings` | Create a new room booking reservation | Public |
| `GET` | `/api/hotel/bookings` | View all hotel reservations | Protected (Admin) |

### 🚕 Tour & Travel Expeditions (`/api/travel`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/travel/tours` | List all curated tour packages | Public |
| `GET` | `/api/travel/tours/:id` | Retrieve single tour package | Public |
| `POST` | `/api/travel/bookings` | Submit a chauffeured vehicle reservation | Public |
| `GET` | `/api/travel/bookings` | View all travel fleet bookings | Protected (Admin) |
| `POST` | `/api/travel/tours` | Add a new tour package | Protected (Admin) |
| `PUT` | `/api/travel/tours/:id` | Update tour package | Protected (Admin) |
| `DELETE` | `/api/travel/tours/:id` | Delete tour package | Protected (Admin) |

---

## 🔒 Security Best Practices Implemented

1. **Password Salt + Pepper**: Passwords are saved with bcrypt salting plus an out-of-band server-side environment pepper key, protecting against offline dictionary and rainbow table attacks.
2. **Brute Force Protection**: Express rate limiting on sensitive routes (`/api/auth/login`) limits attempts to 10 per 15 minutes per IP.
3. **HTTP Header Hardening**: Helmet middleware sets security headers including Content-Security-Policy and X-Frame-Options.
4. **Environment Isolation**: Production `.env` files are strictly excluded from version control via multi-tier `.gitignore` patterns.
5. **NoSQL Protection**: Strict Mongoose schema typing prevents unvetted query parameter injection.

---

## 📞 Concierge & Reservations

- **WhatsApp Concierge:** [+91 96906 21247](https://wa.me/919690621247)
- **Hotel Location:** Mukteshwar Ridge, Nainital District, Uttarakhand, India
- **Travel Hub Base:** Almora Station Base, Uttarakhand, India

---

*Crafted with high-altitude alpine passion for Devbhoomi Uttarakhand.*
