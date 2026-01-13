export  function Textarea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
  }) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
  
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>
    )
  }
  