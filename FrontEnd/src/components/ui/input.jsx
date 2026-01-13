export function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
  }) {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
  
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    )
  }
  
