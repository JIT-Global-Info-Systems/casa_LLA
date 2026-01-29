import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/config/rbac";
import LoadingState from "@/components/ui/LoadingState";
import PermissionDenied from "@/components/ui/PermissionDenied";

const ProtectedRoute = ({
  children,
  requiredPermission,
  showPermissionDenied = false
}) => {
  const { user, isAuthenticated, loading, error } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingState message="Verifying access..." />;
  }

  // If there's an auth error (like expired session), redirect to login
  if (error) {
    const authPages = ['/login', '/forgot-password', '/verify-otp', '/reset-password', '/first-time-password-change'];
    if (!authPages.includes(location.pathname)) {
      return <Navigate to="/login" state={{ from: location, error }} replace />;
    }
  }

  // If user is not authenticated, redirect to login with return path
  // Prevent redirect loop by checking current path
  if (!isAuthenticated || !user?.token) {
    // Don't redirect if already on login or auth pages
    const authPages = ['/login', '/forgot-password', '/verify-otp', '/reset-password', '/first-time-password-change'];
    if (authPages.includes(location.pathname)) {
      return null;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required permission
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    // Show permission denied UI instead of redirecting
    if (showPermissionDenied) {
      return <PermissionDenied 
        message="You do not have permission to view this page." 
        requiredPermission={requiredPermission}
        userRole={user.role}
      />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has permission
  return children;
};

export default ProtectedRoute;
