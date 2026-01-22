import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import LeadStepper from "@/components/ui/LeadStepper";
import { Label } from "@/components/ui/label";
import Leads from "./Leads";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";
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
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ApprovedLeads() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  useEffect(() => {
    const fetchApprovedLeads = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/leads/approved");
        setLeads(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching approved leads:", err);
        setError("Failed to fetch approved leads. Please try again later.");
        toast.error("Failed to fetch approved leads");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      (lead.mediatorName && lead.mediatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.contactNumber && lead.contactNumber.includes(searchTerm)) ||
      (lead._id && lead._id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const leadDate = new Date(lead.date || lead.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return leadDate >= fromDate && leadDate <= toDate;
    })();

    return matchesSearch && matchesDateRange;
  });

  return (
    <div className=" flex-1 space-y-6 p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">
          Approval Leads
          <div className="text-sm text-slate-500">
            Leads list · Last updated today
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
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
        </div> */}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
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
                  <TableHead className="font-medium">Mediator Name</TableHead>
                  <TableHead className="font-medium">Contact Number</TableHead>
                  <TableHead className="font-medium">Location</TableHead>
                  <TableHead className="font-medium">Property Type</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="text-right font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                        Loading leads...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No Approval leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead._id.substring(0, 6)}...</TableCell>
                      <TableCell>{lead.mediatorName || "N/A"}</TableCell>
                      <TableCell>{lead.contactNumber || "N/A"}</TableCell>
                      <TableCell>{lead.location || "N/A"}</TableCell>
                      <TableCell>{lead.propertyType || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            lead.lead_status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lead.lead_status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(lead)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
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
              {filteredLeads.length !== leads.length &&
                ` (of ${leads.length} total)`}
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

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <LeadStepper
          onClose={() => setOpen(false)}
          initialData={selectedLead}
        />
      </Modal>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}
