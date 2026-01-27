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
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingState message="Verifying access..." />;
  }

  // If user is not authenticated, redirect to login with return path
  // Prevent redirect loop by checking if we're already coming from login
  if (!isAuthenticated || !user) {
    if (location.pathname === '/login') {
      return null;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required permission
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    // Show permission denied UI instead of redirecting
    if (showPermissionDenied) {
      return <PermissionDenied message="You do not have permission to view this page." />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has permission
  return children;
};

export default ProtectedRoute;
