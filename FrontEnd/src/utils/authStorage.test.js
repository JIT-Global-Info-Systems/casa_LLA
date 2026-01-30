/**
 * Test file to demonstrate the Remember Me functionality
 * This would typically be run with a testing framework like Jest
 */

import { 
  getToken, 
  setToken, 
  clearAllAuthData, 
  storeAuthSession,
  isRememberMeEnabled 
} from './authStorage.js';

// Mock localStorage and sessionStorage for testing
const mockLocalStorage = {};
const mockSessionStorage = {};

global.localStorage = {
  getItem: (key) => mockLocalStorage[key] || null,
  setItem: (key, value) => { mockLocalStorage[key] = value; },
  removeItem: (key) => { delete mockLocalStorage[key]; },
  clear: () => { Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]); }
};

global.sessionStorage = {
  getItem: (key) => mockSessionStorage[key] || null,
  setItem: (key, value) => { mockSessionStorage[key] = value; },
  removeItem: (key) => { delete mockSessionStorage[key]; },
  clear: () => { Object.keys(mockSessionStorage).forEach(key => delete mockSessionStorage[key]); }
};

// Test cases
console.log('Testing Remember Me functionality...\n');

// Test 1: Remember Me = true (should use localStorage)
console.log('Test 1: Remember Me = true');
clearAllAuthData();
setToken('test-token-persistent', true);
console.log('Token stored with rememberMe=true');
console.log('localStorage has token:', !!mockLocalStorage.token);
console.log('sessionStorage has token:', !!mockSessionStorage.token);
console.log('getToken() returns:', getToken());
console.log('isRememberMeEnabled():', isRememberMeEnabled());
console.log('');

// Test 2: Remember Me = false (should use sessionStorage)
console.log('Test 2: Remember Me = false');
clearAllAuthData();
setToken('test-token-session', false);
console.log('Token stored with rememberMe=false');
console.log('localStorage has token:', !!mockLocalStorage.token);
console.log('sessionStorage has token:', !!mockSessionStorage.token);
console.log('getToken() returns:', getToken());
console.log('isRememberMeEnabled():', isRememberMeEnabled());
console.log('');

// Test 3: Complete auth session with Remember Me = true
console.log('Test 3: Complete auth session with Remember Me = true');
clearAllAuthData();
storeAuthSession({
  token: 'complete-session-token',
  user: { id: '123', name: 'Test User', role: 'admin' },
  rememberMe: true,
  email: 'test@example.com'
});
console.log('Complete session stored with rememberMe=true');
console.log('localStorage has token:', !!mockLocalStorage.token);
console.log('sessionStorage has token:', !!mockSessionStorage.token);
console.log('localStorage has user:', !!mockLocalStorage.user);
console.log('sessionStorage has user:', !!mockSessionStorage.user);
console.log('');

// Test 4: Complete auth session with Remember Me = false
console.log('Test 4: Complete auth session with Remember Me = false');
clearAllAuthData();
storeAuthSession({
  token: 'complete-session-token',
  user: { id: '123', name: 'Test User', role: 'admin' },
  rememberMe: false,
  email: 'test@example.com'
});
console.log('Complete session stored with rememberMe=false');
console.log('localStorage has token:', !!mockLocalStorage.token);
console.log('sessionStorage has token:', !!mockSessionStorage.token);
console.log('localStorage has user:', !!mockLocalStorage.user);
console.log('sessionStorage has user:', !!mockSessionStorage.user);
console.log('');

console.log('All tests completed! ✅');
console.log('\nExpected behavior:');
console.log('- Remember Me = true: Data stored in localStorage (persists after browser close)');
console.log('- Remember Me = false: Data stored in sessionStorage (cleared when browser closes)');