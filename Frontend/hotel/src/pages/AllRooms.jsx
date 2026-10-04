import { useState, useEffect } from 'react';
import { apiClient, Loader, Container, SectionHeading, subscribeToUpdates } from '@shared';
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

    // Instant real-time sync when rooms change in Admin
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
    <div className="pt-28 pb-24 px-4 min-h-screen bg-ivory font-sans">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center mb-14">
          <span className="text-[#C5A059] text-xs font-cinzel font-semibold tracking-[0.2em] uppercase mb-3 block">
            Rooms &amp; Rates • Kasar Devi • 6,942 FT
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C2523] font-medium mb-4">
            Warm Rooms &amp; Heated Suites
          </h1>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed font-sans">
            Every room is built with natural pine wood and stone, equipped with room heaters, electric bed warmers, and private balconies overlooking 180° of the Himalayas.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-cinzel uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#7C1D23] text-[#FDFBF7] font-bold shadow-md border border-[#C5A059]/40'
                    : 'bg-[#FAF6EF] border border-[#C5A059]/30 text-[#2C2523] hover:border-[#C5A059] font-semibold'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <Loader />
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-ivory-warm rounded-3xl border border-gold/20">
            <p className="text-charcoal-muted text-base">No rooms found for this category.</p>
            <button
              onClick={() => setSelectedFilter('All')}
              className="mt-4 bg-maroon text-ivory text-xs uppercase tracking-wider px-6 py-3 rounded-full font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllRooms;
