import { useState, useEffect } from 'react';
import { apiClient, Loader, Container, subscribeToUpdates } from '@shared';
import RoomCard from '../components/RoomCard';
import { mockRooms } from '../data/mockRooms';

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
    });

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
      {/* 1. Green Header Banner */}
      <section className="bg-[#073125] text-white pt-24 pb-14 px-4 border-b border-white/10">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
              ROOMS &amp; RATES • 6,942 FT
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mb-3 text-white">
              Our Rooms &amp; Rates
            </h1>
            <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed">
              Every room has room heaters, electric bed warmers, 24-hour hot water, and a private balcony overlooking snow peaks.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-md'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 font-medium'
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
