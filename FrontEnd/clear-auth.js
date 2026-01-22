// Clear all auth-related localStorage data
localStorage.removeItem('token');
localStorage.removeItem('user_id');
localStorage.removeItem('user');
console.log('Cleared all auth data from localStorage');
console.log('Please refresh the page and log in again');
