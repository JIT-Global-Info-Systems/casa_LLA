import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import LeadStepper from "@/components/ui/LeadStepper";
import { Label } from "@/components/ui/label";
import Leads from "./Leads";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  const filteredLeads = leadsData.filter((leads) => {
    const matchesSearch =
      searchTerm === "" ||
      leads.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leads.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leads.phone.includes(searchTerm) ||
      leads.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const leadsDate = new Date(leads.registeredDate);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return leadsDate >= fromDate && leadsDate <= toDate;
    })();

    return matchesSearch && matchesDateRange;
  });

  return (
    <div className=" flex-1 space-y-6 p-6">
      {/* Top Bar */}
      {/* <div className="flex justify-between items-center mb-4">
      
            </div>
          
        <Button onClick={handleCreate}>+ Create</Button>
      </div> */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">
          Leads
          <div className="text-sm text-slate-500">
            Leads list · Last updated today
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleCreate}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                {/* <Search className=" p-2 absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600 whitespace-nowrap">
                From:
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[140px]"
                size="sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600 whitespace-nowrap">
                To:
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[140px]"
                size="sm"
              />
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-medium">ID</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Location</TableHead>
                  <TableHead className="font-medium">Region</TableHead>
                  <TableHead className="font-medium">Zone</TableHead>
             
                  <TableHead className="text-right font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-slate-500"
                    >
                      No Leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((leads) => (
                    <TableRow key={leads.id}>
                      <TableCell className="font-medium">
                        {leads.id}
                      </TableCell>
                      <TableCell>{leads.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            leads.category === "Individual"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {leads.location}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {leads.region}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {leads.zone}
                      </TableCell>
                   
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                              onClick={() => alert(`View ${leads.name}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(leads)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(leads)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredLeads.length} result
              {filteredLeads.length !== 1 ? "s" : ""}
              {filteredLeads.length !== leadsData.length &&
                ` (of ${leadsData.length} total)`}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
              <Button variant="outline" size="sm">
                Last
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="bg-white rounded-lg border">
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
      {/* <Button
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
      </div> */}

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-4 space-y-4">
          {/* Show stepper only when editing/viewing */}
          {selectedLead && <LeadStepper stageName={selectedLead.stageName} />}

          {/* Always show form */}
          <Leads data={selectedLead} />
        </div>
      </Modal>
    </div>
  );
}
