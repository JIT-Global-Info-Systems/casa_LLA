import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      // Parse stored user data
      try {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, token });
        // Check if it's first login from stored data
        if (parsedUser.firstLogin) {
          setIsFirstLogin(true);
          setForcePasswordChange(true);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setUser({ token }); // Fallback to token only
      }
      setLoading(false);
    } else if (token && userId) {
      // Fetch user profile using token and user ID (legacy support)
      const fetchUserProfile = async () => {
        try {
          console.log('Fetching user profile for ID:', userId);
          const response = await usersAPI.getById(userId);
          console.log('User profile response:', response);
          const userData = { ...response, token };
          setUser(userData);
          // Store user data in localStorage for future use
          localStorage.setItem('user', JSON.stringify(response));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUser({ token }); // Fallback to token only
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else if (token) {
      setUser({ token });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);

      if (response?.token) {
        localStorage.setItem('token', response.token);

        // Store user data if available
        if (response.user) {
          localStorage.setItem('user_id', response.user.id || response.user.user_id);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser({ ...response.user, token: response.token });

          // Check if it's first login
          if (response.user.firstLogin) {
            setIsFirstLogin(true);
            setForcePasswordChange(true);
          } else {
            setIsFirstLogin(false);
            setForcePasswordChange(false);
          }
        } else {
          setUser({ token: response.token });
          setIsFirstLogin(false);
          setForcePasswordChange(false);
        }
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      return await authAPI.register(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    setIsFirstLogin(false);
    setForcePasswordChange(false);
  };

  const markPasswordChanged = () => {
    setIsFirstLogin(false);
    setForcePasswordChange(false);
    // Update stored user data
    if (user) {
      const updatedUser = { ...user, firstLogin: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        markPasswordChanged,
        isFirstLogin,
        forcePasswordChange,
        isAuthenticated: Boolean(user),
        userRole: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
