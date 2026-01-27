//Leads table
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import LeadStepper from "@/components/ui/LeadStepper"
import Leads from "./Leads"
import { useLeads } from "../context/LeadsContext.jsx"
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useEntityAction } from "@/hooks/useEntityAction";
import toast from "react-hot-toast"
 
export default function LeadsPage() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
 
  const { leads, loading, error, fetchLeads, createLead, updateLead, deleteLead } = useLeads()
  
  // Entity action hook for status-aware delete
  const { handleDelete, canPerformAction, confirmModal } = useEntityAction('lead')
 
  const [currentStep, setCurrentStep] = useState(1)
  const leadComments = [
    selectedLead?.remark,
    selectedLead?.comment,
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((text) => Boolean(text))
 
  useEffect(() => {
    const loadLeads = async () => {
      const loadingToast = toast.loading('Loading leads...');
      try {
        await fetchLeads();
        toast.success('Leads loaded', { 
          id: loadingToast,
          icon: <Check className="w-5 h-5 text-green-500" />,
          duration: 2000
        });
      } catch (err) {
        console.error('Failed to load leads:', err);
        const errorMessage = err.response?.data?.message || 'Could not load leads. Please try again.';
        
        toast.error(errorMessage, { 
          id: loadingToast,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          duration: 5000
        });
      }
    };
    
    loadLeads();
  }, [])
 
  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };
 
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };
 
  const handleLeadSubmit = async (leadPayload, files = {}) => {
    const isUpdate = !!selectedLead;
    const loadingToast = toast.loading(isUpdate ? 'Updating lead...' : 'Creating lead...');
    
    try {
      if (isUpdate) {
        await updateLead(selectedLead._id || selectedLead.id, leadPayload, files);
      } else {
        await createLead(leadPayload, files);
      }
      
      toast.success(
        isUpdate ? 'Lead updated successfully' : 'Lead created successfully',
        { 
          id: loadingToast,
          icon: <Check className="w-5 h-5 text-green-500" />,
          duration: 3000
        }
      );
      
      if (Object.keys(files).length > 0) {
        toast.success('Files uploaded successfully', { 
          icon: '📎',
          duration: 2000 
        });
      }
      
      setOpen(false);
      fetchLeads();
    } catch (err) {
      console.error("Failed to submit lead:", err);
      const errorMessage = err.response?.data?.message || 'Could not save lead. Please try again.';
      
      toast.error(errorMessage, { 
        id: loadingToast,
        icon: <X className="w-5 h-5 text-red-500" />,
        duration: 5000
      });
    }
  };
 
  const handleDeleteLead = (lead) => {
    // Check if delete is allowed
    const deleteState = canPerformAction(lead, 'delete');
    
    if (!deleteState.enabled) {
      // Lead is already inactive/deleted - don't show error
      return;
    }

    // Perform delete with status check
    handleDelete(lead, async () => {
      await deleteLead(lead._id || lead.id);
      fetchLeads(); // Refresh list
    });
  };
 
  const handleView = (lead) => {
    setViewLead(lead);
    setIsViewMode(true);
  };
 
  const normalizedLeads = (Array.isArray(leads) ? leads : []).map((lead) => {
    const registeredDate =
      lead.date || lead.createdAt || lead.created_at || null;
    return {
      id: lead._id || lead.id || lead.lead_id || "N/A",
      name:
        lead.mediatorName ||
        lead.ownerName ||
        lead.name ||
        lead.contactName ||
        "N/A",
      lead_id: lead.lead_id || "N/A",
      email: lead.email || lead.contactEmail || "—",
      phone: lead.contactNumber || lead.phone || "",
      location: lead.location || lead.address?.city || "N/A",
      zone: lead.zone || lead.region || "N/A",
      property: lead.propertyType || "—",
      status: lead.lead_status || lead.status || "Pending",
      stageName: lead.lead_stage || lead.currentStage || "Not Started",
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
 
                  {/* <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                      {selectedLead ? "Edit Lead" : "Create Lead"}
                    </h1>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      ← Back to Leads
                    </Button>
                  </div> */}
 
                  <Leads
                    data={selectedLead}
                    onSubmit={handleLeadSubmit}
                    onClose={() => setOpen(false)}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                  />
                </div>
 
                {/* Right-side Communication History and Wild Cards (show when editing) */}
                {selectedLead && (
                  <div className="lg:col-span-1 space-y-4 sticky top-4 h-fit">
                    {/* Communication History - 40% height */}
                    <div className="h-[40vh] rounded-lg border bg-slate-50">
                      <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                        <div className="text-sm font-semibold text-slate-800">
                        Calls History
                        </div>
                        <div className="text-xs text-slate-500">
                          Message thread
                        </div>
                      </div>

                      <div className="p-4 space-y-3 max-h-[32vh] overflow-y-auto">
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

                        {/* Fallback to leadComments if no other data */}
                        {(!selectedLead?.calls?.length && !selectedLead?.remark && !selectedLead?.comment && !selectedLead?.checkNotes && !selectedLead?.checkListPage?.[0]?.notes) && leadComments.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No comments
                          </div>
                        ) : (
                          (!selectedLead?.calls?.length && !selectedLead?.remark && !selectedLead?.comment && !selectedLead?.checkNotes && !selectedLead?.checkListPage?.[0]?.notes) &&
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

                    {/* Wild Cards Section */}
                    <div className="h-[40vh] rounded-lg border bg-slate-50">
                      <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                        <div className="text-sm font-semibold text-slate-800">
                          Wild Cards
                        </div>
                        <div className="text-xs text-slate-500">
                          Additional information & actions
                        </div>
                      </div>

                      <div className="p-4 space-y-3 max-h-[32vh] overflow-y-auto">
                        <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-2">Quick Actions</p>
                          <div className="space-y-2">
                            <button className="w-full text-left text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded transition-colors">
                              📞 Schedule Call
                            </button>
                            <button className="w-full text-left text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded transition-colors">
                              📅 Schedule Site Visit
                            </button>
                            <button className="w-full text-left text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-2 py-1 rounded transition-colors">
                              📋 Generate Report
                            </button>
                          </div>
                        </div>

                        <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-slate-700">Active Lead</span>
                          </div>
                        </div>

                        <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Priority</p>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            Medium Priority
                          </span>
                        </div>

                        <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Next Follow-up</p>
                          <p className="text-xs text-slate-700">Tomorrow, 2:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : isViewMode ? (
        /* VIEW MODE - Use the Leads component with viewMode */
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Leads
                    data={viewLead}
                    viewMode={true}
                    onClose={() => setIsViewMode(false)}
                  />
                </div>

                {/* Right-side calls and notes thread (show when viewing) */}
                <div className="lg:col-span-1 space-y-4 sticky top-4 h-fit">
                  {/* Communication History - 40% height */}
                  <div className="h-[40vh] rounded-lg border bg-slate-50">
                    <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                      <div className="text-sm font-semibold text-slate-800">
                      Notes
                      </div>
                    </div>

                    <div className="p-4 space-y-3 max-h-[32vh] overflow-y-auto">
                      {/* Display calls history if available */}
                      {viewLead?.calls && viewLead.calls.length > 0 && 
                        viewLead.calls.map((call, index) => (
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
                      {viewLead?.remark && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Remark:</p>
                          {viewLead.remark}
                        </div>
                      )}
                      {viewLead?.comment && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Comment:</p>
                          {viewLead.comment}
                        </div>
                      )}
                      {viewLead?.checkNotes && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Additional Notes:</p>
                          {viewLead.checkNotes}
                        </div>
                      )}
                      {viewLead?.checkListPage?.[0]?.notes && (
                        <div className="w-full border bg-white px-3 py-2 text-sm text-slate-800 rounded-md shadow-sm">
                          <p className="text-xs font-medium text-slate-600 mb-1">Site Visit Notes:</p>
                          {viewLead.checkListPage[0].notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* yield Cards Section */}
                  <div className="h-[40vh] rounded-lg border bg-slate-50">
                    <div className="px-4 py-3 border-b bg-white rounded-t-lg">
                      <div className="text-sm font-semibold text-slate-800">
                        yield Cards
                      </div>
                      <div className="text-xs text-slate-500">
                        Additional information & actions
                      </div>
                    </div>

                    <div className="p-4 space-y-3 max-h-[32vh] overflow-y-auto">
                      <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                        <p className="text-xs font-medium text-slate-600 mb-2">Quick Actions</p>
                        <div className="space-y-2">
                          <button className="w-full text-left text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded transition-colors">
                            📞 Schedule Call
                          </button>
                          <button className="w-full text-left text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded transition-colors">
                            📅 Schedule Site Visit
                          </button>
                          <button className="w-full text-left text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-2 py-1 rounded transition-colors">
                            📋 Generate Report
                          </button>
                        </div>
                      </div>

                      <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                        <p className="text-xs font-medium text-slate-600 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-slate-700">Active Lead</span>
                        </div>
                      </div>

                      <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                        <p className="text-xs font-medium text-slate-600 mb-1">Priority</p>
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          Medium Priority
                        </span>
                      </div>

                      <div className="w-full border bg-white px-3 py-2 rounded-md shadow-sm">
                        <p className="text-xs font-medium text-slate-600 mb-1">Next Follow-up</p>
                        <p className="text-xs text-slate-700">Tomorrow, 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main page content when not editing or viewing */
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-indigo-700">Leads</h1>
                <p className="text-sm text-gray-500 mt-1">Leads list · Last updated today</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-gray-700" 
                  onClick={async () => {
                    const loadingToast = toast.loading('Refreshing leads...');
                    try {
                      await fetchLeads();
                      toast.success('Leads refreshed', { 
                        id: loadingToast,
                        icon: <Check className="w-5 h-5 text-green-500" />,
                        duration: 2000
                      });
                    } catch (err) {
                      console.error('Failed to refresh leads:', err);
                      const errorMessage = err.response?.data?.message || 'Could not refresh leads. Please try again.';
                      
                      toast.error(errorMessage, { 
                        id: loadingToast,
                        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
                        duration: 5000
                      });
                    }
                  }} 
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.lead_id || lead.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.phone || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.zone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.property || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${String(lead.status).toLowerCase() === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {lead.registeredDate ? 
                            (new Date(lead.registeredDate).toString() !== 'Invalid Date' ? 
                              new Date(lead.registeredDate).toISOString().split("T")[0] : 
                              lead.registeredDate
                            ) : 
                            "—"
                          }
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
                                onClick={() => handleDeleteLead(lead.raw)}
                                disabled={!canPerformAction(lead.raw, 'delete').enabled}
                                className="cursor-pointer text-red-600 hover:bg-red-50"
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
 
              {loading && <div className="text-center py-12 text-gray-500"><p>Loading leads...</p></div>}
              {error && <div className="text-center py-12 text-red-500"><p>Error: {error}</p></div>}
              {!loading && !error && filteredLeads.length === 0 && <div className="text-center py-12 text-gray-500"><p>No leads found matching your criteria.</p></div>}
 
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
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.onClose}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        cancelText="Cancel"
        variant={confirmModal.variant}
        loading={confirmModal.loading}
      />
    </div>
  );
}
