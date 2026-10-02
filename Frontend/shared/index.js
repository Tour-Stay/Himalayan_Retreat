// ===============================================================
// THE KASAR HIMALAYAN HEIGHTS — SHARED PACKAGE BARREL EXPORTS
// ===============================================================

// Components
export { default as Button } from './components/Button';
export { default as ArchImage } from './components/ArchImage';
export { default as Container } from './components/Container';
export { default as SectionHeading } from './components/SectionHeading';
export { default as Divider } from './components/Divider';
export { default as Modal } from './components/Modal';
export { default as Accordion } from './components/Accordion';
export { default as Loader } from './components/Loader';
export { default as Logo } from './components/Logo';
export { default as WhatsAppButton } from './components/WhatsAppButton';
export { default as TiltCard } from './components/TiltCard';
export { default as BackToTop } from './components/BackToTop';
export * from './components/Icons';

// Layout
export { default as SiteHeader } from './layout/SiteHeader';
export { default as SiteFooter } from './layout/SiteFooter';
export { default as AnnouncementBar } from './layout/AnnouncementBar';

// Context
export { AuthContext, AuthProvider } from './context/AuthContext';

// Services
export { default as apiClient } from './services/apiClient';

// Constants
export { APP_URLS, SITE_CONFIG } from './constants/siteConfig';
export * from './constants/assets';

// Hooks
export { useScrollReveal, useStaggerReveal, initAutoScrollReveal } from './hooks/useScrollReveal';
