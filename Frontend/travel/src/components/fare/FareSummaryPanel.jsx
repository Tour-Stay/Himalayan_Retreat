import {
  SITE_CONFIG,
  CheckCircleIcon,
} from '@shared';

const FareSummaryPanel = ({
  pricing,
  passengerCount,
  pickupPoint,
  pickupTime,
  currentFleet,
  currentDest,
  routeInfo,
  tripType,
  days,
  kainchiHalt,
  bhowaliTeaHalt,
  submitting,
  onOnlineBooking,
  onWhatsAppBooking,
}) => {
  return (
    <div className="lg:col-span-5 xl:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAA722]/40 shadow-xl space-y-6 sticky top-24">
      {/* Top Total Amount Card */}
      <div className="border-b border-[#EAA722]/20 pb-5">
        <span className="text-xs sm:text-sm font-sans uppercase tracking-wider text-[#541508] font-bold block mb-1.5 font-mono">
          Estimated Total Fare
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-serif text-4xl sm:text-5xl font-bold text-[#541508] font-numeral tracking-tight">
            ₹{pricing.totalFare.toLocaleString()}
          </span>
          <div className="text-right">
            <span className="text-xs sm:text-sm font-bold text-[#541508] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#EAA722]/35 block font-numeral">
              ₹{pricing.perPersonFare.toLocaleString()} / person
            </span>
            <span className="text-xs text-[#5C5350] mt-1 block">
              for {passengerCount} {passengerCount === 1 ? 'guest' : 'guests'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Stepper Path */}
      <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#EAA722]/25 text-xs sm:text-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#5C5350] uppercase tracking-wider font-mono">
          <span>Your Travel Route</span>
          <span className="text-[#541508] font-bold text-sm">~{routeInfo.duration}</span>
        </div>

        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAA722]/40">
          <div className="relative">
            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#EAA722] ring-4 ring-[#FAF5EC]"></span>
            <span className="font-bold text-[#541508] block text-sm sm:text-base">{pickupPoint}</span>
            <span className="text-xs text-[#5C5350]">Pickup time: {pickupTime}</span>
          </div>

          {kainchiHalt && (
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-[#FAF5EC]"></span>
              <span className="font-semibold text-amber-900 block text-xs sm:text-sm">
                🛕 Kainchi Dham Ashram Darshan Halt
              </span>
              <span className="text-xs text-emerald-800 font-semibold">1.5 to 2 hours free halt for darshan &amp; prasad</span>
            </div>
          )}

          {bhowaliTeaHalt && (
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-[#FAF5EC]"></span>
              <span className="font-semibold text-emerald-900 block text-xs sm:text-sm">
                🍵 Tea &amp; Fresh Hill Fruit Stop at Bhowali
              </span>
            </div>
          )}

          <div className="relative">
            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#541508] ring-4 ring-[#FAF5EC]"></span>
            <span className="font-bold text-[#541508] block text-sm sm:text-base">{currentDest.name}</span>
            <span className="text-xs text-[#5C5350]">
              {tripType === 'round-trip' ? `Round trip return included (${days} ${days === 1 ? 'day' : 'days'})` : 'Drop right to your hotel doorstep'}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Dynamic Bill Breakdown */}
      <div className="space-y-2.5 text-xs sm:text-sm text-[#2C2523] bg-[#FAF5EC] p-5 rounded-2xl border border-[#EAA722]/20">
        <div className="flex justify-between items-center">
          <span className="text-[#5C5350]">Vehicle Selected:</span>
          <strong className="text-[#541508] font-semibold">{currentFleet.title}</strong>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#5C5350]">Distance Fare:</span>
          <span className="font-numeral font-semibold text-[#541508]">
            {pricing.billableDistance} km × ₹{currentFleet.perKmRate} = ₹{pricing.distanceFare.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#5C5350]">Driver Allowance:</span>
          <span className="font-numeral font-semibold text-[#541508] text-right">
            {pricing.driverBatta > 0 ? (
              tripType === 'round-trip' ? (
                days > 1 && pricing.nightHaltTotal > 0 ? (
                  `₹${pricing.driverDailyAllowance}/d × ${days}d + ₹${pricing.nightHaltTotal} (${days - 1} ${days - 1 === 1 ? 'night' : 'nights'}) = ₹${pricing.driverBatta.toLocaleString()}`
                ) : (
                  `₹${pricing.driverDailyAllowance} / day (${days} ${days === 1 ? 'day' : 'days'}) = ₹${pricing.driverBatta.toLocaleString()}`
                )
              ) : (
                routeInfo.km > 70
                  ? `₹${pricing.driverBatta.toLocaleString()} (Highway Drop Batta)`
                  : `₹${pricing.driverBatta.toLocaleString()} (Local Short Trip Batta)`
              )
            ) : (
              <span className="text-emerald-800 font-bold font-mono">₹0 (Waived)</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#5C5350]">Tolls, Green Tax &amp; FastTag:</span>
          <span className="text-emerald-800 font-bold font-mono">FREE (Included)</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#5C5350]">Temple Darshan Halt:</span>
          <span className="text-emerald-800 font-bold font-mono">FREE (Included)</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#EAA722]/20">
          <span className="font-bold text-sm sm:text-base text-[#541508]">Estimated Total:</span>
          <span className="font-serif font-bold text-xl sm:text-2xl text-[#541508] font-numeral">
            ₹{pricing.totalFare.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Trust Guarantees */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
          <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
          <span>100% Fixed price • Zero hidden charges on arrival</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
          <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
          <span>Friendly local Pahadi driver with 10+ years hill driving</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
          <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
          <span>Driver waits at station exit with your nameboard</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onOnlineBooking}
          disabled={submitting}
          className="w-full py-4 rounded-xl text-sm sm:text-base font-mono uppercase tracking-wider font-bold bg-[#073125] hover:bg-[#12433B] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{submitting ? 'Confirming Cab...' : 'Instant Online Booking ↗'}</span>
        </button>

        <button
          type="button"
          onClick={onWhatsAppBooking}
          className="w-full py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-mono uppercase tracking-wider font-bold border border-[#073125]/25 bg-white text-[#073125] hover:bg-[#EBF2EA] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Book via WhatsApp Direct ↗</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#073125]/80 text-center font-sans">
        Need urgent cab assistance? Call our Almora desk directly at{' '}
        <a href={`tel:${SITE_CONFIG.conciergePhone}`} className="text-[#073125] font-bold hover:underline font-numeral">
          {SITE_CONFIG.conciergePhone}
        </a>
      </p>
    </div>
  );
};

export default FareSummaryPanel;
