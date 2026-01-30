import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../services/api';
import { 
  getToken, 
  getUserId, 
  getUserData, 
  getUserRole,
  clearAllAuthData,
  storeAuthSession,
  isRememberMeEnabled,
  getRememberedEmail
} from '../utils/authStorage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token validation helper
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  // Clear session helper
  const clearSession = () => {
    clearAllAuthData();
    setUser(null);
    setError(null);
    setIsFirstLogin(false);
    setForcePasswordChange(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken(); // Check both localStorage and sessionStorage
        const userId = getUserId();
        const userData = getUserData();

        if (!token) {
          setLoading(false);
          return;
        }

        // Validate token expiration
        if (isTokenExpired(token)) {
          console.log('Token expired during initialization');
          clearSession();
          setError('Your session has expired. Please log in again.');
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
            // Try to fetch user data if parsing fails
            if (userId) {
              try {
                const response = await usersAPI.getById(userId);
                const userData = { ...response, token };
                setUser(userData);
                storeAuthSession({ user: response, rememberMe: isRememberMeEnabled() });
              } catch (fetchError) {
                console.error('Failed to fetch user profile:', fetchError);
                // If we can't get user data but token is valid, keep minimal user
                setUser({ token });
              }
            } else {
              setUser({ token });
            }
          }
        } else if (userId) {
          // Fetch user profile using token and user ID (legacy support)
          try {
            const response = await usersAPI.getById(userId);
            const userData = { ...response, token };
            setUser(userData);
            // Store user data for future use
            storeAuthSession({ user: response, rememberMe: isRememberMeEnabled() });
          } catch (fetchError) {
            console.error('Failed to fetch user profile:', fetchError);
            // If token is expired, this will be caught by API layer
            if (fetchError.message.includes('session has expired')) {
              clearSession();
              setError('Your session has expired. Please log in again.');
            } else {
              setUser({ token }); // Fallback to token only
            }
          }
        } else {
          setUser({ token });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (error.message.includes('session has expired')) {
          clearSession();
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Could not verify your session. Please log in again.');
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };

    // Listen for logout events from API layer
    const handleLogout = () => {
      clearSession();
      setError('Your session has expired. Please log in again.');
    };

    window.addEventListener('auth:logout', handleLogout);
    initAuth();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Periodic token validation
  useEffect(() => {
    if (!user?.token) return;

    const validateToken = () => {
      if (isTokenExpired(user.token)) {
        console.log('Token expired during periodic check');
        clearSession();
        setError('Your session has expired. Please log in again.');
      }
    };

    // Check token every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user?.token]);

  const login = async (credentials, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);

      if (response?.token) {
        // Validate the new token
        if (isTokenExpired(response.token)) {
          throw new Error('Received expired token from server');
        }

        // Store complete auth session with proper persistence
        storeAuthSession({
          token: response.token,
          user: response.user,
          rememberMe,
          email: credentials.email
        });

        // Set user state
        if (response.user) {
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
    clearAllAuthData();
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
      storeAuthSession({ user: updatedUser, rememberMe: isRememberMeEnabled() });
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
        isAuthenticated: Boolean(user?.token && !isTokenExpired(user.token)),
        userRole: user?.role,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;