import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    // Store user data
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      username: data.username,
      isAdmin: data.isAdmin
    };
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Store token separately for API requests
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check if token exists and user is still valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token && storedUser) {
      // If user exists but no token, log out
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
