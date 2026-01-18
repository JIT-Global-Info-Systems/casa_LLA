export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select option",
    disabled = false,
  }) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
  
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <option value="">{placeholder}</option>
  
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }