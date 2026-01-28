import { useState } from 'react';
 
/**
 * Custom hook to manage confirmation modal state
 *
 * @returns {Object} Modal state and control functions
 *
 * @example
 * const { isOpen, loading, openModal, closeModal, confirmAction } = useConfirmModal();
 *
 * // Open modal
 * openModal();
 *
 * // Handle confirm with async action
 * const handleConfirm = async () => {
 *   await confirmAction(async () => {
 *     await deleteUser(userId);
 *     toast.success('User deleted');
 *   });
 * };
 */
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const openModal = () => {
    setIsOpen(true);
  };
 
  const closeModal = () => {
    if (!loading) {
      setIsOpen(false);
    }
  };
 
  /**
   * Execute an async action with loading state
   * Automatically closes modal on success
   *
   * @param {Function} action - Async function to execute
   * @returns {Promise<boolean>} - Returns true if action succeeded, false if failed
   */
  const confirmAction = async (action) => {
    setLoading(true);
    try {
      await action();
      setIsOpen(false);
      return true;
    } catch (error) {
      // Error should be handled by the action itself (toast, etc.)
      console.error('Confirm action failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
 
  return {
    isOpen,
    loading,
    openModal,
    closeModal,
    confirmAction,
  };
};
 
export default useConfirmModal;
 
 