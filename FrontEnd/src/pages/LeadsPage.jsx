
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import Modal from "@/components/ui/modal"
// import Leads from "./Leads"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// const leadsData = [
//   {
//     id: 1,
//     name: "Ravi",
//     location: "Chennai",
//     zone: "North",
//     status: "Pending",
//   },
//   {
//     id: 2,
//     name: "Kumar",
//     location: "Bangalore",
//     zone: "East",
//     status: "Approved",
//   },
// ]

// export default function LeadsPage() {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className="p-6">

//       {/* Top Bar */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Leads</h1>

//         <Button onClick={() => setOpen(true)}>
//           + Create Lead
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Location</TableHead>
//               <TableHead>Zone</TableHead>
//               <TableHead>Status</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {leadsData.map((lead) => (
//               <TableRow key={lead.id}>
//                 <TableCell>{lead.id}</TableCell>
//                 <TableCell>{lead.name}</TableCell>
//                 <TableCell>{lead.location}</TableCell>
//                 <TableCell>{lead.zone}</TableCell>
//                 <TableCell>{lead.status}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Leads />
//       </Modal>
//     </div>
//   )
// }
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/modal"
import Leads from "./Leads"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Edit } from "lucide-react" // ← Import Edit Icon

const leadsData = [
  { id: 1, name: "Ravi", location: "Chennai", zone: "North", status: "Pending" },
  { id: 2, name: "Kumar", location: "Bangalore", zone: "East", status: "Approved" },
]

export default function LeadsPage() {
  const [open, setOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  const handleCreate = () => {
    setSelectedLead(null)
    setOpen(true)
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setOpen(true)
  }

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
      <div className="text-xl font-bold text-indigo-700">
              Leads
              <div className="text-sm text-slate-500">
              Leads list · Last updated today
            </div>
            </div>
          
        <Button onClick={handleCreate}>+ Create Lead</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leadsData.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.id}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.location}</TableCell>
                <TableCell>{lead.zone}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>
                  {/* Edit Icon Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(lead)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Leads data={selectedLead} />
      </Modal>
    </div>
  )
}
