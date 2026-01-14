// export function Table({ children }) {
//     return <table className="w-full border border-gray-200">{children}</table>
//   }
  
//   export function TableHeader({ children }) {
//     return <thead className="bg-gray-100">{children}</thead>
//   }
  
//   export function TableBody({ children }) {
//     return <tbody>{children}</tbody>
//   }
  
//   export function TableFooter({ children }) {
//     return <tfoot className="bg-gray-50 font-medium">{children}</tfoot>
//   }
  
//   export function TableRow({ children }) {
//     return <tr className="border-b">{children}</tr>
//   }
  
//   export function TableHead({ children, className }) {
//     return <th className={`text-left p-3 ${className}`}>{children}</th>
//   }
  
//   export function TableCell({ children, className }) {
//     return <td className={`p-3 ${className}`}>{children}</td>
//   }
  
//   export function TableCaption({ children }) {
//     return <caption className="mb-2 text-sm text-gray-500">{children}</caption>
//   }
  
export function Table({ children }) {
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          {children}
        </table>
      </div>
    )
  }
  
  export function TableHeader({ children }) {
    return (
      <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10">
        {children}
      </thead>
    )
  }
  
  export function TableBody({ children }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>
  }
  
  export function TableFooter({ children }) {
    return (
      <tfoot className="bg-gray-50 font-semibold text-gray-700">
        {children}
      </tfoot>
    )
  }
  
  export function TableRow({ children }) {
    return (
      <tr className="hover:bg-blue-50 transition-colors duration-200">
        {children}
      </tr>
    )
  }
  
  export function TableHead({ children, className = "" }) {
    return (
      <th
        className={`text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide ${className}`}
      >
        {children}
      </th>
    )
  }
  
  export function TableCell({ children, className = "" }) {
    return (
      <td
        className={`px-4 py-3 text-sm text-gray-600 ${className}`}
      >
        {children}
      </td>
    )
  }
  
  export function TableCaption({ children }) {
    return (
      <caption className="mb-3 text-sm text-gray-500 text-left">
        {children}
      </caption>
    )
  }
  