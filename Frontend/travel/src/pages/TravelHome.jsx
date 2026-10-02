import { useState, useEffect } from 'react';
import {
  Container,
  SectionHeading,
  Button,
  ArchImage,
  CarIcon,
  ShieldCheckIcon,
  CompassIcon,
  MountainIcon,
  initAutoScrollReveal,
} from '@shared';
import VehicleFleet from '../components/VehicleFleet';
import DestinationSlider from '../components/DestinationSlider';
import FareCalculator from '../components/FareCalculator';
import TravelReviews from '../components/TravelReviews';
import { safetyStandards } from '../data/travelData';

const TravelHome = () => {
  const [selectedFleetId, setSelectedFleetId] = useState('6-seater');

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  return (
    <div className="bg-ivory text-charcoal font-sans selection:bg-gold/20 selection:text-maroon">
      {/* 1. Hero: Misty Mountain Expeditions & Chauffeur Services */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-slate text-ivory overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/mountain-fleet.jpg"
            alt="Chauffeured Mountain Expeditions"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/75 to-slate/40"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate/85 border border-gold/40 text-gold text-xs font-mono uppercase tracking-[0.25em] mb-6 shadow-md">
            <CarIcon className="w-3.5 h-3.5 text-gold" />
            <span>Chauffeured Mountain Fleet • Hub: Almora</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-tight text-ivory max-w-4xl">
            Himalayan Expeditions & Chauffeured Travel
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-2xl text-gold/90 italic max-w-2xl font-light">
            Serene mountain transit across sacred Kumaon pilgrimage circuits & high passes
          </p>

          <p className="mt-4 text-sm sm:text-base text-ivory/75 max-w-2xl font-light leading-relaxed">
            Native Pahadi chauffeurs, high-clearance heated vehicles, and all-inclusive transparent fares measured directly from our Almora hub to Kainchi Dham, Jageshwar, Kathgodam, and Chardham.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#calculator"
              className="bg-maroon hover:bg-maroon-dark text-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-colors border border-gold/30"
            >
              Calculate Almora Fare
            </a>
            <a
              href="#fleet"
              className="border border-gold/50 hover:bg-gold/15 text-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-colors"
            >
              Explore Mountain Fleet
            </a>
          </div>
        </div>
      </section>

      {/* 2. 3 Traveler Personas (Inspired by Kumaon Collective) */}
      <section className="py-20 px-4 bg-ivory border-b border-gold/15">
        <Container size="lg">
          <SectionHeading
            subtitle="Tailored Mountain Journeys"
            title="Designed for Every Type of Traveler"
            description="Whether seeking silent meditation at ancient shrines, family vacations across alpine valleys, or high-altitude passes."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sacred Pilgrims & Devotees',
                desc: 'Unhurried transfers to Sri Kainchi Dham, Jageshwar 124-shrine complex, and Kasar Devi caves with respectful, quiet Pahadi chauffeurs.',
                badge: 'Pilgrimage Circuit',
              },
              {
                title: 'Family Vacations & Reunions',
                desc: 'Spacious 6-seater Innova Crysta and 12-seater Maharaja Urbania with luggage bays, room heating, and kid-friendly rest stops.',
                badge: 'Family & Group Comfort',
              },
              {
                title: 'Railway & Station Transfers',
                desc: 'Punctual meet & greet at Kathgodam Railway Station or Pantnagar Airport with personalized guest nameboards and direct hotel drop.',
                badge: 'Station Transfer Hub',
              },
            ].map((persona, idx) => (
              <div
                key={idx}
                className="bg-ivory-warm p-8 rounded-3xl border border-gold/30 shadow-sm flex flex-col justify-between reveal-stagger"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full border border-gold/30 inline-block mb-4">
                    {persona.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-charcoal mb-3">
                    {persona.title}
                  </h3>
                  <p className="text-charcoal-muted text-sm leading-relaxed font-light">
                    {persona.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Safety Standards */}
      <section className="py-20 px-4 bg-ivory-warm/60 border-b border-gold/15">
        <Container size="lg">
          <SectionHeading
            subtitle="Mountain Reliability"
            title="Safety & Mountain Standards"
            description="Navigating Uttarakhand hill roads requires experience, patience, and well-maintained machinery."
          />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyStandards.map((std, idx) => (
              <div
                key={idx}
                className="bg-ivory p-6 rounded-2xl border border-gold/25 shadow-xs flex items-start gap-4 reveal-stagger"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-maroon flex-shrink-0 font-serif font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-charcoal mb-1">
                    {std.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                    {std.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Vehicle Fleet (4, 6, 12 Seater) */}
      <VehicleFleet onBookFleet={(id) => setSelectedFleetId(id)} />

      {/* 5. Destination Circuits & Almora Distance Matrix */}
      <DestinationSlider />

      {/* 6. Almora Fare Calculator Engine */}
      <section className="py-24 px-4 bg-ivory border-b border-gold/15">
        <Container size="lg">
          <FareCalculator
            selectedFleetId={selectedFleetId}
            onSelectFleet={(id) => setSelectedFleetId(id)}
          />
        </Container>
      </section>

      {/* 7. Client Reviews & Feedback */}
      <TravelReviews />
    </div>
  );
};

export default TravelHome;
