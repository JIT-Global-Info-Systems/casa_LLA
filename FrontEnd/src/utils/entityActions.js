/**
 * Generic entity action utilities
 * Provides status-aware logic for destructive actions across all entity types
 */

/**
 * Entity status constants
 */
export const ENTITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PURCHASED: 'purchased',
};

/**
 * Action types
 */
export const ACTION_TYPE = {
  DELETE: 'delete',
  DEACTIVATE: 'deactivate',
  ACTIVATE: 'activate',
  APPROVE: 'approve',
  REJECT: 'reject',
};

/**
 * Check if an entity can be deleted
 * 
 * @param {Object} entity - The entity to check
 * @param {string} entity.status - Entity status
 * @returns {Object} { canDelete: boolean, reason: string | null }
 */
export const canDelete = (entity) => {
  if (!entity) {
    return { canDelete: false, reason: 'Entity not found' };
  }

  const status = entity.status?.toLowerCase();

  // Already inactive or deleted
  if (status === ENTITY_STATUS.INACTIVE) {
    return { canDelete: false, reason: 'This item is already inactive' };
  }

  if (status === ENTITY_STATUS.DELETED) {
    return { canDelete: false, reason: 'This item has already been removed' };
  }

  // Can delete if active or any other valid state
  return { canDelete: true, reason: null };
};

/**
 * Check if an entity can be deactivated
 * 
 * @param {Object} entity - The entity to check
 * @returns {Object} { canDeactivate: boolean, reason: string | null }
 */
export const canDeactivate = (entity) => {
  if (!entity) {
    return { canDeactivate: false, reason: 'Entity not found' };
  }

  const status = entity.status?.toLowerCase();

  if (status === ENTITY_STATUS.INACTIVE) {
    return { canDeactivate: false, reason: 'This item is already inactive' };
  }

  if (status === ENTITY_STATUS.DELETED) {
    return { canDeactivate: false, reason: 'This item has been removed' };
  }

  return { canDeactivate: true, reason: null };
};

/**
 * Check if an entity can be activated
 * 
 * @param {Object} entity - The entity to check
 * @returns {Object} { canActivate: boolean, reason: string | null }
 */
export const canActivate = (entity) => {
  if (!entity) {
    return { canActivate: false, reason: 'Entity not found' };
  }

  const status = entity.status?.toLowerCase();

  if (status === ENTITY_STATUS.ACTIVE) {
    return { canActivate: false, reason: 'This item is already active' };
  }

  if (status === ENTITY_STATUS.DELETED) {
    return { canActivate: false, reason: 'This item has been removed' };
  }

  return { canActivate: true, reason: null };
};

/**
 * Get comprehensive action state for an entity
 * Returns what actions are available and why
 * 
 * @param {Object} entity - The entity to check
 * @param {string} entityType - Type of entity (user, lead, mediator, etc.)
 * @returns {Object} Action availability state
 */
export const getActionState = (entity, entityType = 'item') => {
  const deleteCheck = canDelete(entity);
  const deactivateCheck = canDeactivate(entity);
  const activateCheck = canActivate(entity);

  return {
    entityType,
    status: entity?.status,
    actions: {
      delete: {
        enabled: deleteCheck.canDelete,
        reason: deleteCheck.reason,
        tooltip: deleteCheck.reason || `Delete this ${entityType}`,
      },
      deactivate: {
        enabled: deactivateCheck.canDeactivate,
        reason: deactivateCheck.reason,
        tooltip: deactivateCheck.reason || `Deactivate this ${entityType}`,
      },
      activate: {
        enabled: activateCheck.canActivate,
        reason: activateCheck.reason,
        tooltip: activateCheck.reason || `Activate this ${entityType}`,
      },
    },
  };
};

/**
 * Get user-friendly status display text
 * 
 * @param {string} status - Entity status
 * @returns {Object} { text: string, color: string, badge: string }
 */
