import { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import { mockRooms } from '../data/mockRooms';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AllRooms = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms`);
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
        }
      } catch (error) {
        // Fallback to mockRooms
        setRooms(mockRooms);
      }
    };
    fetchRooms();
  }, []);

  const filterOptions = ['All', 'Snow Peak View', 'Chalet', 'Family Villa', 'Attic Suite'];

  const filteredRooms = rooms.filter(room => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Snow Peak View') return (room.view || '').toLowerCase().includes('peak') || (room.view || '').toLowerCase().includes('snow');
    if (selectedFilter === 'Chalet') return (room.name || '').toLowerCase().includes('chalet');
    if (selectedFilter === 'Family Villa') return (room.name || '').toLowerCase().includes('family') || (room.capacity?.adults > 2);
    if (selectedFilter === 'Attic Suite') return (room.name || '').toLowerCase().includes('attic');
    return true;
  });

  return (
    <section className="pt-32 pb-24 px-4 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-secondary text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-3 block">
            Himalayan Accommodations
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl text-text-dark font-semibold mb-4">
            Heated Mountain Suites
          </h1>
          <p className="text-text-light text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Every suite is thoughtfully crafted with natural pine, heated interiors, and panoramic balconies overlooking 180° of the Himalayas.
          </p>

          {/* Filter Pills with Luxury Hover State */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedFilter === filter
                    ? 'btn-primary-luxury text-secondary border border-secondary/40 shadow-md font-bold'
                    : 'btn-outline-luxury text-text-dark/75 hover:border-secondary font-semibold'
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
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <p className="text-text-light text-base">No rooms found for this category.</p>
            <button
              onClick={() => setSelectedFilter('All')}
              className="mt-4 btn-primary-luxury text-xs uppercase tracking-wider px-6 py-3 rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllRooms;
