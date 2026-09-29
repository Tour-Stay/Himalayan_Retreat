import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const API_URL = 'http://localhost:5000/api';

const availableAmenities = [
  'WiFi', 'Mountain View', 'Balcony', 'Room Service', 
  'Heater', 'TV', 'Geyser', 'Tea/Coffee Maker'
];

const AdminDashboard = () => {
  const { isAdminLoggedIn, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding/editing a room
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    adults: '2',
    children: '0',
    amenities: [],
  });
  const [roomImages, setRoomImages] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [roomsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/hotel/rooms`),
        axios.get(`${API_URL}/hotel/bookings`, config)
      ]);
      
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && token) {
      fetchData();
    }
  }, [isAdminLoggedIn, token]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const resetForm = () => {
    setNewRoom({
      name: '',
      description: '',
      pricePerNight: '',
      adults: '2',
      children: '0',
      amenities: [],
    });
    setRoomImages(null);
    setEditingRoomId(null);
    setIsAddingRoom(false);
  };

  const handleEditClick = (room) => {
    setNewRoom({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      adults: room.capacity?.adults?.toString() || '2',
      children: room.capacity?.children?.toString() || '0',
      amenities: room.amenities || [],
    });
    setEditingRoomId(room._id);
    setIsAddingRoom(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/hotel/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('Failed to delete room.');
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newRoom.name);
      formData.append('description', newRoom.description);
      formData.append('pricePerNight', newRoom.pricePerNight);
      
      // Send complex objects as JSON strings
      formData.append('capacity', JSON.stringify({ adults: newRoom.adults, children: newRoom.children }));
      formData.append('amenities', JSON.stringify(newRoom.amenities));

      if (roomImages) {
        for (let i = 0; i < roomImages.length; i++) {
          formData.append('images', roomImages[i]);
        }
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingRoomId) {
        // Edit existing room
        await axios.put(`${API_URL}/hotel/rooms/${editingRoomId}`, formData, config);
      } else {
        // Create new room
        await axios.post(`${API_URL}/hotel/rooms`, formData, config);
      }

      resetForm();
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to save room:', error);
      alert('Failed to save room. Check console for details.');
    } finally {
      setAddLoading(false);
    }
  };

  if (!isAdminLoggedIn) return null;
  
  if (loading) return <div className="pt-28"><Loader /></div>;

  return (
    <section className="pt-28 pb-20 px-4 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl text-text-dark">Admin Dashboard</h1>
            <p className="text-text-light text-sm">Manage Devbhoomi Retreat operations</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'rooms' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-dark'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text-dark'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl text-text-dark">All Rooms</h2>
              <button
                onClick={() => isAddingRoom ? resetForm() : setIsAddingRoom(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                {isAddingRoom ? 'Cancel' : '+ Add Room'}
              </button>
            </div>

            {/* Add/Edit Room Form */}
            {isAddingRoom && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 animate-fade-in">
                <h3 className="font-heading text-lg text-text-dark mb-4">
                  {editingRoomId ? 'Edit Room' : 'Add New Room'}
                </h3>
                <form onSubmit={handleSaveRoom} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input type="text" required value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price Per Night (₹)</label>
                      <input type="number" required value={newRoom.pricePerNight} onChange={(e) => setNewRoom({...newRoom, pricePerNight: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea required value={newRoom.description} onChange={(e) => setNewRoom({...newRoom, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="3"></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Adults Capacity</label>
                      <input type="number" required value={newRoom.adults} onChange={(e) => setNewRoom({...newRoom, adults: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Children Capacity</label>
                      <input type="number" value={newRoom.children} onChange={(e) => setNewRoom({...newRoom, children: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {availableAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded border border-gray-100">
                          <input 
                            type="checkbox" 
                            checked={newRoom.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRoom({...newRoom, amenities: [...newRoom.amenities, amenity]});
                              } else {
                                setNewRoom({...newRoom, amenities: newRoom.amenities.filter(a => a !== amenity)});
                              }
                            }}
                            className="w-4 h-4 text-secondary rounded focus:ring-secondary"
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Images {editingRoomId && <span className="text-gray-400 font-normal">(Leave blank to keep existing images)</span>}
                    </label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setRoomImages(e.target.files)} className="w-full" required={!editingRoomId} />
                  </div>

                  <div className="flex justify-end pt-2 gap-3">
                    <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg font-medium border border-gray-200 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={addLoading} className="bg-secondary text-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50">
                      {addLoading ? 'Saving...' : (editingRoomId ? 'Update Room' : 'Save Room')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Rooms List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-medium text-text-dark">Room Name</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-dark">Price/Night</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-dark">Capacity</th>
                    <th className="px-6 py-4 text-sm font-medium text-text-dark text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rooms.map(room => (
                    <tr key={room._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm text-text-dark font-medium">{room.name}</td>
                      <td className="px-6 py-4 text-sm text-text-light">₹{room.pricePerNight}</td>
                      <td className="px-6 py-4 text-sm text-text-light">{room.capacity?.adults} A, {room.capacity?.children || 0} C</td>
                      <td className="px-6 py-4 text-sm text-right space-x-3">
                        <button 
                          onClick={() => handleEditClick(room)}
                          className="text-primary hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteRoom(room._id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-text-light text-sm">No rooms added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="font-heading text-xl text-text-dark mb-6">Recent Bookings</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-sm font-medium text-text-dark">Guest</th>
                      <th className="px-6 py-4 text-sm font-medium text-text-dark">Dates</th>
                      <th className="px-6 py-4 text-sm font-medium text-text-dark">Amount</th>
                      <th className="px-6 py-4 text-sm font-medium text-text-dark">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-text-dark">{booking.guestDetails?.name}</p>
                          <p className="text-xs text-text-light">{booking.guestDetails?.email}</p>
                          <p className="text-xs text-text-light">{booking.guestDetails?.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-light whitespace-nowrap">
                          {new Date(booking.checkInDate).toLocaleDateString()} - <br/>
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-forest">₹{booking.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-text-light text-sm">No bookings yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
