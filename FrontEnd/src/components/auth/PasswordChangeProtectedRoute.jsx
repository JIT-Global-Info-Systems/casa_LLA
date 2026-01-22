import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PasswordChangeProtectedRoute = ({ children }) => {
  const { forcePasswordChange, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user needs to change password (first login), redirect to change password
  // Allow access to change password pages themselves
  if (forcePasswordChange &&
      location.pathname !== '/first-time-password-change' &&
      location.pathname !== '/pages/change-password') {
    return <Navigate
      to="/first-time-password-change"
      state={{
        isFirstLogin: true,
        message: 'This is your first login. Please change your password to continue.',
        from: location
      }}
      replace
    />;
  }

  // If everything is fine, render the children
  return children;
};

export default PasswordChangeProtectedRoute;
