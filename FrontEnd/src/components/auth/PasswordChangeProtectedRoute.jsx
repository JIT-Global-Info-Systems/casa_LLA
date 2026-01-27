import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/ui/LoadingState';

const PasswordChangeProtectedRoute = ({ children }) => {
  const { forcePasswordChange, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingState message="Checking your account..." />;
  }

  // If user is not authenticated, redirect to login
  // Prevent redirect loop
  if (!isAuthenticated) {
    if (location.pathname === '/login') {
      return null;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user needs to change password (first login), redirect to change password
  // Allow access to change password pages themselves
  // Prevent redirect loop by checking if we're already on the password change page
  if (forcePasswordChange &&
      location.pathname !== '/first-time-password-change' &&
      location.pathname !== '/pages/change-password') {
    return <Navigate
      to="/first-time-password-change"
      state={{
        isFirstLogin: true,
        message: 'Please change your password to continue.',
        from: location
      }}
      replace
    />;
  }

  // If everything is fine, render the children
  return children;
};

export default PasswordChangeProtectedRoute;
