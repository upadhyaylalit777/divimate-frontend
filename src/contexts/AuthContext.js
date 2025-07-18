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
      } else {
        return { success: false, error: response.error };
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
      } else {
        return { success: false, error: response.error };
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

const API_URL = 'http://localhost:4000';

const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.error || 'Registration failed');
      }

      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    // No backend endpoint for logout, so we just resolve
    return Promise.resolve({ success: true });
  },
};