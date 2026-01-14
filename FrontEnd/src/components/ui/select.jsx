export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select option",
  }) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
  
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
  