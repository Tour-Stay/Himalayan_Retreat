import { useState } from 'react';
import { Container, SITE_CONFIG } from '@shared';

const ConciergeEnquirySection = () => {
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
        badge: 'Heated Chalet Booking',
        title: 'Book Your Heated Chalet Suite',
        subtitle:
          'Tell us your travel dates and room preference. Our Almora team will message you on WhatsApp with real room photos and current availability.',
        buttonText: 'Check Room Availability on WhatsApp ↗',
        notesPlaceholder:
          'e.g. Extra heater/wood for fireplace, upper floor attic with sunrise peak view, quiet corner suite...',
      };
    }
    if (formData.serviceType === 'travel') {
      return {
        badge: 'Private Mountain Cab Booking',
        title: 'Book Your Private Mountain Cab',
        subtitle:
          'Tell us your pickup location and route. Our team in Almora will message you directly on WhatsApp with fair, fixed rates and cab options.',
        buttonText: 'Inquire for Mountain Cab on WhatsApp ↗',
        notesPlaceholder:
          'e.g. Early morning 5 AM pickup from Kathgodam, Kainchi Dham evening aarti halt, luggage space for 4 bags...',
      };
    }
    return {
      badge: 'Easy WhatsApp Booking',
      title: 'Plan Your Stay & Mountain Travel',
      subtitle:
        'Tell us your travel dates and requirements. Our team in Almora will message you directly on WhatsApp with available rooms and fair cab prices.',
      buttonText: 'Inquire for Stay & Cab Package on WhatsApp ↗',
      notesPlaceholder:
        'e.g. Senior citizen travel, Kainchi Dham aarti darshan, extra fireplace wood, quiet attic room...',
    };
  };

  const header = getHeaderContent();

  const handleEnquirySubmit = (e) => {
    e.preventDefault();

    let message = '';

    if (formData.serviceType === 'hotel') {
      message = encodeURIComponent(
        `*Room Inquiry — The Kasar Himalayan Heights*\n` +
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
        `*Cab Inquiry — Mountain Expeditions*\n` +
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
        `*Package Inquiry — Stay & Mountain Cab*\n` +
        `----------------------------------------\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Service:* Both Room Stay & Mountain Cab\n` +
        `*Travel / Check-in Date:* ${formData.travelDate || 'Flexible / Planning'}\n` +
        `*Duration:* ${formData.durationNights}\n` +
        `*Guests:* ${formData.guests}\n` +
        `*Pickup Station:* ${formData.pickupLocation}\n` +
        `*Cab Preference:* ${formData.vehicleType}\n` +
        `*Special Request:* ${formData.notes || 'Please share room availability and best cab rates.'}\n` +
        `----------------------------------------`
      );
    }

    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="enquiry" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
      <Container size="md">
        <div className="bg-[#FAF6EF] p-6 sm:p-10 rounded-3xl border border-[#C5A059]/40 shadow-xl text-center">
          <span className="text-[#C5A059] text-xs font-sans font-semibold tracking-wider uppercase mb-2 block">
            {header.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium mb-3 transition-colors">
            {header.title}
          </h2>
          <p className="text-[#6B615E] text-sm max-w-xl mx-auto mb-8 font-normal transition-opacity">
            {header.subtitle}
          </p>

          <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left max-w-xl mx-auto">
            {/* Row 1: Common Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enquiry-name" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                  Your Full Name *
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                />
              </div>
              <div>
                <label htmlFor="enquiry-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                  WhatsApp / Phone Number *
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                />
              </div>
            </div>

            {/* Row 2: Service Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enquiry-service" className="block text-xs uppercase tracking-wider font-semibold text-[#7C1D23] mb-1 font-sans">
                  What are you looking for? *
                </label>
                <select
                  id="enquiry-service"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border-2 border-[#C5A059]/50 text-[#2C2523] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D23] cursor-pointer font-sans"
                >
                  <option value="both">Both Room Stay & Mountain Cab</option>
                  <option value="hotel">Room Stay Only</option>
                  <option value="travel">Cab / Travel Only</option>
                </select>
              </div>

              {/* Dynamic Column 2 based on Service */}
              {formData.serviceType === 'hotel' ? (
                <div>
                  <label htmlFor="enquiry-room-type" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Preferred Room Type
                  </label>
                  <select
                    id="enquiry-room-type"
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="Himalayan Attic Suite (Peak Views)">Himalayan Attic Suite (Peak Views)</option>
                    <option value="Pine Valley Deluxe Suite (Fireplace)">Pine Valley Deluxe Suite (Fireplace)</option>
                    <option value="Kasar Luxury Family Chalet">Kasar Luxury Family Chalet</option>
                    <option value="Flexible / Any Available Room">Flexible / Any Available Room</option>
                  </select>
                </div>
              ) : formData.serviceType === 'travel' ? (
                <div>
                  <label htmlFor="enquiry-travel-date" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Travel / Pickup Date *
                  </label>
                  <input
                    id="enquiry-travel-date"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="enquiry-package-date" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Check-in / Travel Date *
                  </label>
                  <input
                    id="enquiry-package-date"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                  />
                </div>
              )}
            </div>

            {/* Dynamic Row 3: Dates & Locations */}
            {formData.serviceType === 'hotel' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-checkin" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Check-in Date *
                  </label>
                  <input
                    id="enquiry-checkin"
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                  />
                </div>
                <div>
                  <label htmlFor="enquiry-checkout" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Check-out Date
                  </label>
                  <input
                    id="enquiry-checkout"
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-sans"
                  />
                </div>
              </div>
            )}

            {formData.serviceType === 'travel' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-travel-pickup" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Pickup Location *
                  </label>
                  <select
                    id="enquiry-travel-pickup"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="Kathgodam Railway Station">Kathgodam Railway Station</option>
                    <option value="Pantnagar Airport">Pantnagar Airport</option>
                    <option value="Delhi NCR / Airport">Delhi NCR / Airport</option>
                    <option value="Kasar Devi / Almora Local">Kasar Devi / Almora Local</option>
                    <option value="Other Location (Mention in notes)">Other Location (Mention in notes)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-travel-route" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Destination / Route *
                  </label>
                  <select
                    id="enquiry-travel-route"
                    value={formData.travelRoute}
                    onChange={(e) => setFormData({ ...formData, travelRoute: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="Kathgodam to Kasar Devi / Almora">Kathgodam to Kasar Devi / Almora</option>
                    <option value="Kainchi Dham Ashram Darshan Tour">Kainchi Dham Ashram Darshan Tour</option>
                    <option value="Jageshwar Dham Temples Tour">Jageshwar Dham Temples Tour</option>
                    <option value="Complete 3-Day Kumaon Darshan">Complete 3-Day Kumaon Darshan</option>
                    <option value="Delhi to Kasar Devi Transfer">Delhi to Kasar Devi Transfer</option>
                    <option value="Custom Sightseeing Tour">Custom Sightseeing Tour</option>
                  </select>
                </div>
              </div>
            )}

            {formData.serviceType === 'both' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-duration" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Duration of Stay
                  </label>
                  <select
                    id="enquiry-duration"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="1 Night">1 Night</option>
                    <option value="2 Nights (Kasar & Kainchi)">2 Nights (Kasar & Kainchi)</option>
                    <option value="3 Nights (Kainchi & Jageshwar)">3 Nights (Kainchi & Jageshwar)</option>
                    <option value="4+ Nights (Complete Retreat)">4+ Nights (Complete Retreat)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-both-pickup" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Pickup Station
                  </label>
                  <select
                    id="enquiry-both-pickup"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="Kathgodam Railway Station">Kathgodam Railway Station</option>
                    <option value="Pantnagar Airport">Pantnagar Airport</option>
                    <option value="Delhi NCR Pickup">Delhi NCR Pickup</option>
                    <option value="Self Drive / Already in Almora">Self Drive / Already in Almora</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dynamic Row 4: Guests & Vehicle / Rooms */}
            {formData.serviceType === 'hotel' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-hotel-guests" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Number of Guests
                  </label>
                  <select
                    id="enquiry-hotel-guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="1-2 Guests (Couple / Solo)">1-2 Guests (Couple / Solo)</option>
                    <option value="3-4 Guests (Small Family)">3-4 Guests (Small Family)</option>
                    <option value="5-8 Guests (Family Group)">5-8 Guests (Family Group)</option>
                    <option value="9+ Guests (Large Group)">9+ Guests (Large Group)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-rooms-count" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Number of Rooms
                  </label>
                  <select
                    id="enquiry-rooms-count"
                    value={formData.roomsCount}
                    onChange={(e) => setFormData({ ...formData, roomsCount: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="1 Room">1 Room</option>
                    <option value="2 Rooms">2 Rooms</option>
                    <option value="3 Rooms">3 Rooms</option>
                    <option value="Full Resort Chalet">Full Resort Chalet (Private Booking)</option>
                  </select>
                </div>
              </div>
            ) : formData.serviceType === 'travel' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-passengers" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Number of Passengers
                  </label>
                  <select
                    id="enquiry-passengers"
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="1-2 Passengers">1-2 Passengers</option>
                    <option value="3-4 Passengers">3-4 Passengers</option>
                    <option value="5-6 Passengers">5-6 Passengers</option>
                    <option value="7-12 Passengers">7-12 Passengers (Minibus)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-vehicle" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Preferred Vehicle Type
                  </label>
                  <select
                    id="enquiry-vehicle"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="4-Seater Sedan (Dzire / Etios)">4-Seater Sedan (Dzire / Etios)</option>
                    <option value="6-Seater SUV (Innova Crysta)">6-Seater SUV (Innova Crysta)</option>
                    <option value="12-Seater Luxury Minibus (Force Urbania)">12-Seater Luxury Minibus (Force Urbania)</option>
                    <option value="Recommend Best for Our Group">Recommend Best for Our Group</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-both-guests" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Number of Guests
                  </label>
                  <select
                    id="enquiry-both-guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="1-2 Guests (Couple / Solo)">1-2 Guests (Couple / Solo)</option>
                    <option value="3-4 Guests (Small Family)">3-4 Guests (Small Family)</option>
                    <option value="5-8 Guests (Family Group)">5-8 Guests (Family Group)</option>
                    <option value="9+ Guests (Large Group)">9+ Guests (Large Group)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-both-cab" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                    Preferred Cab Type
                  </label>
                  <select
                    id="enquiry-both-cab"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer font-sans"
                  >
                    <option value="6-Seater SUV (Innova Crysta)">6-Seater SUV (Innova Crysta)</option>
                    <option value="4-Seater Sedan (Dzire)">4-Seater Sedan (Dzire)</option>
                    <option value="12-Seater Luxury Minibus (Urbania)">12-Seater Luxury Minibus (Urbania)</option>
                    <option value="Self Drive (No Cab Needed)">Self Drive (No Cab Needed)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Special Requests */}
            <div>
              <label htmlFor="enquiry-notes" className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-1 font-sans">
                Any Special Request (Optional)
              </label>
              <textarea
                id="enquiry-notes"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={header.notesPlaceholder}
                className="w-full px-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 text-[#2C2523] text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-bold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md cursor-pointer mt-2 text-center"
            >
              {header.buttonText}
            </button>

            <p className="text-xs text-center text-[#6B615E] pt-1 font-sans">
              Or call our Almora desk directly: <strong className="text-[#2C2523] font-numeral font-bold tracking-wide">{SITE_CONFIG.conciergePhone}</strong>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ConciergeEnquirySection;

