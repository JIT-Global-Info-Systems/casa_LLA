export default function Modal({ open, onClose, children }) {
    if (!open) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-xl font-bold"
          >
            ✕
          </button>

          {children}
        </div>
      </div>
    )
  }
