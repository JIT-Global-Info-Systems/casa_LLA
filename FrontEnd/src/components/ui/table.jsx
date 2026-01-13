export function Table({ children }) {
    return <table className="w-full border border-gray-200">{children}</table>
  }
  
  export function TableHeader({ children }) {
    return <thead className="bg-gray-100">{children}</thead>
  }
  
  export function TableBody({ children }) {
    return <tbody>{children}</tbody>
  }
  
  export function TableFooter({ children }) {
    return <tfoot className="bg-gray-50 font-medium">{children}</tfoot>
  }
  
  export function TableRow({ children }) {
    return <tr className="border-b">{children}</tr>
  }
  
  export function TableHead({ children, className }) {
    return <th className={`text-left p-3 ${className}`}>{children}</th>
  }
  
  export function TableCell({ children, className }) {
    return <td className={`p-3 ${className}`}>{children}</td>
  }
  
  export function TableCaption({ children }) {
    return <caption className="mb-2 text-sm text-gray-500">{children}</caption>
  }
  