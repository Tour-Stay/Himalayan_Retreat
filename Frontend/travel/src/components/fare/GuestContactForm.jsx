const GuestContactForm = ({
  travelDate,
  setTravelDate,
  pickupTime,
  setPickupTime,
  guestName,
  setGuestName,
  guestPhone,
  setGuestPhone,
  guestEmail,
  setGuestEmail,
  specialNotes,
  setSpecialNotes,
  errorMessage,
}) => {
  return (
    <div className="pt-3 border-t border-[#EAA722]/20 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="calc-date" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Travel Date *
          </label>
          <input
            id="calc-date"
            type="date"
            value={travelDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
          />
        </div>

        <div>
          <label htmlFor="calc-time" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Pickup Timing / Train Time *
          </label>
          <select
            id="calc-time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
          >
            <option value="05:30 AM (Ranikhet Express Arrival)">05:30 AM (Ranikhet Express Arrival)</option>
            <option value="06:30 AM (Kathgodam Shatabdi / Morning)">06:30 AM (Kathgodam Shatabdi / Morning)</option>
            <option value="09:00 AM (Relaxed Morning)">09:00 AM (Relaxed Morning)</option>
            <option value="11:30 AM (Sampark Kranti / Noon)">11:30 AM (Sampark Kranti / Noon)</option>
            <option value="02:30 PM (Afternoon Transfer)">02:30 PM (Afternoon Transfer)</option>
            <option value="05:30 PM (Evening Arrival)">05:30 PM (Evening Arrival)</option>
            <option value="08:30 PM (Night Train Pickup)">08:30 PM (Night Train Pickup)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="calc-name" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Your Full Name *
          </label>
          <input
            id="calc-name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="calc-phone" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            WhatsApp Phone Number *
          </label>
          <input
            id="calc-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
          />
        </div>

        <div>
          <label htmlFor="calc-email" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Email Address *
          </label>
          <input
            id="calc-email"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="calc-notes" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
          Train / Flight Number or Special Request (Optional)
        </label>
        <input
          id="calc-notes"
          type="text"
          placeholder="e.g. Kathgodam Shatabdi #12040, 3 medium bags, stop for breakfast on the hill..."
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default GuestContactForm;
