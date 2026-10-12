import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal Scroll Manager for React Router SPAs:
 * 1. Automatically restores window scroll position to top (0, 0) upon route changes.
 * 2. Intelligently smooth-scrolls to the target DOM element when a hash (#section) is present,
 *    handling component mount and async render delays with graceful retry polling.
 */
export default function ScrollManager({ headerOffset = 80 }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
          return true;
        }
        return false;
      };

      // Try immediate scroll
      if (!scrollToTarget()) {
        // Fallback polling for asynchronous component mounting
        const timeouts = [60, 150, 300, 600].map((delay) =>
          setTimeout(() => {
            scrollToTarget();
          }, delay)
        );
        return () => timeouts.forEach((t) => clearTimeout(t));
      }
    } else {
      // Standard page transition without hash: reset scroll to very top immediately
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash, headerOffset]);

  return null;
}
