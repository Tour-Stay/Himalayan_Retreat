import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteHeader, SiteFooter, WhatsAppButton, BackToTop } from '@shared';
import TravelHome from './pages/TravelHome';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col selection:bg-gold/20 selection:text-maroon">
        <SiteHeader currentApp="travel" />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TravelHome />} />
          </Routes>
        </main>
        <SiteFooter />
        <WhatsAppButton />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
