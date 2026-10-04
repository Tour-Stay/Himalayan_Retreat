import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext, apiClient } from '@shared';

export const useAdminData = () => {
  const { isAdminLoggedIn } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [travelBookings, setTravelBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const [roomsRes, hotelRes, travelRes, toursRes, reviewsRes] = await Promise.all([
        // Use /hotel/rooms-admin to get all rooms (including disabled ones)
        apiClient.get('/hotel/rooms-admin').catch((err) => {
          console.warn('Failed to fetch admin rooms, falling back to public rooms:', err);
          return apiClient.get('/hotel/rooms').catch(() => ({ data: [] }));
        }),
        apiClient.get('/hotel/bookings').catch((err) => {
          console.warn('Failed to fetch hotel bookings:', err);
          return { data: [] };
        }),
        apiClient.get('/travel/bookings').catch((err) => {
          console.warn('Failed to fetch travel bookings:', err);
          return { data: [] };
        }),
        apiClient.get('/travel/tours').catch((err) => {
          console.warn('Failed to fetch tours:', err);
          return { data: [] };
        }),
        apiClient.get('/travel/reviews/admin').catch((err) => {
          console.warn('Failed to fetch admin reviews:', err);
          return { data: [] };
        }),
      ]);

      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
      setHotelBookings(Array.isArray(hotelRes.data) ? hotelRes.data : []);
      setTravelBookings(Array.isArray(travelRes.data) ? travelRes.data : []);
      setTours(Array.isArray(toursRes.data) ? toursRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived KPI statistics
  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.isAvailable).length,
    disabledRooms: rooms.filter((r) => !r.isAvailable).length,
    hotelBookingsCount: hotelBookings.length,
    pendingHotelBookings: hotelBookings.filter((b) => b.status === 'pending').length,
    travelBookingsCount: travelBookings.length,
    pendingTravelBookings: travelBookings.filter((b) => b.status === 'pending').length,
    toursCount: tours.length,
    reviewsCount: reviews.length,
    pendingReviewsCount: reviews.filter((r) => !r.isApproved).length,
  };

  return {
    rooms,
    setRooms,
    hotelBookings,
    setHotelBookings,
    travelBookings,
    setTravelBookings,
    tours,
    setTours,
    reviews,
    setReviews,
    stats,
    loading,
    error,
    refreshData: fetchData,
  };
};

export default useAdminData;
