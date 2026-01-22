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
  const [viewLead, setViewLead] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const leadComments = [
    selectedLead?.remark,
    selectedLead?.comment,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((text) => Boolean(text));

  const fetchPurchasedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://13.201.132.94:5000/api/leads/purchased",{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.data && response.data.data) {
        setLeads(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching purchased leads:", err);
      setError("Failed to fetch purchased leads. Please try again later.");
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

  const handleView = (lead) => {
    setViewLead(lead);
    setIsViewMode(true);
  };

  const handleLeadSubmit = async (leadPayload, files = {}) => {
    try {
      // Add your update logic here
      setOpen(false);
      fetchPurchasedLeads();
    } catch (err) {
      console.error("Failed to submit lead:", err);
    }
  };

  const normalizedLeads = (Array.isArray(leads) ? leads : []).map((lead) => {
    const registeredDate =
      lead.registeredDate || lead.date || lead.createdAt || null;
    return {
      id: lead.id || lead._id || "N/A",
      name:
        lead.mediatorName ||
        lead.ownerName ||
        lead.name ||
        lead.contactName ||
        "N/A",
      lead_id: lead.lead_id,
      email: lead.email || lead.contactEmail || "—",
      phone: lead.phone || lead.contactNumber || "",
      location: lead.location || lead.address?.city || "N/A",
      zone: lead.zone || lead.region || "N/A",
      property: lead.propertyType || lead.leadType || "—",
      status: lead.lead_status || lead.status || "Purchased",
      stageName: lead.stageName || lead.currentStage || "Not Started",
      registeredDate,
      raw: lead,
    };
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <span className="text-gray-600">Loading purchased leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-0">
      {open ? (
        /* Full page view when editing/creating */
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div
                  className={`${selectedLead ? "lg:col-span-2" : "lg:col-span-3"
                    } space-y-4`}
                >
                  <LeadStepper
                    stageName={
                      selectedLead?.leadStatus ||
                      selectedLead?.stageName ||
                      "Tele Caller"
                    }
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    className="w-full"
                  />

                  <Leads
                    data={selectedLead}
                    onSubmit={handleLeadSubmit}
                    onClose={() => setOpen(false)}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                  />
                </div>

                {/* Right-side message thread (only show when editing) */}
                {selectedLead && (
                  <div className="lg:col-span-1">
                    <div className="h-full rounded-lg border bg-slate-50 sticky top-4">
                      <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                        <div className="text-sm font-semibold text-slate-800">
                          Notes
                        </div>
                        <div className="text-xs text-slate-500">
                          Message thread
                        </div>
                      </div>

                      <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
                        {leadComments.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No comments
                          </div>
                        ) : (
                          leadComments.map((text, idx) => (
                            <div
                              key={`${idx}-${text}`}
                              className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm"
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
      ) : isViewMode ? (
        /* VIEW MODE */
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Button
              variant="outline"
              onClick={() => setIsViewMode(false)}
              className="mb-4"
            >
              ← Back to Leads
            </Button>

            <h2 className="text-xl font-semibold mb-6">Lead Details</h2>

            {viewLead && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Lead ID
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead._id || viewLead.id || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Name
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.mediatorName || viewLead.ownerName || viewLead.name || viewLead.contactName || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.email || viewLead.contactEmail || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Phone
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.phone || viewLead.contactNumber || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Location
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.location || viewLead.address?.city || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Zone
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.zone || viewLead.region || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Status
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.lead_status || viewLead.status || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Current Stage
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.stageName || viewLead.currentStage || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Registered Date
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewLead.registeredDate || viewLead.date || viewLead.createdAt ?
                      new Date(viewLead.registeredDate || viewLead.date || viewLead.createdAt).toLocaleDateString() :
                      'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Remark
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded min-h-[60px]">
                    {viewLead.remark || 'N/A'}
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Comment
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded min-h-[60px]">
                    {viewLead.comment || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Main page content when not editing or viewing */
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-indigo-700">Purchased Leads</h1>
                <p className="text-sm text-gray-500 mt-1">Purchased leads list · Last updated today</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-gray-700" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <Card className="bg-white shadow-sm">
              <div className="p-6 border-b flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">From:</Label>
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[150px] border-gray-300" />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">To:</Label>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[150px] border-gray-300" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.raw?.lead_id ?? lead.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.phone || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.zone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.property || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {lead.registeredDate ? new Date(lead.registeredDate).toISOString().split("T")[0] : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                              <DropdownMenuItem onClick={() => handleView(lead.raw)} className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(lead.raw)} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this lead?")) {
                                    // Add delete logic here
                                  }
                                }}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!loading && !error && filteredLeads.length === 0 && <div className="text-center py-12 text-gray-500"><p>No purchased leads found matching your criteria.</p></div>}

              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {filteredLeads.length} results</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="text-gray-400">Previous</Button>
                  <Button variant="outline" size="sm" disabled className="text-gray-400">Next</Button>
                  <Button variant="outline" size="sm" disabled className="text-gray-400">Last</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
export default PurchasedLeads;