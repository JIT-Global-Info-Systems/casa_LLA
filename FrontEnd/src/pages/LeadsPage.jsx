import { useState, useEffect } from "react";
import { useLeads } from "../context/LeadsContext"; // Context Import
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  ArrowLeft,
} from "lucide-react";

// Components
import LeadStepper from "@/components/ui/LeadStepper";
import Leads from "./Leads"; // This is your form component

export default function LeadsPage() {
  // 1. Context & State
  const { leads, loading, error, fetchLeads } = useLeads();

  const [open, setOpen] = useState(false); // Controls List vs Editor view
  const [selectedLead, setSelectedLead] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 2. Initial Fetch
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Data Normalization (Crucial for handling different API response structures)
  const normalizedLeads = (Array.isArray(leads) ? leads : []).map((lead) => {
    const registeredDate = lead.registeredDate || lead.date || lead.createdAt || null;
    return {
      id: lead.id || lead._id || "N/A",
      name: lead.mediatorName || lead.ownerName || lead.name || lead.contactName || "N/A",
      email: lead.email || lead.contactEmail || "—",
      phone: lead.phone || lead.contactNumber || "",
      location: lead.location || lead.address?.city || "N/A",
      zone: lead.zone || lead.region || "N/A",
      status: lead.status || lead.stageStatus || "Pending",
      stageName: lead.stageName || lead.currentStage || "Not Started",
      registeredDate,
      comment: lead.comment,
      remark: lead.remark,
      raw: lead, // Keep original data for editing
    };
  });

  // 4. Filtering Logic
  const filteredLeads = normalizedLeads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      String(lead.id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      if (!lead.registeredDate) return false;
      const leadDate = new Date(lead.registeredDate);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return leadDate >= fromDate && leadDate <= toDate;
    })();

    return matchesSearch && matchesDateRange;
  });

  // 5. Comments Logic for Sidebar
  const leadComments = [
    selectedLead?.remark,
    selectedLead?.comment,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((text) => Boolean(text));

  // 6. Handlers
  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };

  const handleEdit = (leadRaw) => {
    // We pass the raw API data to the form
    setSelectedLead(leadRaw);
    setOpen(true);
  };

  const handleDelete = (lead) => {
    // Add context delete function here
    if(window.confirm("Are you sure you want to delete this lead?")) {
        console.log("Deleting", lead.id);
    }
  };

  // --- RENDER ---
  return (
    <div className="flex-1 space-y-6 p-6">
      {open ? (
        /* ============================
           EDITOR / CREATE VIEW
           ============================ */
        <div className="min-h-screen bg-gray-50 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Back Button */}
              <div className="mb-6 flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Leads
                </Button>
                <h2 className="text-xl font-semibold ml-2">
                    {selectedLead ? "Edit Lead" : "Create New Lead"}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form Area */}
                <div className={`${selectedLead ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}>
                  {selectedLead && (
                    <LeadStepper stageName={selectedLead.stageName || selectedLead.currentStage} />
                  )}
                  {/* Pass raw data or null to the Leads Form Component */}
                  <Leads
                    data={selectedLead}
                    onSubmit={() => {
                        fetchLeads(); // Refresh data after save
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                  />
                </div>

                {/* Right-side Notes/Comments (Only shown when editing existing lead) */}
                {selectedLead && (
                  <div className="lg:col-span-1">
                    <div className="h-full rounded-lg border bg-slate-50 sticky top-4">
                      <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                        <div className="text-sm font-semibold text-slate-800">
                          Notes & History
                        </div>
                        <div className="text-xs text-slate-500">
                          Communication thread
                        </div>
                      </div>

                      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                        {leadComments.length === 0 ? (
                          <div className="text-sm text-slate-500 italic text-center py-4">
                            No comments recorded yet.
                          </div>
                        ) : (
                          leadComments.map((text, idx) => (
                            <div
                              key={`${idx}-${text.substring(0, 10)}`}
                              className="w-full border bg-white px-3 py-2 text-sm text-slate-700 rounded shadow-sm"
                            >
                              {text}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================
           LIST / DASHBOARD VIEW
           ============================ */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-indigo-700">
                Leads
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your leads pipeline · Last updated today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLeads}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={handleCreate}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads (ID, Name, Email)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">
                    From:
                  </Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[140px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">
                    To:
                  </Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[140px]"
                  />
                </div>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table Container */}
          <div className="rounded-md border bg-white">
            {loading && (
                <div className="text-center py-12 text-gray-500">
                    <p>Loading leads...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            )}

            {!loading && !error && (
                <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                    <TableHead className="w-[100px] text-xs uppercase tracking-wider text-gray-500 font-medium">ID</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">Name</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">Location</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">Zone</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">Current Stage</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLeads.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No leads found matching your criteria.
                        </TableCell>
                    </TableRow>
                    ) : (
                    filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{lead.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{lead.name}</span>
                            <span className="text-xs text-gray-500">{lead.email}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{lead.location}</TableCell>
                        <TableCell className="text-gray-600">{lead.zone}</TableCell>
                        <TableCell>
                            <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            >
                            {lead.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-indigo-100 text-indigo-800">
                            {lead.stageName}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                                <DropdownMenuItem onClick={() => alert(`View ${lead.name}`)} className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(lead.raw)} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lead
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                    onClick={() => handleDelete(lead)}
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
            )}
          </div>

          {/* Pagination (Static for now, hook up to backend if needed) */}
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} result
              {filteredLeads.length !== 1 ? "s" : ""}
              {filteredLeads.length !== normalizedLeads.length &&
                ` (of ${normalizedLeads.length} total)`}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
