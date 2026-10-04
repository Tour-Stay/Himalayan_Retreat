import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, SiteSettingsProvider } from '@shared';
import { ToastProvider } from './components/Toast';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Staff Authentication */}
              <Route path="/" element={<AdminLogin />} />
              <Route path="/login" element={<AdminLogin />} />

              {/* Desk Operations & Management Direct Routes */}
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="rooms" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel-bookings"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="hotel-bookings" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/travel-bookings"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="travel-bookings" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tours"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="tours" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="reviews" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/yield"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="yield" />
                  </ProtectedRoute>
                }
              />

              {/* Headless CMS & Global Settings Routes */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Navigate to="/settings/company" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/company"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="company" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/fleet"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="fleet" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/routes"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="routes" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/announcements"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="announcements" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/landing-cms"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="landing-cms" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/policies"
                element={
                  <ProtectedRoute>
                    <AdminDashboard tab="policies" />
                  </ProtectedRoute>
                }
              />

              {/* Unified Dashboard Route & Dynamic Tab Param */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navigate to="/rooms" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/:tabId"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<Navigate to="/rooms" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}

export default App;

