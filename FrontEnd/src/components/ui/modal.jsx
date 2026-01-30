import { X } from 'lucide-react';

export default function Modal({ open, onClose, children }) {
    if (!open) return null

    return (
      <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative border border-gray-200">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  }
