import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { hasPermission, hasAnyPermission, getRolePermissions } from '@/config/rbac';

// Permission hook for reusable permission checking
export const usePermissions = () => {
  const { user } = useContext(AuthContext);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (user?.role) {
      const rolePermissions = getRolePermissions(user.role);
      setPermissions(rolePermissions);
    } else {
      setPermissions([]);
    }
  }, [user?.role]);

  const hasPermission = (permission) => {
    if (!user?.role) return false;

    // If user has wildcard permissions, grant access
    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    if (!Array.isArray(permissionList)) {
      return hasPermission(permissionList);
    }

    return permissionList.some(permission => hasPermission(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    userRole: user?.role,
  };
};
