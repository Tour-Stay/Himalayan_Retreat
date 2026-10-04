import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const getConciseDesc = (desc) => {
  if (!desc) return '';
  const firstSentence = desc.split('.')[0];
  return firstSentence ? firstSentence.trim() + '.' : desc;
};

const SuiteShowcase = ({ onOpenQuickView, rooms }) => {
  const navigate = useNavigate();
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
    <section id="rooms" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#073125] text-white relative overflow-hidden border-b border-white/10">
      <div className="max-w-[1560px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-2.5 shadow-xs">
              <SparklesIcon className="w-3 h-3 text-[#073125]" />
              <span>HEATED SUITES • 6,942 FT</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight leading-tight">
              Warm Mountain Chalets &amp; Suites
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-white/85 text-sm sm:text-[15px] max-w-md font-light leading-relaxed md:text-right">
              Heated rooms with private balconies facing Trishul &amp; Nanda Devi peaks.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#C9F24D] font-bold hover:underline"
            >
              <span>Explore All Rooms &amp; Rates</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Suite Selection Tabs — 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {suiteList.slice(0, 4).map((suite, idx) => (
            <button
              key={suite._id}
              onClick={() => handleTabChange(idx)}
              className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-center ${
                activeSuiteIndex === idx
                  ? 'bg-[#C9F24D] text-[#073125] shadow-lg border border-[#C9F24D] font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <span className={`font-mono text-xs font-bold ${activeSuiteIndex === idx ? 'text-[#073125]/75' : 'text-[#C9F24D]'}`}>
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
            <div className="relative h-[290px] sm:h-[350px] lg:h-[400px] rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-white/15 group">
              <img
                src={images[activeImgIndex] || images[0]}
                alt={activeSuite.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-black/65 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                  <SnowIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                  <span>{activeSuite.view || '180° Snow Peak View'}</span>
                </span>
                {activeSuite.badge && (
                  <span className="bg-[#C9F24D] text-[#073125] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md font-mono">
                    {activeSuite.badge}
                  </span>
                )}
              </div>

              {/* Bottom Specs Pill */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 font-mono text-[11px] sm:text-xs">
                    {activeSuite.area || '42 m²'}
                  </span>
                  <span className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <BedIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                    <span>{activeSuite.bedType || 'King Bed'}</span>
                  </span>
                </div>

                <span className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
                  <UsersIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                  <span>{activeSuite.capacity?.adults || 2} Adults</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`h-14 w-20 sm:h-16 sm:w-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImgIndex === i
                        ? 'border-[#C9F24D] scale-102 shadow-md'
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
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0C241D] p-6 sm:p-7 lg:p-8 rounded-3xl border border-white/15 shadow-xl text-white">
            <div>
              <span className="text-[#C9F24D] text-[11px] uppercase tracking-widest font-bold block mb-1.5 font-mono">
                PINE CHALET • 6,942 FEET
              </span>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[28px] font-medium text-white mb-2.5 leading-snug">
                {activeSuite.name}
              </h3>
              <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed font-light mb-5">
                {getConciseDesc(activeSuite.description)}
              </p>

              {/* Features List — 2 Columns */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 pb-5 border-b border-white/15">
                {(activeSuite.amenities || []).slice(0, 4).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D] flex-shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wider block font-mono mb-0.5">
                    Direct Rate
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    ₹{activeSuite.pricePerNight?.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/65 ml-1 font-light">/ night</span>
                </div>
                <span className="text-[11px] sm:text-xs text-[#073125] bg-[#C9F24D] px-3 py-1 rounded-full font-bold">
                  Hot Breakfast Included
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onOpenQuickView ? onOpenQuickView(activeSuite) : navigate(`/room/${activeSuite._id}`)}
                  className="px-4 py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/book?room=${activeSuite._id}`)}
                  className="px-4 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-[#C9F24D] hover:bg-[#b8e23f] text-[#073125] transition-all shadow-md flex items-center justify-center gap-1.5 group cursor-pointer"
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
