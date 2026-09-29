import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MountainIcon, PhoneIcon, MessageIcon, MapPinIcon, ArrowUpRightIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import Logo from './Logo';

const TravelFooter = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fleetLinks = [
    { name: '4-Seater Mountain Sedan', path: '#fleet' },
    { name: '6-Seater Luxury SUV', path: '#fleet' },
    { name: '12-Seater Luxury Minibus', path: '#fleet' },
    { name: 'Kathgodam Railway Meet & Greet', path: '#calculator' },
    { name: 'View All Fleet & Day Rates', path: '#fleet' },
  ];

  const circuitLinks = [
    { name: 'Kainchi Dham Ashram Darshan', path: '#destinations' },
    { name: 'Mukteshwar Dham & Chauli Ki Jali', path: '#destinations' },
    { name: 'Jageshwar Mahamrityunjaya Shrines', path: '#destinations' },
    { name: 'Nainital Lake & Peaks Tour', path: '#destinations' },
    { name: 'Kausani 300-km Peak Panorama', path: '#destinations' },
    { name: 'Sacred Chardham Yatra Circuit', path: '#destinations' },
  ];

  return (
    <footer className="bg-[#0B0F12] text-white/80 border-t border-secondary/20 relative z-20 font-sans">
      {/* 1. Himalayan Road & Circuit Alerts Bar */}
      <div className="border-b border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-2">
              <SparklesIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Himalayan Expeditions & Circuit Alerts</span>
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-white font-medium">
              Receive Himalayan Road Status & Seasonal Circuit Offers
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-light">
              Be notified about winter snow pass clearance, seasonal Kainchi Dham bhandara timings, and private mountain fleet discounts.
            </p>
          </div>

          {/* Subscribe Form */}
          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-forest bg-forest/10 px-6 py-3 rounded-full text-xs font-semibold border border-forest/30">
                <CheckCircleIcon className="w-4 h-4 text-forest" />
                <span>You are subscribed to Mountain Road & Circuit Alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="px-5 py-3.5 rounded-full bg-white/5 border border-white/15 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-secondary transition-all w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="group btn-gold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Luxury Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4">
            <Link to="/travel" className="flex items-center gap-3 mb-4 group inline-flex">
              <Logo size={44} />
              <div>
                <span className="text-white font-heading text-2xl font-semibold tracking-wide block leading-none group-hover:text-secondary transition-colors">
                  Devbhoomi Expeditions
                </span>
                <span className="text-secondary/80 text-[10px] tracking-[0.25em] uppercase font-sans font-medium">
                  MUKTESHWAR • MOUNTAIN FLEET & TOURS
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-white/65 font-light mb-6 pr-4">
              Authorized commercial mountain fleet for Kumaon & Garhwal circuits. Dedicated 4, 6, and 12-seater vehicles driven by experienced native Pahadi chauffeurs with 24/7 mountain road assistance.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-surface-dark text-[11px] text-secondary font-medium border border-white/10">
                🏔️ Mountain Certified Fleet
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-surface-dark text-[11px] text-white/80 font-medium border border-white/10">
                ⭐ 4.9 Verified Chauffeur Rating
              </span>
            </div>
          </div>

          {/* Column 2: Private Mountain Fleet (2 cols) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
              Private Fleet
            </h4>
            <ul className="space-y-2.5">
              {fleetLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.path}
                    className="text-xs text-white/70 hover:text-secondary transition-colors duration-200 block font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Curated Circuits (3 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
              Uttarakhand Circuits
            </h4>
            <ul className="space-y-2.5">
              {circuitLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.path}
                    className="text-xs text-white/70 hover:text-secondary transition-colors duration-200 block font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Coordinates & Framed Map (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
              Coordinates & Dispatch
            </h4>
            <div className="space-y-2 text-xs text-white/70 font-light mb-4">
              <p className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Mukteshwar Ridge & Kathgodam Station Base, Uttarakhand 263138</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <a href="tel:+919690621247" className="hover:text-white transition-colors">+91 96906 21247 (Dispatch Desk)</a>
              </p>
              <p className="flex items-center gap-2">
                <MessageIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/919690621247" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 96906 21247 (WhatsApp Concierge)</a>
              </p>
            </div>

            {/* Framed Interactive Map Card */}
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 p-2 shadow-lg group">
              <div className="relative h-24 rounded-xl overflow-hidden bg-gray-800">
                <iframe
                  title="Devbhoomi Expeditions Mukteshwar & Kumaon Road Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13892.685764592822!2d79.63!3d29.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0a1b1c5b3e8b1%3A0x1234567890abcdef!2sMukteshwar%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="pt-2 flex items-center justify-between px-1">
                <span className="text-[11px] text-secondary font-medium">📍 7,500 ft Mountain Base</span>
                <a
                  href="https://maps.google.com/?q=Mukteshwar,Uttarakhand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/70 hover:text-white font-medium flex items-center gap-1 group-hover:text-secondary transition-colors"
                >
                  <span>Open Maps</span>
                  <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Devbhoomi Expeditions. All rights reserved. Himalayan Fleet Division of Devbhoomi Retreat.</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-secondary hover:text-white transition-colors duration-200 font-semibold inline-flex items-center gap-1">
              <span>Hotel Sanctuary</span>
              <ArrowUpRightIcon className="w-3 h-3" />
            </Link>
            <button
              onClick={scrollToTop}
              className="btn-glass-luxury px-4 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Back to Top</span>
              <span className="text-secondary group-hover:-translate-y-0.5 transition-transform duration-300">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TravelFooter;
