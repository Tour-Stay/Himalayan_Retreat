import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — Triggers a CSS class when element enters viewport.
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal">...</div>
 *
 * Options:
 *   threshold — How much of the element must be visible (0-1). Default: 0.15
 *   rootMargin — CSS margin around root. Default: '0px 0px -60px 0px'
 *   once — Only trigger once (default true)
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          node.classList.add('revealed');
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
          node.classList.remove('revealed');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * useStaggerReveal — Returns a callback ref creator for staggered card animations.
 * Usage:
 *   const getRef = useStaggerReveal();
 *   {items.map((item, i) => <div ref={getRef(i)} className="reveal-stagger">...</div>)}
 */
export function useStaggerReveal({ threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = {}) {
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.staggerIndex || '0', 10);
            entry.target.style.transitionDelay = `${index * 120}ms`;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (index) => (el) => {
    refs.current[index] = el;
    if (el) el.dataset.staggerIndex = String(index);
  };
}

/**
 * initAutoScrollReveal — Automatically scans and observes all elements with .reveal classes.
 * Safe to call on mount in any React component or main.jsx.
 */
export function initAutoScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  const elements = document.querySelectorAll(
    '.reveal:not(.revealed), .reveal-stagger:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)'
  );
  elements.forEach((el, index) => {
    if (el.classList.contains('reveal-stagger')) {
      el.style.transitionDelay = `${(index % 4) * 120}ms`;
    }
    observer.observe(el);
  });

  return () => observer.disconnect();
}

export default useScrollReveal;
