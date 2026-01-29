import { useState } from 'react';
import { useConfirmModal } from './useConfirmModal';
import {
  canDelete,
  canDeactivate,
  canActivate,
  getActionState,
  getConfirmationContent,
  getSuccessMessage,
  normalizeErrorMessage,
  ACTION_TYPE,
} from '@/utils/entityActions';
import toast from 'react-hot-toast';

/**
 * Custom hook for handling entity actions (delete, deactivate, etc.)
 * Provides status-aware logic and prevents invalid actions
 * 
 * @param {string} entityType - Type of entity (user, lead, mediator, etc.)
 * @returns {Object} Entity action handlers and state
 * 
 * @example
 * const { 
 *   handleDelete, 
 *   canPerformAction, 
 *   confirmModal 
 * } = useEntityAction('user');
 * 
 * // Check if delete is allowed
 * const deleteState = canPerformAction(user, 'delete');
 * if (!deleteState.enabled) {
 *   // Show tooltip: deleteState.reason
 * }
 * 
 * // Perform delete
 * handleDelete(user, async () => {
 *   await deleteUserAPI(user.id);
 * });
 */
export const useEntityAction = (entityType = 'item') => {
  const [entityToAct, setEntityToAct] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // Replace window global state
  const { isOpen, loading, openModal, closeModal, confirmAction } = useConfirmModal();

  /**
   * Check if an action can be performed on an entity
   * 
   * @param {Object} entity - Entity to check
   * @param {string} action - Action type (delete, deactivate, activate)
   * @returns {Object} { enabled: boolean, reason: string | null, tooltip: string }
   */
  const canPerformAction = (entity, action) => {
    const actionState = getActionState(entity, entityType);
    return actionState.actions[action] || { enabled: false, reason: 'Invalid action' };
  };

  /**
   * Generic action handler
   * Checks status, shows confirmation, executes action
   * 
   * @param {Object} entity - Entity to act upon
   * @param {string} action - Action type
   * @param {Function} apiCall - Async function to execute the action
   * @param {string} entityName - Optional display name
   */
  const performAction = async (entity, action, apiCall, entityName = null) => {
    // Check if action is allowed
    const actionCheck = canPerformAction(entity, action);
    
    if (!actionCheck.enabled) {
      // Don't show error toast - this is a valid state
      // UI should have disabled the button with tooltip
      console.warn(`Action "${action}" not allowed:`, actionCheck.reason);
      return;
    }

    // Set entity and action for modal
    setEntityToAct(entity);
    setCurrentAction(action);
    
    // Store pending action in component state instead of window
    setPendingAction({ entity, action, apiCall, entityName });
    
    // Open confirmation modal
    openModal();
  };

  /**
   * Handle confirmation from modal
   */
  const handleConfirm = async () => {
    if (!pendingAction) {
      console.error('No pending action found');
      return;
    }

    const { entity, action, apiCall, entityName } = pendingAction;

    const timeoutId = setTimeout(() => {
      toast.error('Action is taking longer than expected. Please check your connection.');
    }, 10000);

    await confirmAction(async () => {
      try {
        await apiCall();
        clearTimeout(timeoutId);

        const successMessage = getSuccessMessage(action, entityType, entityName);
        toast.success(successMessage);

        // Clear the pending action properly
        setPendingAction(null);
        setEntityToAct(null);
        setCurrentAction(null);
      } catch (error) {
        clearTimeout(timeoutId);

        const errorMessage = normalizeErrorMessage(error, action, entityType);
        toast.error(errorMessage);

        throw error; // keeps modal open
      }
    });
  };


  /**
   * Convenience method for delete action
   */
  const handleDelete = (entity, apiCall, entityName = null) => {
    return performAction(entity, ACTION_TYPE.DELETE, apiCall, entityName);
  };

  /**
   * Convenience method for deactivate action
   */
  const handleDeactivate = (entity, apiCall, entityName = null) => {
    return performAction(entity, ACTION_TYPE.DEACTIVATE, apiCall, entityName);
  };

  /**
   * Convenience method for activate action
   */
  const handleActivate = (entity, apiCall, entityName = null) => {
    return performAction(entity, ACTION_TYPE.ACTIVATE, apiCall, entityName);
  };

  /**
   * Get modal content based on current action
   */
  const getModalContent = () => {
    if (!entityToAct || !currentAction) {
      return {
        title: 'Confirm Action',
        description: '',
        confirmText: 'Confirm',
        variant: 'default',
      };
    }

    const entityName = entityToAct.name || entityToAct.title || '';
    return getConfirmationContent(currentAction, entityToAct, entityType, entityName);
  };

  return {
    // Action handlers
    handleDelete,
    handleDeactivate,
    handleActivate,
    performAction,
    
    // Status checks
    canPerformAction,
    canDelete: (entity) => canDelete(entity),
    canDeactivate: (entity) => canDeactivate(entity),
    canActivate: (entity) => canActivate(entity),
    getActionState: (entity) => getActionState(entity, entityType),
    
    // Modal state
    confirmModal: {
      isOpen,
      loading,
      onClose: closeModal,
      onConfirm: handleConfirm,
      ...getModalContent(),
    },
    
    // Current state
    entityToAct,
    currentAction,
  };
};

export default useEntityAction;
