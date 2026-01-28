import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
 
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive', // 'destructive' | 'default'
  loading = false,
}) => {
  if (!isOpen) return null;
 
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };
 
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
    if (e.key === 'Enter' && !loading) {
      onConfirm();
    }
  };
 
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
     
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, loading]);
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
 
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            variant === 'destructive' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              variant === 'destructive' ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
 
          {/* Title */}
          <h3
            id="modal-title"
            className="mt-4 text-lg font-semibold text-center text-gray-900"
          >
            {title}
          </h3>
 
          {/* Description */}
          <p
            id="modal-description"
            className="mt-2 text-sm text-center text-gray-600"
          >
            {description}
          </p>
 
          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ConfirmModal;
 
 