const MountainAddons = ({
  kainchiHalt,
  setKainchiHalt,
  roofCarrier,
  setRoofCarrier,
  bhowaliTeaHalt,
  setBhowaliTeaHalt,
  seniorAssistance,
  setSeniorAssistance,
}) => {
  return (
    <div>
      <label className="text-sm uppercase font-bold text-[#541508] tracking-wider flex items-center gap-2 mb-2.5 font-mono">
        <span className="text-[#EAA722]">🏔️</span>
        <span>3. Free Mountain Halts &amp; Add-ons</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Kainchi Dham Halt */}
        <label
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            kainchiHalt
              ? 'border-[#EAA722] bg-[#FAF5EC]'
              : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
          }`}
        >
          <input
            type="checkbox"
            checked={kainchiHalt}
            onChange={(e) => setKainchiHalt(e.target.checked)}
            className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-bold text-[#541508]">Kainchi Dham Darshan</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                FREE
              </span>
            </div>
            <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
              1.5 to 2 hours free halt for darshan, aarti &amp; prasad
            </span>
          </div>
        </label>

        {/* Luggage Carrier */}
        <label
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            roofCarrier
              ? 'border-[#EAA722] bg-[#FAF5EC]'
              : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
          }`}
        >
          <input
            type="checkbox"
            checked={roofCarrier}
            onChange={(e) => setRoofCarrier(e.target.checked)}
            className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-bold text-[#541508]">Roof Luggage Carrier</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                FREE
              </span>
            </div>
            <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
              Waterproof cover to keep your bags safe and dry
            </span>
          </div>
        </label>

        {/* Bhowali Tea & Fruit Stop */}
        <label
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            bhowaliTeaHalt
              ? 'border-[#EAA722] bg-[#FAF5EC]'
              : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
          }`}
        >
          <input
            type="checkbox"
            checked={bhowaliTeaHalt}
            onChange={(e) => setBhowaliTeaHalt(e.target.checked)}
            className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-bold text-[#541508]">Bhowali Tea &amp; Fruit Stop</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                FREE
              </span>
            </div>
            <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
              30 mins relaxation at local Kumaon pine cafe
            </span>
          </div>
        </label>

        {/* Senior Assistance */}
        <label
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            seniorAssistance
              ? 'border-[#EAA722] bg-[#FAF5EC]'
              : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
          }`}
        >
          <input
            type="checkbox"
            checked={seniorAssistance}
            onChange={(e) => setSeniorAssistance(e.target.checked)}
            className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-bold text-[#541508]">Senior Assisted Entry</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                FREE
              </span>
            </div>
            <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
              Smooth gentle drive, easy low step, and driver helps with bags
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default MountainAddons;
