import { clearAllAuthData } from './src/utils/authStorage.js';

// Clear all auth-related data from both localStorage and sessionStorage
clearAllAuthData();

console.log('All authentication data cleared from both localStorage and sessionStorage');
console.log('Please refresh the page and log in again');
