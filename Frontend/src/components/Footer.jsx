import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white/80">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: About */}
          <div>
            <h3 className="font-heading text-2xl text-secondary mb-4">Devbhoomi Retreat</h3>
            <p className="text-sm leading-relaxed text-white/60">
              A boutique mountain hotel and café in Mukteshwar. Handcrafted stays, alpine sunrises, and warm Kumaoni hospitality.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Rooms', path: '/rooms' },
                { name: 'Gallery', path: '/#gallery' },
                { name: 'Reviews', path: '/#reviews' },
                { name: 'Contact', path: '/#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-secondary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact + Map */}
          <div>
            <h4 className="font-heading text-lg text-white mb-4">Find Us</h4>
            <div className="space-y-3 text-sm text-white/60 mb-4">
              <p>📍 Mukteshwar, Uttarakhand, India</p>
              <p>📞 +91 96906 21247</p>
              <p>✉️ info@devbhoomiretreat.com</p>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <iframe
                title="Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13892.685764592822!2d79.63!3d29.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0a1b1c5b3e8b1%3A0x1234567890abcdef!2sMukteshwar%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Devbhoomi Retreat. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-secondary transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/40 hover:text-secondary transition-colors">Cancellation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
