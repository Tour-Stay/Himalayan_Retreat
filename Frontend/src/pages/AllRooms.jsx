import { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';

const API_URL = 'http://localhost:5000/api';

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms`);
        setRooms(res.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-14">
          <p className="text-secondary text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Our Accommodations
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl text-text-dark mb-4">
            Rooms & Suites
          </h1>
          <p className="text-text-light text-lg max-w-xl mx-auto">
            Every room opens to a view. Choose the perfect space for your mountain escape.
          </p>
        </div>

        {/* Room Grid */}
        {loading ? (
          <Loader />
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-light text-lg">No rooms available at the moment. Please check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllRooms;
