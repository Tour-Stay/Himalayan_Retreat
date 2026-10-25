import { useState } from 'react';
import { Container, SITE_CONFIG, useSiteSettings, MapPinIcon } from '@shared';

const ConciergeEnquirySection = () => {
  const { settings } = useSiteSettings();
  const company = settings?.company || SITE_CONFIG;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'both', // 'both' | 'hotel' | 'travel'
    // Hotel fields
    checkInDate: '',
    checkOutDate: '',
    durationNights: '2 Nights',
    roomType: 'Himalayan Attic Suite (Peak Views)',
    roomsCount: '1 Room',
    guests: '1-2 Guests (Couple / Solo)',
    // Travel fields
    travelDate: '',
    pickupLocation: 'Kathgodam Railway Station',
    travelRoute: 'Kathgodam to Kasar Devi / Almora',
    vehicleType: '6-Seater SUV (Innova Crysta)',
    passengers: '2-4 Passengers',
    // Notes
    notes: '',
  });

  const getHeaderContent = () => {
    if (formData.serviceType === 'hotel') {
      return {
        badge: 'Heated Chalet Suites',
        title: 'Book Your Heated Chalet Suite',
        subtitle:
          'Tell us your travel dates and room preference. Our Almora team will message you on WhatsApp with real room photos and current availability.',
        buttonText: 'Check Room Availability on WhatsApp ↗',
        notesPlaceholder:
          'e.g. Upper floor attic with sunrise peak view, private balcony, extra heater...',
      };
    }
    if (formData.serviceType === 'travel') {
      return {
        badge: 'Chauffeured Mountain Fleet',
        title: 'Book Your Mountain Cab',
        subtitle:
          'Tell us your pickup location and route. Our team in Almora will message you directly on WhatsApp with route guidance and available vehicle options.',
        buttonText: 'Inquire for Mountain Cab on WhatsApp ↗',
        notesPlaceholder:
          'e.g. Morning pickup from Kathgodam, Kainchi Dham halt, luggage space for 4 bags...',
      };
    }
    return {
      badge: 'Boutique Stay & Chauffeured Travel',
      title: 'Plan Your Stay and Mountain Travel',
      subtitle:
        'Tell us your travel dates and requirements. Our team in Almora will message you directly on WhatsApp with available rooms and itinerary options.',
      buttonText: 'Inquire for Stay & Cab on WhatsApp ↗',
      notesPlaceholder:
        'e.g. Family travel, Kainchi Dham & Jageshwar visits, quiet chalet suite...',
    };
  };

  const header = getHeaderContent();

  const handleEnquirySubmit = (e) => {
    e.preventDefault();

    let message = '';

    if (formData.serviceType === 'hotel') {
      message = encodeURIComponent(
        `*The Kasar Himalayan Heights — Room Inquiry*\n` +
        `----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Service:* Room Stay Only\n` +
        `*Check-in Date:* ${formData.checkInDate || 'Flexible / Planning'}\n` +
        `*Check-out Date:* ${formData.checkOutDate || 'Not specified'}\n` +
        `*Guests:* ${formData.guests}\n` +
        `*Rooms:* ${formData.roomsCount}\n` +
        `*Preferred Room:* ${formData.roomType}\n` +
        `*Special Request:* ${formData.notes || 'Please share room availability and photos.'}\n` +
        `----------------------------------------`
      );
    } else if (formData.serviceType === 'travel') {
      message = encodeURIComponent(
        `*Mountain Expeditions — Cab & Travel Inquiry*\n` +
        `----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Service:* Cab / Travel Only\n` +
        `*Travel Date:* ${formData.travelDate || 'Flexible / Planning'}\n` +
        `*Pickup Point:* ${formData.pickupLocation}\n` +
        `*Route / Tour:* ${formData.travelRoute}\n` +
        `*Vehicle:* ${formData.vehicleType}\n` +
        `*Passengers:* ${formData.passengers}\n` +
        `*Special Request:* ${formData.notes || 'Please share available cabs and fixed pricing.'}\n` +
        `----------------------------------------`
      );
    } else {
      message = encodeURIComponent(
        `*The Kasar Himalayan Heights — Stay & Cab Package Inquiry*\n` +
        `----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Service:* Stay & Mountain Cab Both\n` +
        `*Dates:* ${formData.checkInDate || formData.travelDate || 'Planning / Flexible'}\n` +
        `*Guests:* ${formData.guests}\n` +
        `*Room Preference:* ${formData.roomType}\n` +
        `*Pickup / Cab:* ${formData.pickupLocation} (${formData.vehicleType})\n` +
        `*Special Request:* ${formData.notes || 'Please share package availability and cost.'}\n` +
        `----------------------------------------`
      );
    }

    const whatsappUrl = `https://wa.me/${company.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="enquiry" className="py-20 sm:py-28 px-3 sm:px-6 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden ambient-glow-gold">
      <Container size="lg">
        <div className="bg-[#3D0F06] p-6 sm:p-8 lg:p-10 xl:p-12 rounded-3xl border-2 border-[#EAA722]/35 shadow-2xl relative z-10 luxury-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
            {/* Left Column: Plan Your Stay & Mountain Travel Form */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* VIP Concierge Trust Note */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D0B04] border border-[#EAA722]/35 text-[#EAA722] text-xs font-sans font-medium mb-3">
                  <span>✦</span>
                  <span>Direct reply within 15 minutes by on-site Himalayan Concierge</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white font-semibold mb-3 leading-tight">
                  {header.title}
                </h2>
                <p className="text-[#FAF5EC]/90 text-sm sm:text-base mb-6 font-normal leading-relaxed">
                  {header.subtitle}
                </p>

                <form onSubmit={handleEnquirySubmit} className="space-y-4 font-sans text-left">
                  {/* Row 1: Common Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="enquiry-name" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-[#2D0B04] rounded-2xl border border-[#EAA722]/35 text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:border-[#EAA722] focus:ring-2 focus:ring-[#EAA722]/40 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="enquiry-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1.5">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        id="enquiry-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-[#2D0B04] rounded-2xl border border-[#EAA722]/35 text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:border-[#EAA722] focus:ring-2 focus:ring-[#EAA722]/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Service Selection */}
                  <div>
                    <label htmlFor="enquiry-service" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1.5">
                      What are you looking for? *
                    </label>
                    <select
                      id="enquiry-service"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2D0B04] rounded-2xl border border-[#EAA722]/40 text-white text-sm sm:text-base focus:outline-none focus:border-[#EAA722] focus:ring-2 focus:ring-[#EAA722]/40 transition-all cursor-pointer"
                    >
                      <option value="both" className="bg-[#2D0B04]">Both Room Stay &amp; Mountain Cab</option>
                      <option value="hotel" className="bg-[#2D0B04]">Room Stay Only</option>
                      <option value="travel" className="bg-[#2D0B04]">Cab / Travel Only</option>
                    </select>
                  </div>

                  {/* Row 3: Special Requests */}
                  <div>
                    <label htmlFor="enquiry-notes" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1.5">
                      Any Special Request (Optional)
                    </label>
                    <textarea
                      id="enquiry-notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={header.notesPlaceholder}
                      className="w-full px-4 py-3 bg-[#2D0B04] rounded-2xl border border-[#EAA722]/35 text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:border-[#EAA722] focus:ring-2 focus:ring-[#EAA722]/40 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-nkb-gold btn-shimmer w-full py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase cursor-pointer mt-2 text-center shadow-xl hover:shadow-2xl"
                  >
                    {header.buttonText}
                  </button>

                  <p className="text-xs sm:text-sm text-center text-[#FAF5EC]/85 pt-2 font-serif">
                    Or speak with our Almora Sewa desk directly:{' '}
                    <a
                      href={`tel:${company.conciergePhone}`}
                      className="text-[#EAA722] hover:underline font-sans font-bold tracking-wide"
                    >
                      {company.conciergePhone}
                    </a>
                  </p>
                </form>
              </div>
            </div>

            {/* Right Column: Interactive Google Map Showcase */}
            <div className="lg:col-span-5 flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EAA722]/35 shadow-2xl bg-[#2D0B04] min-h-[420px] lg:min-h-0">
              {/* Header inside Map Card */}
              <div className="p-4 sm:p-5 bg-[#250903] border-b border-[#EAA722]/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider text-[#EAA722] font-semibold">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                    <span>Crank's Ridge, Kasar Devi</span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-white mt-0.5">
                    The Kasar Himalayan Heights (Satya's)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAA722] animate-ping" />
                  <span className="text-xs font-sans font-bold text-white bg-[#541508] px-2.5 py-1 rounded-full border border-[#EAA722]/40">
                    6,942 FT
                  </span>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative flex-1 w-full min-h-[280px] sm:min-h-[320px] bg-[#1a0603]">
                <iframe
                  title="The Kasar Himalayan Heights (Satya's) Google Map"
                  src="https://maps.google.com/maps?q=The+Kasar+Himalyan+Heights+(Satya's)+Almora&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Footer Bar below Map */}
              <div className="p-3.5 sm:p-4 bg-[#250903] border-t border-[#EAA722]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[#EAA722] font-bold text-sm">★ 4.8</span>
                  <span className="text-white/80 font-medium">on Google Maps</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 hidden sm:inline">Almora</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=29.641388,79.6635582"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#3D0F06] hover:bg-[#541508] text-white border border-[#EAA722]/35 text-xs font-semibold tracking-wider transition-all flex items-center gap-1"
                  >
                    <span>Directions 🚗</span>
                  </a>
                  <a
                    href={company.mapsUrl || "https://www.google.com/maps/place/The+Kasar+Himalyan+Heights+(Satya%E2%80%99s)/@29.6414511,79.6604264,18.2z/data=!4m10!3m9!1s0x39a0b759f096cefd:0xfd1e3780fb315c22!5m3!1s2027-01-11!4m1!1i2!8m2!3d29.641388!4d79.6635582!16s%2Fg%2F11h0ykmn2s"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#EAA722] text-[#3D0F06] font-bold text-xs uppercase tracking-wider hover:bg-[#f3b53c] transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span>Open Map</span>
                    <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ConciergeEnquirySection;
