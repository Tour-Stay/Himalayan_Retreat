import { useState, useEffect } from 'react';
import { apiClient, Loader, Container, SectionHeading } from '@shared';
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
  }, []);

  const filterOptions = ['All', 'Snow Peak View', 'Chalet', 'Family Villa', 'Attic Suite'];

  const filteredRooms = rooms.filter((room) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Snow Peak View')
      return (
        (room.view || '').toLowerCase().includes('peak') ||
        (room.view || '').toLowerCase().includes('snow')
      );
    if (selectedFilter === 'Chalet') return (room.name || '').toLowerCase().includes('chalet');
    if (selectedFilter === 'Family Villa')
      return (room.name || '').toLowerCase().includes('family') || room.capacity?.adults > 2;
    if (selectedFilter === 'Attic Suite') return (room.name || '').toLowerCase().includes('attic');
    return true;
  });

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen bg-ivory font-sans">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 block font-mono">
            Kasar Devi Accommodations • 6,942 FT
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal font-medium mb-4">
            Heated Mountain Suites
          </h1>
          <p className="text-charcoal-muted text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Every suite is thoughtfully crafted with natural pine, heated interiors, and panoramic balconies overlooking 180° of the sacred Himalayas.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${selectedFilter === filter
                    ? 'bg-maroon text-ivory font-bold shadow-md border border-gold/40'
                    : 'bg-ivory-warm border border-gold/25 text-charcoal/80 hover:border-gold/50 font-semibold'
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
