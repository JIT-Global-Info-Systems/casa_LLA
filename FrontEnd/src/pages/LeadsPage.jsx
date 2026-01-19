
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
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// import Modal from "@/components/ui/modal"
import LeadStepper from "@/components/ui/LeadStepper"
import Leads from "./Leads"
import { useLeads } from "../context/LeadsContext.jsx"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
 
import {
  Plus,
  Search,
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react"; // ← Import Edit Icon
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const leadsData = [
  {
    id: 1,
    name: "Ravi",
    location: "Chennai",
    region: "North",
    zone:"alandur",
    status: "Pending",
    stageName: "Feasibility Team",
  },
  {
    id: 2,
    name: "Kumar",
    location: "Bangalore",
    region: "East",
    zone: "electricCity",
    status: "Approved",
    stageName: "Legal",
  },
];
 
export default function LeadsPage() {
  const { leads, loading, error, fetchLeads } = useLeads()
  const [open, setOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  const leadComments = [
    selectedLead?.remark,
    selectedLead?.comment,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((text) => {
      if (!text) return false
      const lower = text.toLowerCase()
    })

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])


  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };
 
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };
  return (
    <div>
      {open ? (
        /* Full page view when editing/creating */
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="mb-4"
                >
                  ← Back to Leads
                </Button>
              </div>
              <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {selectedLead && (
                    <LeadStepper stageName={selectedLead.stageName} />
                  )}
                  <Leads data={selectedLead} onClose={() => setOpen(false)} />
                </div>

                {/* Right-side message thread (static) */}
                <div className="lg:col-span-1">
                  <div className="h-full rounded-lg border bg-slate-50">
                    <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                      <div className="text-sm font-semibold text-slate-800">Notes</div>
                      <div className="text-xs text-slate-500">Message thread</div>
                    </div>

                    <div className="p-4 space-y-3 max-h-[40vh] overflow-y-auto">
                      {leadComments.length === 0 ? (
                        <div className="text-sm text-slate-500">No comments</div>
                      ) : (
                        leadComments.map((text, idx) => (
                          <div
                            key={`${idx}-${text}`}
                            className="w-full border bg-white px-3 py-2 text-sm text-slate-800"
                          >
                            {text}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main page content when not editing */
        <div className="p-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-indigo-700">
              Leads
              <div className="text-sm text-slate-500">
                Leads list · Last updated today
              </div>
            </div>

            <Button onClick={handleCreate}>+ Create</Button>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-slate-600">Loading leads...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Lead Type</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>{lead.mediatorName || 'N/A'}</TableCell>
                      <TableCell>{lead.location || 'N/A'}</TableCell>
                      <TableCell>{lead.source || 'N/A'}</TableCell>
                      <TableCell>{lead.zone || 'N/A'}</TableCell>
                      <TableCell>{lead.leadType || 'N/A'}</TableCell>
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
          )}
        </div>
      )}
    </div>
  );
}