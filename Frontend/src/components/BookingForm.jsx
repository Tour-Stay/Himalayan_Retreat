import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const BookingForm = ({ preSelectedRoom = null }) => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: preSelectedRoom || '',
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch rooms for the dropdown (only if no preSelectedRoom)
  useEffect(() => {
    if (!preSelectedRoom) {
      const fetchRooms = async () => {
        try {
          const res = await axios.get(`${API_URL}/hotel/rooms`);
          setRooms(res.data);
        } catch (error) {
          console.error('Failed to fetch rooms:', error);
        }
      };
      fetchRooms();
    }
  }, [preSelectedRoom]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(`${API_URL}/hotel/bookings`, {
        room: formData.room,
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      });

      setMessage({ text: 'Booking successful! A confirmation email has been sent.', type: 'success' });
      setFormData({
        room: preSelectedRoom || '',
        name: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
      });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage({ text: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Room Selector (only if not pre-selected) */}
      {!preSelectedRoom && (
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Select Room</label>
          <select
            name="room"
            value={formData.room}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          >
            <option value="">Choose a room...</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} — ₹{room.pricePerNight?.toLocaleString()}/night
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Check-in</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Check-out</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            min={formData.checkInDate || today}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          />
        </div>
      </div>

      {/* Guest Details */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1.5">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          />
        </div>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-forest border border-green-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary text-primary py-3.5 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Booking...' : 'Reserve Your Stay'}
      </button>
    </form>
  );
};

export default BookingForm;
