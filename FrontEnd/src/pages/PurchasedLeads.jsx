import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Search, MoreVertical, RefreshCw, Eye, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Leads from "./Leads";
import LeadStepper from "@/components/ui/LeadStepper";
 
const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'PURCHASED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
 
const PurchasedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
 
  const leadComments = [
    selectedLead?.remark,
    selectedLead?.comment,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((text) => Boolean(text));
 
  useEffect(() => {
    fetchPurchasedLeads()
  }, [])
 
  const fetchPurchasedLeads = async () => {
    const loadingToast = toast.loading('Loading purchased leads...');
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://13.201.132.94:5000/api/leads/purchased", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
 
      const leadsData = response.data?.data || [];
      setLeads(leadsData);
 
      if (leadsData.length === 0) {
        toast.success('No purchased leads found', { id: loadingToast });
      } else {
        toast.success(`Loaded ${leadsData.length} purchased leads`, {
          id: loadingToast,
          icon: '✅'
        });
      }
    } catch (err) {
      console.error("Error fetching purchased leads:", err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch purchased leads. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };
 
  const handleView = (lead) => {
    setSelectedLead(lead);
    setIsViewMode(true);
    // Don't open modal for view mode - this prevents the popup from showing
  };
 
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" ||
      (lead.mediatorName && lead.mediatorName.toLowerCase().includes(searchLower)) ||
      (lead.contactNumber && lead.contactNumber.includes(searchTerm)) ||
      (lead.lead_id && lead.lead_id.toLowerCase().includes(searchLower)) ||
      (lead.location && lead.location.toLowerCase().includes(searchLower)) ||
      (lead.leadType && lead.leadType.toLowerCase().includes(searchLower));
 
    const matchesDate = !dateFrom && !dateTo ? true : (() => {
      const leadDate = new Date(lead.date || lead.purchaseDate || lead.createdAt || lead.updatedAt);
      const fromDateObj = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const toDateObj = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return leadDate >= fromDateObj && leadDate <= toDateObj;
    })();
 
    const matchesStatus = statusFilter === "all" ||
      (lead.lead_status && lead.lead_status.toLowerCase() === statusFilter.toLowerCase());
 
    return matchesSearch && matchesDate && matchesStatus;
  });
 
  return (
    <div className="flex-1 space-y-6 p-0">
      {isViewMode ? (
        /* VIEW MODE - Use the Leads component with viewMode */
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* LeadStepper - Full width */}
              <div className="mb-6">
                <LeadStepper
                  stageName={
                    selectedLead?.leadStatus ||
                    selectedLead?.stageName ||
                    selectedLead?.lead_stage ||
                    "Tele Caller"
                  }
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  className="w-full"
                />
              </div>
 
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Leads
                    data={selectedLead}
                    viewMode={true}
                    onClose={() => setIsViewMode(false)}
                  />
                </div>
 
                {/* Right-side calls and notes thread (show when viewing) */}
                <div className="lg:col-span-1">
                  <div className="h-full rounded-lg border bg-slate-50 sticky top-4">
                    <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                      <div className="text-sm font-semibold text-slate-800">
                      Calls History
                      </div>
                    </div>
 
                    <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
                      {/* Display calls history if available */}
                      {selectedLead?.calls && selectedLead.calls.length > 0 &&
                        selectedLead.calls.map((call, index) => (
                          <div
                            key={call._id || index}
                            className="w-full border bg-white px-3 py-2 rounded-md shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="text-sm font-medium text-slate-800">{call.name || 'Unknown User'}</p>
                                <p className="text-xs text-slate-600">{call.role || 'No role'}</p>
                              </div>
                              <p className="text-xs text-slate-500">
                                {new Date(call.created_at || call.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {call.note && (
                              <p className="text-xs text-slate-700 mt-1">{call.note}</p>
                            )}
                          </div>
                        ))
                      }
 
                      {/* Display notes from different sources without headers */}
                      {selectedLead?.remark && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Remark:</p>
                          {selectedLead.remark}
                        </div>
                      )}
                      {selectedLead?.comment && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Comment:</p>
                          {selectedLead.comment}
                        </div>
                      )}
                      {selectedLead?.checkNotes && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Additional Notes:</p>
                          {selectedLead.checkNotes}
                        </div>
                      )}
                      {selectedLead?.checkListPage?.[0]?.notes && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Site Visit Notes:</p>
                          {selectedLead.checkListPage[0].notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main page content when not viewing */
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-indigo-700">Purchased Leads</h1>
                <p className="text-sm text-gray-500 mt-1">Purchased leads list · Last updated today</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-700"
                  onClick={fetchPurchasedLeads}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
 
          {/* Main Content */}
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <Card className="bg-white shadow-sm">
              {/* Filters */}
              <div className="p-6 border-b flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
 
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">Status:</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[140px] justify-between border-gray-300 capitalize"
                      >
                        {statusFilter === "all" ? "All Status" : statusFilter}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border shadow-lg">
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("all")}
                        className="cursor-pointer"
                      >
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("purchased")}
                        className="cursor-pointer"
                      >
                        Purchased
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("completed")}
                        className="cursor-pointer"
                      >
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("cancelled")}
                        className="cursor-pointer"
                      >
                        Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
 
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">From:</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-[150px] border-gray-300"
                  />
                </div>
 
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">To:</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-[150px] border-gray-300"
                  />
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mediator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading && leads.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Loading leads...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No purchased leads found
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.lead_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lead.mediatorName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lead.contactNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lead.leadType || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lead.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {lead.date ? format(new Date(lead.date), 'MMM dd, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.lead_status || 'PURCHASED')}`}>
                              {lead.lead_status || 'PURCHASED'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(lead)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {filteredLeads.length > 0 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLeads.length}</span> of{' '}
                    <span className="font-medium">{leads.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
 
          {/* Modal - Only show when not in view mode */}
          {!isViewMode && open && (
            <Modal open={open} onClose={() => setOpen(false)} size="7xl">
              <div className="max-h-[100vh] overflow-auto">
                <div className="p-6">
                  <LeadStepper
                    stageName={
                      selectedLead?.leadStatus ||
                      selectedLead?.stageName ||
                      selectedLead?.lead_stage ||
                      "Tele Caller"
                    }
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    className="w-full"
                  />
                </div>
                <div className="px-6 pb-6">
                  <Leads
                    data={selectedLead}
                    viewMode={true}
                    onSubmit={() => {}}
                    onClose={() => setOpen(false)}
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
export default PurchasedLeads;
 