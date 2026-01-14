// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { usersAPI } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Check if user is logged in on app start
//     const token = localStorage.getItem('token');
//     if (token) {
//       // You might want to validate the token here
//       // For now, we'll just set a dummy user
//       setUser({ token });
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await usersAPI.login(credentials);
      
//       if (response.token) {
//         localStorage.setItem('token', response.token);
//         setUser(response.user || { token: response.token });
//       }
      
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await usersAPI.register(userData);
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setError(null);
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
