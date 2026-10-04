import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@shared';

export const ProtectedRoute = ({ children }) => {
  const { isAdminLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isAdminLoggedIn) {
    // Preserve intended destination so user is redirected back after logging in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
