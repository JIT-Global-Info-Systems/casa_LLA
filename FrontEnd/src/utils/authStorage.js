/**
 * Centralized authentication storage utility
 * Handles conditional storage based on "Remember Me" preference
 */

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'user_id';
const USER_KEY = 'user';
const USER_ROLE_KEY = 'userRole';
const USER_ACCESS_KEY = 'userAccess';
const REMEMBER_ME_KEY = 'rememberMe';
const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

/**
 * Get storage instance based on remember preference
 * @param {boolean} persistent - true for localStorage, false for sessionStorage
 * @returns {Storage} - localStorage or sessionStorage
 */
const getStorage = (persistent = false) => {
  return persistent ? localStorage : sessionStorage;
};

/**
 * Check if user has remember me enabled by checking if token exists in localStorage
 * @returns {boolean}
 */
const isRememberMeEnabled = () => {
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
};

/**
 * Get token from appropriate storage (localStorage or sessionStorage)
 * @returns {string|null}
 */
const getToken = () => {
  // Check localStorage first (remember me case)
  const persistentToken = localStorage.getItem(TOKEN_KEY);
  if (persistentToken) {
    return persistentToken;
  }
  
  // Check sessionStorage (session-only case)
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  return sessionToken;
};

/**
 * Store token in appropriate storage based on remember preference
 * @param {string} token 
 * @param {boolean} rememberMe 
 */
const setToken = (token, rememberMe = false) => {
  const storage = getStorage(rememberMe);
  storage.setItem(TOKEN_KEY, token);
  
  // Always store remember preference in localStorage for consistency
  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
};

/**
 * Get user ID from appropriate storage
 * @returns {string|null}
 */
const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);
};

/**
 * Store user ID in appropriate storage based on current token location
 * @param {string} userId 
 */
const setUserId = (userId) => {
  const rememberMe = isRememberMeEnabled();
  const storage = getStorage(rememberMe);
  storage.setItem(USER_ID_KEY, userId);
};

/**
 * Get user data from appropriate storage
 * @returns {string|null}
 */
const getUserData = () => {
  return localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
};

/**
 * Store user data in appropriate storage based on current token location
 * @param {object} userData 
 */
const setUserData = (userData) => {
  const rememberMe = isRememberMeEnabled();
  const storage = getStorage(rememberMe);
  storage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Get user role from appropriate storage
 * @returns {string|null}
 */
const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY) || sessionStorage.getItem(USER_ROLE_KEY);
};

/**
 * Store user role in appropriate storage based on current token location
 * @param {string} role 
 */
const setUserRole = (role) => {
  const rememberMe = isRememberMeEnabled();
  const storage = getStorage(rememberMe);
  storage.setItem(USER_ROLE_KEY, role);
};

/**
 * Get user access from appropriate storage
 * @returns {array|null}
 */
const getUserAccess = () => {
  const persistentAccess = localStorage.getItem(USER_ACCESS_KEY);
  if (persistentAccess) {
    try {
      return JSON.parse(persistentAccess);
    } catch (error) {
      console.error('Failed to parse user access from localStorage:', error);
      return null;
    }
  }
  
  const sessionAccess = sessionStorage.getItem(USER_ACCESS_KEY);
  if (sessionAccess) {
    try {
      return JSON.parse(sessionAccess);
    } catch (error) {
      console.error('Failed to parse user access from sessionStorage:', error);
      return null;
    }
  }
  
  return null;
};

/**
 * Store user access in appropriate storage based on current token location
 * @param {array} userAccess 
 */
const setUserAccess = (userAccess) => {
  const rememberMe = isRememberMeEnabled();
  const storage = getStorage(rememberMe);
  storage.setItem(USER_ACCESS_KEY, JSON.stringify(userAccess));
};

/**
 * Get remembered email (always from localStorage)
 * @returns {string|null}
 */
const getRememberedEmail = () => {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
};

/**
 * Store remembered email (always in localStorage)
 * @param {string} email 
 */
const setRememberedEmail = (email) => {
  localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
};

/**
 * Remove remembered email
 */
const removeRememberedEmail = () => {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
};

/**
 * Clear all authentication data from both storages
 */
const clearAllAuthData = () => {
  // Clear from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_ACCESS_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  
  // Clear from sessionStorage
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_ROLE_KEY);
  sessionStorage.removeItem(USER_ACCESS_KEY);
};

/**
 * Store complete auth session
 * @param {object} authData - { token, user, rememberMe, email }
 */
const storeAuthSession = (authData) => {
  const { token, user, rememberMe = false, email } = authData;
  
  // Store token with appropriate persistence
  setToken(token, rememberMe);
  
  // Store user data
  if (user) {
    if (user.id || user.user_id) {
      setUserId(user.id || user.user_id);
    }
    setUserData(user);
    if (user.role) {
      setUserRole(user.role);
    }
  }
  
  // Handle email remembering
  if (rememberMe && email) {
    setRememberedEmail(email);
  } else {
    removeRememberedEmail();
  }
};

export {
  getToken,
  setToken,
  getUserId,
  setUserId,
  getUserData,
  setUserData,
  getUserRole,
  setUserRole,
  getUserAccess,
  setUserAccess,
  getRememberedEmail,
  setRememberedEmail,
  removeRememberedEmail,
  clearAllAuthData,
  storeAuthSession,
  isRememberMeEnabled
};