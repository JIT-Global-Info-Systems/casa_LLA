import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (token && userId) {
      // Fetch user profile using token and user ID
      const fetchUserProfile = async () => {
        try {
          console.log('Fetching user profile for ID:', userId);
          const response = await usersAPI.getById(userId);
          console.log('User profile response:', response);
          setUser({ ...response, token });
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
      const response = await usersAPI.login(credentials);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user ?? { token: response.token });
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
      return await usersAPI.register(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
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
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
