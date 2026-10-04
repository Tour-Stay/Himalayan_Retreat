import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
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
