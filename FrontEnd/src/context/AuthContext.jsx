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
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        const userData = localStorage.getItem('user');

        if (!token) {
          setLoading(false);
          return;
        }

        if (userData) {
          // Parse stored user data
          try {
            const parsedUser = JSON.parse(userData);
            setUser({ ...parsedUser, token });
            // Check if it's first login from stored data
            if (parsedUser.firstLogin) {
              setIsFirstLogin(true);
              setForcePasswordChange(true);
            }
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            setUser({ token }); // Fallback to token only
          }
        } else if (userId) {
          // Fetch user profile using token and user ID (legacy support)
          try {
            const response = await usersAPI.getById(userId);
            const userData = { ...response, token };
            setUser(userData);
            // Store user data in localStorage for future use
            localStorage.setItem('user', JSON.stringify(response));
            if (response.role) {
              localStorage.setItem('userRole', response.role);
            }
          } catch (fetchError) {
            console.error('Failed to fetch user profile:', fetchError);
            setUser({ token }); // Fallback to token only
          }
        } else {
          setUser({ token });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Could not verify your session. Please log in again.');
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);

      if (response?.token) {
        localStorage.setItem('token', response.token);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', credentials.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }

        // Store user data if available
        if (response.user) {
          localStorage.setItem('user_id', response.user.id || response.user.user_id);
          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.user.role) {
            localStorage.setItem('userRole', response.user.role);
          }
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
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
