import React, { createContext, useContext, useState, useEffect } from 'react';

// JWT Token utilities
const tokenUtils = {
  setToken: (token) => {
    window.authToken = token;
  },
  
  getToken: () => {
    return window.authToken || null;
  },
  
  removeToken: () => {
    window.authToken = null;
  },
  
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
  
  getTokenPayload: (token) => {
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }
};

// Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for existing token on app load
    const token = tokenUtils.getToken();
    if (token && !tokenUtils.isTokenExpired(token)) {
      const payload = tokenUtils.getTokenPayload(token);
      if (payload) {
        setUser({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role
        });
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        tokenUtils.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        tokenUtils.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = async () => {
    try {
      await authService.logout();
      tokenUtils.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API service (replace with your actual API)
const authService = {
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
          const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzM5NzQzMjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
          
          resolve({
            success: true,
            token: mockToken,
            user: {
              id: 1,
              name: 'John Doe',
              email: 'admin@example.com',
              role: 'admin'
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3Mzk3NDMyMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
          
          resolve({
            success: true,
            token: mockToken,
            user: {
              id: 2,
              name: userData.name,
              email: userData.email,
              role: 'user'
            }
          });
        } else {
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  },
  
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};