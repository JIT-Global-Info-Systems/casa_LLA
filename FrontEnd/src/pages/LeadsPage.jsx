//Leads table
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
// import LeadStepper from "@/components/ui/LeadStepper"
import Leads from "./Leads"
import { callsAPI } from "../services/api"
import { useLeads } from "../context/LeadsContext.jsx"
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useEntityAction } from "@/hooks/useEntityAction";
import toast from "react-hot-toast"
import { formatDateWithFallback, formatCallDate } from "@/utils/dateUtils";
 
export default function LeadsPage() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 
  const { leads, loading, error, fetchLeads, createLead, updateLead, deleteLead, getLeadById } = useLeads()
 
  const [currentStep, setCurrentStep] = useState(1)
  const [isFetchingLead, setIsFetchingLead] = useState(false)
  
  // Entity action hook for status-aware delete
  const { handleDelete, canPerformAction, confirmModal } = useEntityAction('lead');
  
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

  // Update currentStep when selectedLead changes, based on assignedTo
  useEffect(() => {
    const getStepFromAssignedTo = (lead) => {
      if (lead?.assignedTo) {
        const roleToStepMap = {
          'tele_caller': 1,
          'land_executive': 2,
          'analytics_team': 3,
          'feasibility_team': 4,
          'field_study_product_team': 5,
          'management_md_1st_level': 6,
          'l1_md': 7,
          'cmo_cro': 8,
          'legal': 9,
          'liaison': 10,
          'finance': 11,
          'admin': 12
        }
        
        const stepNumber = roleToStepMap[lead.assignedTo]
        if (stepNumber) {
          return stepNumber
        }
      }
      return 1 // Default to step 1
    }

    if (selectedLead) {
      setCurrentStep(getStepFromAssignedTo(selectedLead))
    } else if (viewLead) {
      setCurrentStep(getStepFromAssignedTo(viewLead))
    } else if (selectedLead === null) {
      // Reset to step 1 when creating new lead
      setCurrentStep(1)
    }
  }, [selectedLead, viewLead])
 
  const handleCreate = () => {
    setSelectedLead(null);
    setOpen(true);
  };
 
  const handleEdit = async (lead) => {
    setIsFetchingLead(true);
    try {
      const loadingToast = toast.loading('Loading lead details...');
      const fullLeadData = await getLeadById(lead._id || lead.id);
      setSelectedLead(fullLeadData);
      setOpen(true);
      // Fetch calls for this lead
      const allCalls = await callsAPI.getAll();
      const filteredCalls = allCalls.filter(c => {
        if (!c.leadId) return false;
        if (typeof c.leadId === 'object') return c.leadId._id === (lead._id || lead.id);
        return c.leadId === (lead._id || lead.id);
      });
      setCalls(filteredCalls);
      toast.success('Lead loaded for editing', { 
        id: loadingToast,
        icon: '✏️',
        duration: 2000
      });
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load lead details. Please try again.';
      toast.error(errorMessage, { 
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        duration: 5000
      });
    } finally {
      setIsFetchingLead(false);
    }
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
 
  const handleView = async (lead) => {
    setIsFetchingLead(true);
    try {
      const loadingToast = toast.loading('Loading lead details...');
      const fullLeadData = await getLeadById(lead._id || lead.id);
      setViewLead(fullLeadData);
      setIsViewMode(true);
      // Fetch calls for this lead
      const allCalls = await callsAPI.getAll();
      const filteredCalls = allCalls.filter(c => {
        if (!c.leadId) return false;
        if (typeof c.leadId === 'object') return c.leadId._id === (lead._id || lead.id);
        return c.leadId === (lead._id || lead.id);
      });
      setCalls(filteredCalls);
      toast.success('Viewing lead details', { 
        id: loadingToast,
        icon: '👁️',
        duration: 2000
      });
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load lead details. Please try again.';
      toast.error(errorMessage, { 
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        duration: 5000
      });
    } finally {
      setIsFetchingLead(false);
    }
  };
 
  const normalizedLeads = (Array.isArray(leads) ? leads : []).map((lead) => {
    const registeredDate =
      lead.createdAt || lead.registeredDate
        ? formatDateWithFallback(lead.createdAt || lead.registeredDate)
        : "N/A";

    return {
      ...lead,
      registeredDate,
    };
  });

  // Filter and paginate leads
  const filteredLeads = normalizedLeads.filter((lead) => {
    const matchesSearch = !searchTerm || 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.zone?.toLowerCase().includes(searchTerm.toLowerCase());

    const leadDate = new Date(lead.createdAt || lead.registeredDate);
    const matchesDateFrom = !dateFrom || leadDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || leadDate <= new Date(dateTo);

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  // Main component return
  return (
    <div>
    {(open || isViewMode) ? (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Lead Stepper - Full Width Outside Grid - Shows for both new and existing leads */}
        <div className="bg-white rounded-t-lg shadow-md px-6 py-4 mb-0">
          <Leads
            data={open ? selectedLead : viewLead}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            stepperOnly={true}
          />
        </div>
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-md p-6 rounded-t-none">
            <Leads
              data={open ? selectedLead : viewLead}
              viewMode={!open}
              onClose={open ? () => setOpen(false) : () => setIsViewMode(false)}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              hideStepper={true}
              calls={calls}
            />
          </div>
        </div>
      </div>
    ) : (
        /* Main page content when not editing or viewing */
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-400 mx-auto">
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
 
          <div className="max-w-400 mx-auto px-8 py-6">
            <Card className="bg-white shadow-sm">
              <div className="p-6 border-b flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-62.5">
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
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-37.5 border-gray-300" />
                </div>
 
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">To:</Label>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-37.5 border-gray-300" />
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
                    {paginatedLeads.map((lead) => (
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
                          {formatDateWithFallback(lead.registeredDate, "—")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                              <DropdownMenuItem 
                                onClick={() => handleView(lead)} 
                                className="cursor-pointer"
                                disabled={isFetchingLead}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEdit(lead)} 
                                className="cursor-pointer"
                                disabled={isFetchingLead}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteLead(lead)}
                                disabled={!canPerformAction(lead, 'delete').enabled}
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
                <p className="text-sm text-gray-600">Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="text-gray-700"
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-600 flex items-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="text-gray-700"
                  >
                    Next
                  </Button>
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