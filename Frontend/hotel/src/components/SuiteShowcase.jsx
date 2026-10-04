import { useState } from 'react';
import { BedIcon, SnowIcon, ArrowUpRightIcon, SparklesIcon, CheckCircleIcon, UsersIcon } from '@shared';
import { mockRooms } from '../data/mockRooms';
import { snowViewSuiteImg } from '@shared';

const getShortName = (name) => {
  if (name.includes('Nanda Devi') || name.includes('Panoramic')) return 'Snow View Suite';
  if (name.includes('Cedar') || name.includes('Family')) return 'Family Chalet';
  if (name.includes('Attic')) return 'Attic Glass Suite';
  if (name.includes('Trishul')) return 'Luxury Terrace Suite';
  return name;
};

const SuiteShowcase = ({ onSelectSuite, onOpenQuickView, rooms }) => {
  const suiteList = (rooms && rooms.length > 0) ? rooms : mockRooms;
  const [activeSuiteIndex, setActiveSuiteIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const activeSuite = suiteList[activeSuiteIndex] || suiteList[0];
  const images = activeSuite?.imageURLs && activeSuite.imageURLs.length > 0
    ? activeSuite.imageURLs
    : [snowViewSuiteImg];

  const handleTabChange = (index) => {
    setActiveSuiteIndex(index);
    setActiveImgIndex(0);
  };

  return (
    <section id="rooms" className="py-10 sm:py-14 px-4 sm:px-6 bg-[#FDFBF7] relative overflow-hidden border-b border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header (Compact Editorial Luxury) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2.5 border border-[#C5A059]/30 font-cinzel">
              <SparklesIcon className="w-3 h-3 text-[#C5A059]" />
              <span>Warm Heated Rooms</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2C2523] font-medium tracking-tight leading-tight">
              Warm Rooms with Snow Peak Views
            </h2>
          </div>
          <p className="text-[#5C5350] text-xs sm:text-sm max-w-md font-normal leading-relaxed">
            Every room is built with natural pine wood and stone, equipped with room heaters, warm electric bed warmers, and private balconies overlooking Trishul and Nanda Devi peaks.
          </p>
        </div>

        {/* Suite Selection Tabs — 4-Column Responsive Grid (No horizontal overflow or scrollbar) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {suiteList.slice(0, 4).map((suite, idx) => (
            <button
              key={suite._id}
              onClick={() => handleTabChange(idx)}
              className={`px-3 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-center ${
                activeSuiteIndex === idx
                  ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-md scale-[1.01] border border-[#C5A059]/40'
                  : 'bg-[#FAF6EF] text-[#2C2523] hover:bg-[#FDFBF7] hover:text-[#7C1D23] border border-[#C5A059]/20'
              }`}
            >
              <span className="font-numeral text-[#C5A059] text-[11px] font-bold">
                0{idx + 1}.
              </span>
              <span className="truncate">{getShortName(suite.name)}</span>
            </button>
          ))}
        </div>

        {/* Split Editorial Suite Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Imagery */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative h-[260px] sm:h-[300px] lg:h-[350px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-[#FAF6EF] border border-[#C5A059]/30 group">
              <img
                src={images[activeImgIndex] || images[0]}
                alt={activeSuite.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/75 via-transparent to-transparent"></div>

              {/* Floating Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                <span className="bg-[#1C1817]/80 backdrop-blur-md text-[#FDFBF7] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#C5A059]/40 flex items-center gap-1.5 shadow-md">
                  <SnowIcon className="w-3 h-3 text-[#C5A059]" />
                  <span>{activeSuite.view || '180° Snow Peak View'}</span>
                </span>
                {activeSuite.badge && (
                  <span className="bg-[#7C1D23] text-[#FDFBF7] text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-[#C5A059]/30">
                    {activeSuite.badge}
                  </span>
                )}
              </div>

              {/* Bottom Specs Pill */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[#FDFBF7] text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1C1817]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C5A059]/30 font-numeral font-bold text-[11px]">
                    {activeSuite.area || '42 m²'}
                  </span>
                  <span className="bg-[#1C1817]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C5A059]/30 flex items-center gap-1.5 text-[11px]">
                    <BedIcon className="w-3 h-3 text-[#C5A059]" />
                    <span>{activeSuite.bedType || 'King Bed'}</span>
                  </span>
                </div>

                <span className="bg-[#1C1817]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C5A059]/30 flex items-center gap-1.5 font-numeral text-[11px]">
                  <UsersIcon className="w-3 h-3 text-[#C5A059]" />
                  <span>{activeSuite.capacity?.adults || 2} Adults</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImgIndex === i
                        ? 'border-[#7C1D23] scale-102 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF6EF] p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-[#C5A059]/35 shadow-md">
            <div>
              <span className="text-[#C5A059] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold block mb-1 font-cinzel">
                Stay Warm at 6,942 Feet
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2523] mb-2 leading-snug">
                {activeSuite.name}
              </h3>
              <p className="text-[#5C5350] text-xs sm:text-sm leading-relaxed font-normal mb-4 line-clamp-3">
                {activeSuite.description}
              </p>

              {/* Features List — 2 Columns */}
              <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-[#C5A059]/20">
                {(activeSuite.amenities || []).slice(0, 4).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#2C2523]">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] text-[#6B615E] uppercase tracking-wider block font-sans">
                    Price per Night
                  </span>
                  <span className="font-numeral text-2xl sm:text-3xl font-bold text-[#7C1D23]">
                    ₹{activeSuite.pricePerNight?.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B615E] ml-1 font-light">/ night</span>
                </div>
                <span className="text-[11px] text-[#2C2523] bg-[#FDFBF7] border border-[#C5A059]/30 px-3 py-1 rounded-full font-medium">
                  Free Breakfast Included
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onOpenQuickView && onOpenQuickView(activeSuite)}
                  className="px-3 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FDFBF7] text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#FAF6EF] transition-all cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    if (onSelectSuite) onSelectSuite(activeSuite._id);
                    const bookEl = document.getElementById('book');
                    if (bookEl) bookEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md flex items-center justify-center gap-1 group cursor-pointer"
                >
                  <span>Book Room</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteShowcase;
