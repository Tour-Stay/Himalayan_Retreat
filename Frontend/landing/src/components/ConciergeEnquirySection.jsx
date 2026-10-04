import { useState } from 'react';
import { Container, SITE_CONFIG, useSiteSettings } from '@shared';

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
        badge: '🪔 Heated Chalet Booking',
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
        badge: '🪔 Devotional Cab & Yatra Booking',
        title: 'Book Your Private Mountain Cab',
        subtitle:
          'Tell us your pickup location and route. Our team in Almora will message you directly on WhatsApp with route guidance and available vehicle options.',
        buttonText: 'Inquire for Mountain Cab on WhatsApp ↗',
        notesPlaceholder:
          'e.g. Early morning 5 AM pickup from Kathgodam, Kainchi Dham evening aarti halt, luggage space for 4 bags...',
      };
    }
    return {
      badge: '🪔 पावन यात्रा • Easy WhatsApp Booking',
      title: 'Plan Your Stay & Mountain Travel',
      subtitle:
        'Tell us your travel dates and requirements. Our team in Almora will message you directly on WhatsApp with available rooms and complete yatra guidance.',
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
        `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
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
        `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
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
        `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
        `*Stay & Cab Package Inquiry — The Kasar Himalayan Heights*\n` +
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
    <section id="enquiry" className="py-20 sm:py-28 px-4 bg-[#12433B] border-b border-[#0D332D] text-white relative overflow-hidden">
      <Container size="md">
        <div className="bg-[#0D332D] p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-[#EAA722]/30 shadow-2xl text-center relative z-10">
          <span className="text-[#EAA722] text-sm font-devanagari font-bold tracking-widest uppercase block mb-2">
            ॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥
          </span>
          <span className="text-[#FAF5EC]/80 text-xs font-serif tracking-widest uppercase mb-2 block">
            {header.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal mb-3">
            {header.title}
          </h2>
          <p className="text-[#FAF5EC]/90 text-base sm:text-lg max-w-xl mx-auto mb-8 font-serif font-normal">
            {header.subtitle}
          </p>

          <form onSubmit={handleEnquirySubmit} className="space-y-5 text-left max-w-xl mx-auto font-serif">
            {/* Row 1: Common Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enquiry-name" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1">
                  Your Full Name *
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 bg-[#12433B] rounded-xl border border-[#EAA722]/30 text-white placeholder-white/40 text-base focus:outline-none focus:border-[#EAA722]"
                />
              </div>
              <div>
                <label htmlFor="enquiry-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-[#12433B] rounded-xl border border-[#EAA722]/30 text-white placeholder-white/40 text-base focus:outline-none focus:border-[#EAA722]"
                />
              </div>
            </div>

            {/* Row 2: Service Selection */}
            <div>
              <label htmlFor="enquiry-service" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1">
                What are you looking for? *
              </label>
              <select
                id="enquiry-service"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-3 bg-[#12433B] rounded-xl border border-[#EAA722]/40 text-white text-base focus:outline-none focus:border-[#EAA722] cursor-pointer"
              >
                <option value="both" className="bg-[#12433B]">Both Room Stay &amp; Mountain Cab</option>
                <option value="hotel" className="bg-[#12433B]">Room Stay Only</option>
                <option value="travel" className="bg-[#12433B]">Cab / Travel Only</option>
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label htmlFor="enquiry-notes" className="block text-xs uppercase tracking-wider font-semibold text-[#EAA722] mb-1">
                Any Special Request (Optional)
              </label>
              <textarea
                id="enquiry-notes"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={header.notesPlaceholder}
                className="w-full px-4 py-3 bg-[#12433B] rounded-xl border border-[#EAA722]/30 text-white placeholder-white/40 text-base focus:outline-none focus:border-[#EAA722] resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-nkb-gold w-full py-4 text-xs sm:text-sm font-bold tracking-widest uppercase cursor-pointer mt-4 text-center"
            >
              {header.buttonText}
            </button>

            <p className="text-sm text-center text-[#FAF5EC]/80 pt-2 font-serif">
              Or speak with our Almora Sewa desk directly: <strong className="text-[#EAA722] font-sans font-bold tracking-wide">{company.conciergePhone}</strong>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ConciergeEnquirySection;
