export  function Label({ children, required = false }) {
    return (
      <label className="text-sm font-medium text-gray-700">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )
  }
  