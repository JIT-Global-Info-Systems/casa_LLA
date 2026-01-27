import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/config/rbac";

const ProtectedRoute = ({
  children,
  requiredPermission,
  fallbackPath = "/unauthorized"
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Return null while checking authentication to prevent flash
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required permission
  if (!hasPermission(user.role, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has permission
  return children;
};

export default ProtectedRoute;
