import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Reviews', path: '/#reviews' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-secondary font-heading text-2xl font-semibold tracking-wide">
              Devbhoomi Retreat
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-secondary'
                    : 'text-white/80 hover:text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://your-friend-travel-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-secondary/50 text-secondary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary/10 transition-all duration-300"
            >
              Explore Travel Packages
            </a>
            <Link
              to="/rooms"
              className="bg-secondary text-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-6 pt-2 space-y-3 bg-primary/98">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium tracking-wide py-2 transition-colors ${
                isActive(link.path) ? 'text-secondary' : 'text-white/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://your-friend-travel-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center border border-secondary text-secondary px-6 py-2.5 rounded-full text-sm font-semibold mt-3"
          >
            Explore Travel Packages
          </a>
          <Link
            to="/rooms"
            onClick={() => setIsOpen(false)}
            className="block text-center bg-secondary text-primary px-6 py-2.5 rounded-full text-sm font-semibold mt-3"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
