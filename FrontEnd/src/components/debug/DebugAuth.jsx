import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { hasPermission, getRolePermissions } from '@/config/rbac';
import { PERMISSIONS } from '@/config/rbac';

const DebugAuth = () => {
  const { user, userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid red',
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div><strong>User:</strong> {JSON.stringify(user, null, 2)}</div>
      <div><strong>Role:</strong> {userRole}</div>
      <div><strong>Permissions:</strong></div>
      <ul>
        {getRolePermissions(userRole)?.map(perm => (
          <li key={perm}>{perm}</li>
        ))}
      </ul>
      <div><strong>Can access Users page:</strong> {hasPermission(userRole, PERMISSIONS.PAGE_USERS) ? 'YES' : 'NO'}</div>
      <div><strong>Can access Documents:</strong> {hasPermission(userRole, PERMISSIONS.PAGE_DOCUMENTS) ? 'YES' : 'NO'}</div>
      <div><strong>Can access Leads:</strong> {hasPermission(userRole, PERMISSIONS.PAGE_LEADS) ? 'YES' : 'NO'}</div>
    </div>
  );
};

export default DebugAuth;
