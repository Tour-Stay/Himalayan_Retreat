import { createContext, useState, useEffect } from 'react';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      return storedToken;
    }
    localStorage.removeItem('token');
    return null;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAdminLoggedIn(true);
    } else {
      localStorage.removeItem('token');
      setIsAdminLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    const handleAuthExpired = () => setToken(null);
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