export const getStatusDisplay = (status) => {
  const normalizedStatus = status?.toLowerCase();

  const statusMap = {
    [ENTITY_STATUS.ACTIVE]: {
      text: 'Active',
      color: 'text-green-700',
      badge: 'bg-green-100 text-green-700',
    },
    [ENTITY_STATUS.INACTIVE]: {
      text: 'Inactive',
      color: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-600',
    },
    [ENTITY_STATUS.DELETED]: {
      text: 'Deleted',
      color: 'text-red-600',
      badge: 'bg-red-100 text-red-600',
    },
    [ENTITY_STATUS.PENDING]: {
      text: 'Pending',
      color: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700',
    },
    [ENTITY_STATUS.APPROVED]: {
      text: 'Approved',
      color: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
    },
    [ENTITY_STATUS.REJECTED]: {
      text: 'Rejected',
      color: 'text-red-700',
      badge: 'bg-red-100 text-red-700',
    },
    [ENTITY_STATUS.PURCHASED]: {
      text: 'Purchased',
      color: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  return statusMap[normalizedStatus] || {
    text: status || 'Unknown',
    color: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-600',
  };
};

/**
 * Normalize API error messages to user-friendly text
 * 
 * @param {Error} error - Error object from API
 * @param {string} action - Action being performed (delete, update, etc.)
 * @param {string} entityType - Type of entity
 * @returns {string} User-friendly error message
 */
export const normalizeErrorMessage = (error, action = 'perform this action', entityType = 'item') => {
  const errorMessage = error?.message?.toLowerCase() || '';

  // Already inactive/deleted - should not happen if UI is correct
  if (errorMessage.includes('already inactive') || errorMessage.includes('already deactivated')) {
    return `This ${entityType} is already inactive.`;
  }

  if (errorMessage.includes('already deleted') || errorMessage.includes('already removed')) {
    return `This ${entityType} has already been removed.`;
  }

  if (errorMessage.includes('not found')) {
    return `This ${entityType} could not be found.`;
  }

  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
    return `You do not have permission to ${action} this ${entityType}.`;
  }

  // Validation errors
  if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
    return `Could not ${action}. Please check the information and try again.`;
  }

  // Dependency errors
  if (errorMessage.includes('in use') || errorMessage.includes('referenced') || errorMessage.includes('dependency')) {
    return `Cannot ${action} this ${entityType} because it is currently in use.`;
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return `Could not ${action}. Please check your connection and try again.`;
  }

  // Generic fallback
  return error?.message || `Could not ${action}. Please try again.`;
};

/**
 * Get confirmation modal content for an action
 * 
 * @param {string} action - Action type (delete, deactivate, etc.)
 * @param {Object} entity - Entity being acted upon
 * @param {string} entityType - Type of entity
 * @param {string} entityName - Display name of the entity
 * @returns {Object} { title, description, confirmText, variant }
 */
export const getConfirmationContent = (action, entity, entityType = 'item', entityName = '') => {
  const name = entityName || entity?.name || entity?.title || 'this item';

  const contentMap = {
    [ACTION_TYPE.DELETE]: {
      title: `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
    },
    [ACTION_TYPE.DEACTIVATE]: {
      title: `Deactivate ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to deactivate "${name}"? You can reactivate it later.`,
      confirmText: 'Deactivate',
      variant: 'destructive',
    },
    [ACTION_TYPE.ACTIVATE]: {
      title: `Activate ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to activate "${name}"?`,
      confirmText: 'Activate',
      variant: 'default',
    },
    [ACTION_TYPE.APPROVE]: {
      title: `Approve ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to approve "${name}"?`,
      confirmText: 'Approve',
      variant: 'default',
    },
    [ACTION_TYPE.REJECT]: {
      title: `Reject ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to reject "${name}"?`,
      confirmText: 'Reject',
      variant: 'destructive',
    },
  };

  return contentMap[action] || {
    title: 'Confirm Action',
    description: `Are you sure you want to proceed with this action on "${name}"?`,
    confirmText: 'Confirm',
    variant: 'default',
  };
};

/**
 * Get success message for an action
 * 
 * @param {string} action - Action type
 * @param {string} entityType - Type of entity
 * @param {string} entityName - Display name of the entity
 * @returns {string} Success message
 */
export const getSuccessMessage = (action, entityType = 'item', entityName = '') => {
  const name = entityName ? `"${entityName}"` : `${entityType}`;

  const messageMap = {
    [ACTION_TYPE.DELETE]: `${name} deleted successfully`,
    [ACTION_TYPE.DEACTIVATE]: `${name} deactivated successfully`,
    [ACTION_TYPE.ACTIVATE]: `${name} activated successfully`,
    [ACTION_TYPE.APPROVE]: `${name} approved successfully`,
    [ACTION_TYPE.REJECT]: `${name} rejected successfully`,
  };

  return messageMap[action] || `Action completed successfully`;
};

export default {
  canDelete,
  canDeactivate,
  canActivate,
  getActionState,
  getStatusDisplay,
  normalizeErrorMessage,
  getConfirmationContent,
  getSuccessMessage,
  ENTITY_STATUS,
  ACTION_TYPE,
};
