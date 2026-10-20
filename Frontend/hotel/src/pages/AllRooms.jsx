import { useState, useEffect } from 'react';
import { apiClient, Loader, Container, subscribeToUpdates } from '@shared';
import RoomCard from '../components/RoomCard';
import { mockRooms } from '../data/mockRooms';

import mountainViewImg from '@shared/assets/images/mountain-view.jpg';

const AllRooms = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/hotel/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
        }
      } catch (error) {
        setRooms(mockRooms);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();

    const unsubscribe = subscribeToUpdates('rooms', () => {
      fetchRooms();
    }, 60 * 1000);

    return () => {
      unsubscribe();
    };
  }, []);

  const filterOptions = ['All', 'Snow Peak View', 'Family Chalet', 'Attic Suite'];

  const filteredRooms = rooms.filter((room) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Snow Peak View')
      return (
        (room.view || '').toLowerCase().includes('peak') ||
        (room.view || '').toLowerCase().includes('snow')
      );
    if (selectedFilter === 'Family Chalet')
      return (room.name || '').toLowerCase().includes('chalet') || (room.name || '').toLowerCase().includes('family') || room.capacity?.adults > 2;
    if (selectedFilter === 'Attic Suite') return (room.name || '').toLowerCase().includes('attic');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7] font-sans">
      {/* 1. Mountain View Header Banner */}
      <section className="relative text-white pt-28 pb-16 px-4 border-b border-white/10 overflow-hidden bg-[#073125]">
        {/* Mountain View Background Image & Ambient Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src={mountainViewImg}
            alt="Himalayan Mountain View at Kasar Devi"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.06]"
          />
          {/* Delicate hint of brand green while keeping mountain peaks clear */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#073125]/45 via-black/15 to-[#073125]/50"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <Container size="lg" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-md backdrop-blur-xs">
              ROOMS &amp; RATES • 6,942 FT
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mb-3 text-white drop-shadow-md">
              Our Rooms &amp; Rates
            </h1>
            <p className="text-[#FAF5EC]/90 text-sm sm:text-base font-light leading-relaxed drop-shadow">
              Every room has room heaters, electric bed warmers, 24-hour hot water, and a private balcony overlooking snow peaks.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-xs ${
                    selectedFilter === filter
                      ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-lg scale-102'
                      : 'bg-[#073125]/60 border border-white/25 text-white hover:bg-white/20 font-medium'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Room Grid Section */}
      <section className="py-12 sm:py-16 px-4">
        <Container size="lg">
          {loading ? (
            <Loader />
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#073125]/10 max-w-md mx-auto p-8 shadow-xs">
              <p className="text-[#073125]/70 text-base">No rooms found for this category.</p>
              <button
                onClick={() => setSelectedFilter('All')}
                className="mt-4 bg-[#073125] text-white hover:bg-[#12433B] text-xs uppercase tracking-wider px-6 py-2.5 rounded-full font-semibold transition cursor-pointer"
              >
                Show All Rooms
              </button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default AllRooms;
