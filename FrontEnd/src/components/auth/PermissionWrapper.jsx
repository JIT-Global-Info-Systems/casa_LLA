import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

// Component for conditional rendering based on permissions
export const PermissionWrapper = ({
  permission,
  permissions,
  children,
  fallback = null,
  requireAll = true
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  // Check single permission
  if (permission) {
    return hasPermission(permission) ? children : fallback;
  }

  // Check multiple permissions
  if (permissions && Array.isArray(permissions)) {
    const hasRequiredPermissions = requireAll
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions);

    return hasRequiredPermissions ? children : fallback;
  }

  // No permission specified, render children
  return children;
};

// Hook for permission-based conditional logic
export const usePermissionCheck = (permission) => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};
