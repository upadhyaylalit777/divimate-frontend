import React, { createContext, useContext, useState, useEffect } from 'react';

// JWT Token utilities with enhanced error handling
const tokenUtils = {
  setToken: (token) => {
    try {
      localStorage.setItem('authToken', token);
      console.log('Token set in localStorage:', token ? 'Present' : 'Missing');
      return true;
    } catch (error) {
      console.error('Failed to set token in localStorage:', error);
      return false;
    }
  },
  
  getToken: () => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to get token from localStorage:', error);
      return null;
    }
  },
  
  removeToken: () => {
    try {
      localStorage.removeItem('authToken');
      console.log('Token removed from localStorage');
      return true;
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error);
      return false;
    }
  },
  
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;
      console.log('Token expiry check:', { 
        expired: isExpired, 
        exp: payload.exp, 
        current: currentTime 
      });
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  },
  
  getTokenPayload: (token) => {
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing token payload:', error);
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

// Enhanced API configuration
const getAPIUrl = () => {
  // Use environment variable for production, fallback to localhost for development
  return process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_DIVIMATE_API_URL
    : 'http://localhost:4000';
};

// UPDATED: Export the API_URL for other components to use
export const API_URL = getAPIUrl();

if (!API_URL) {
  console.error("API URL is not defined. Check your environment variables.");
}

// Authentication Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Enhanced debugging function
  const addDebugInfo = (key, value) => {
    setDebugInfo(prev => ({
      ...prev,
      [key]: value,
      timestamp: new Date().toISOString()
    }));
    console.log(`Debug [${key}]:`, value);
  };
  
  useEffect(() => {
    // Check for existing token on app load
    addDebugInfo('initialLoad', 'Checking for existing token');
    
    const token = tokenUtils.getToken();
    addDebugInfo('tokenPresent', !!token);
    
    if (token) {
      addDebugInfo('tokenValue', token.substring(0, 20) + '...');
      
      if (!tokenUtils.isTokenExpired(token)) {
        const payload = tokenUtils.getTokenPayload(token);
        addDebugInfo('tokenPayload', payload);
        
        if (payload) {
          const userData = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            role: payload.role
          };
          
          addDebugInfo('settingUserFromToken', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          addDebugInfo('invalidTokenPayload', true);
        }
      } else {
        addDebugInfo('tokenExpired', true);
        tokenUtils.removeToken();
      }
    } else {
      addDebugInfo('noTokenFound', true);
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (credentials) => {
    try {
      addDebugInfo('loginAttempt', credentials.email);
      
      const response = await authService.login(credentials);
      addDebugInfo('loginResponse', { 
        success: response.success, 
        hasToken: !!response.token,
        hasUser: !!response.user 
      });
      
      if (response.success) {
        const tokenSet = tokenUtils.setToken(response.token);
        addDebugInfo('tokenSetSuccess', tokenSet);
        
        if (tokenSet) {
          setUser(response.user);
          setIsAuthenticated(true);
          addDebugInfo('loginComplete', response.user);
          return { success: true, user: response.user };
        } else {
          addDebugInfo('tokenSetFailed', true);
          return { success: false, error: 'Failed to store authentication token' };
        }
      } else {
        addDebugInfo('loginFailed', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      addDebugInfo('loginError', error.message);
      return { success: false, error: error.message };
    }
  };
  
  const register = async (userData) => {
    try {
      addDebugInfo('registerAttempt', userData.email);
      
      const response = await authService.register(userData);
      addDebugInfo('registerResponse', { 
        success: response.success, 
        hasToken: !!response.token,
        hasUser: !!response.user 
      });
      
      if (response.success) {
        const tokenSet = tokenUtils.setToken(response.token);
        addDebugInfo('tokenSetSuccess', tokenSet);
        
        if (tokenSet) {
          setUser(response.user);
          setIsAuthenticated(true);
          addDebugInfo('registerComplete', response.user);
          return { success: true, user: response.user };
        } else {
          addDebugInfo('tokenSetFailed', true);
          return { success: false, error: 'Failed to store authentication token' };
        }
      } else {
        addDebugInfo('registerFailed', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      addDebugInfo('registerError', error.message);
      return { success: false, error: error.message };
    }
  };
  
  const logout = async () => {
    try {
      await authService.logout();
      const tokenRemoved = tokenUtils.removeToken();
      addDebugInfo('logoutComplete', { tokenRemoved });
      
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      addDebugInfo('logoutError', error.message);
      return { success: false, error: error.message };
    }
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    debugInfo // Add debug info to context
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced authService with better error handling and logging
const authService = {
  login: async (credentials) => {
    try {
      console.log('API URL:', API_URL);
      console.log('Attempting login for:', credentials.email);
      
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data keys:', Object.keys(data));

      if (!response.ok) {
        console.error('Login failed with status:', response.status, data);
        throw new Error(data.error || `Login failed with status ${response.status}`);
      }

      console.log('Login response received, token present:', !!data.token);
      console.log('User data present:', !!data.user);
      
      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      console.error('Login error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('API URL:', API_URL);
      console.log('Attempting registration for:', userData.email);
      
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data keys:', Object.keys(data));

      if (!response.ok) {
        console.error('Registration failed with status:', response.status, data);
        throw new Error(data.error || `Registration failed with status ${response.status}`);
      }

      console.log('Registration response received, token present:', !!data.token);
      return { success: true, token: data.token, user: data.user };
    } catch (error) {
      console.error('Registration error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  logout: async () => {
    return Promise.resolve({ success: true });
  },
};