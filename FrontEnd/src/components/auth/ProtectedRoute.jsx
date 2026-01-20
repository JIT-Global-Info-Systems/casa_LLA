import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/config/rbac";

const ProtectedRoute = ({
  children,
  requiredPage,
  fallbackPath = "/unauthorized"
}) => {
  const { user, isAuthenticated } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to the required page
  if (!hasAccess(user.role, requiredPage)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has access
  return children;
};

export default ProtectedRoute;
