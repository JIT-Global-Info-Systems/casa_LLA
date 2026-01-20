import { useState, useEffect } from "react";
import axios from "axios";
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
  Loader2,
  AlertCircle
} from "lucide-react";
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const PurchasedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchPurchasedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/leads/purchased");
      if (response.data && response.data.data) {
        setLeads(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching purchased leads:", err);
      setError("Failed to fetch   . Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedLeads();
  }, []);

  const handleRefresh = () => {
    fetchPurchasedLeads();
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  const filteredLeads = leads.filter(lead => 
    lead.mediatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactNumber?.includes(searchTerm) ||
    lead.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.leadType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading purchased leads...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">
          Purchased Leads
          <div className="text-sm text-slate-500">
            Leads list · Last updated today
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
                <Search className=" p-2 absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Mediator Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lead Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead._id.substring(0, 6)}...</TableCell>
                      <TableCell>{lead.mediatorName || 'N/A'}</TableCell>
                      <TableCell>{lead.contactNumber || 'N/A'}</TableCell>
                      <TableCell>{lead.leadType || 'N/A'}</TableCell>
                      <TableCell>{lead.location || 'N/A'}</TableCell>
                      <TableCell>
                        {lead.date ? format(new Date(lead.date), 'dd MMM yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {lead.lead_status || 'Active'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(lead)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(lead)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No purchased leads found
                    </TableCell>
                  </TableRow>
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
export default PurchasedLeads;