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

 

  // Reset to page 1 when filters change

  useEffect(() => {

    setCurrentPage(1);

  }, [searchTerm, dateFrom, dateTo]);

 

  // Calculate pagination

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

 

  return (

    <div className="flex-1 space-y-6 p-0">

      {open ? (

        /* Full page view when editing/creating */

        <div className="min-h-screen bg-gray-50 p-4">

          {/* Lead Stepper - Full Width Outside Grid - Shows for both new and existing leads */}

          <div className="bg-white rounded-t-lg shadow-md px-6 py-4 mb-0">

            <Leads

              data={selectedLead}

              currentStep={currentStep}

              onStepChange={setCurrentStep}

              stepperOnly={true}

            />

          </div>

          

          <div className="w-full">

            <div className="bg-white rounded-lg shadow-md p-6 rounded-t-none">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-top">

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

                    hideStepper={true}

                  />

                </div>

                

                {/* Right Sidebar - Call History & Yield Info */}

                {selectedLead && (

                  <div className="lg:col-span-1 space-y-4 mt-52">

                    <Card className="bg-white shadow-sm min-h-100">

                      <CardHeader>

                        <CardTitle className="text-lg font-semibold text-gray-800">Call History</CardTitle>

                      </CardHeader>

                      <CardContent className="overflow-y-auto max-h-80">

                        <div className="space-y-3">

                          {/* Show Notes if available from checkListPage */}

                          {selectedLead.checkListPage && selectedLead.checkListPage[0]?.notes && (

                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">

                              <div className="flex items-start gap-2 mb-2">

                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">

                                  Notes

                                </span>

                              </div>

                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLead.checkListPage[0].notes}</p>

                            </div>

                          )}

                          

                          {/* Show Call History */}

                          {selectedLead.calls && selectedLead.calls.length > 0 ? (

                            selectedLead.calls.map((call, index) => (

                              <div key={index} className="p-3 bg-gray-50 rounded-lg border">

                                <div className="flex justify-between items-start mb-2">

                                  <span className="text-sm font-medium text-gray-700">

                                    {new Date(call.date || call.createdAt).toLocaleDateString()}

                                  </span>

                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">

                                    {call.type || 'Call'}

                                  </span>

                                </div>

                                <p className="text-sm text-gray-600">{call.notes || call.description || 'No notes available'}</p>

                                {call.duration && (

                                  <p className="text-xs text-gray-500 mt-1">Duration: {call.duration}</p>

                                )}

                              </div>

                            ))

                          ) : null}

                          

                          {/* Show message if no data at all */}

                          {(!selectedLead.checkListPage || !selectedLead.checkListPage[0]?.notes) && (!selectedLead.calls || selectedLead.calls.length === 0) && (

                            <p className="text-sm text-gray-500 italic">No call history or notes available</p>

                          )}

                        </div>

                      </CardContent>

                    </Card>



                    <Card className="bg-white shadow-sm min-h-100">

                      <CardHeader>

                        <CardTitle className="text-lg font-semibold text-gray-800">Yield Information</CardTitle>

                      </CardHeader>

                      <CardContent className="overflow-y-auto max-h-80">

                        <div className="space-y-3">

                          {selectedLead.yield && selectedLead.yield !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Yield %:</span>

                              <span className="text-lg font-bold text-green-600">

                                {selectedLead.yield}%

                              </span>

                            </div>

                          )}

                          {/*

                          Revenue metrics hidden per user request

                          {selectedLead.revenue && selectedLead.revenue !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Revenue:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(selectedLead.revenue).toLocaleString()}

                              </span>

                            </div>

                          )}

                          {selectedLead.rate && selectedLead.rate !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Rate:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(selectedLead.rate).toLocaleString()}

                              </span>

                            </div>

                          )}

                          {selectedLead.asp && selectedLead.asp !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">ASP:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(selectedLead.asp).toLocaleString()}

                              </span>

                            </div>

                          )}

                          */}

                          {!selectedLead.yield && (

                            <p className="text-sm text-gray-500 italic">No yield information available</p>

                          )}

                        </div>

                      </CardContent>

                    </Card>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      ) : isViewMode ? (

        /* VIEW MODE - Use the Leads component with viewMode and right sidebar */

        <div className="min-h-screen bg-gray-50 p-4">

          {/* Lead Stepper - Full Width Outside Grid - Shows for view mode */}

          <div className="bg-white rounded-t-lg shadow-md px-6 py-4 mb-0">

            <Leads

              data={viewLead}

              currentStep={currentStep}

              onStepChange={setCurrentStep}

              stepperOnly={true}

            />

          </div>

          

          <div className="w-full">

            <div className="bg-white rounded-lg shadow-md p-6 rounded-t-none">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-top">

                <div className="lg:col-span-2 space-y-4">

                  <Leads

                    data={viewLead}

                    viewMode={true}

                    onClose={() => setIsViewMode(false)}

                    currentStep={currentStep}

                    onStepChange={setCurrentStep}

                    hideStepper={true}

                  />

                </div>

                

                {/* Right Sidebar - Call History & Yield Info for View Mode */}

                {viewLead && (

                  <div className="lg:col-span-1 space-y-4 mt-52">

                    <Card className="bg-white shadow-sm min-h-100">

                      <CardHeader>

                        <CardTitle className="text-lg font-semibold text-gray-800">Call History</CardTitle>

                      </CardHeader>

                      <CardContent className="overflow-y-auto max-h-80">

                        <div className="space-y-3">

                          {/* Show Notes if available from checkListPage */}

                          {viewLead.checkListPage && viewLead.checkListPage[0]?.notes && (

                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">

                              <div className="flex items-start gap-2 mb-2">

                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">

                                  Notes

                                </span>

                              </div>

                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewLead.checkListPage[0].notes}</p>

                            </div>

                          )}

                          

                          {/* Show Call History */}

                          {viewLead.calls && viewLead.calls.length > 0 ? (

                            viewLead.calls.map((call, index) => (

                              <div key={index} className="p-3 bg-gray-50 rounded-lg border">

                                <div className="flex justify-between items-start mb-2">

                                  <span className="text-sm font-medium text-gray-700">

                                    {new Date(call.date || call.createdAt).toLocaleDateString()}

                                  </span>

                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">

                                    {call.type || 'Call'}

                                  </span>

                                </div>

                                <p className="text-sm text-gray-600">{call.notes || call.description || 'No notes available'}</p>

                                {call.duration && (

                                  <p className="text-xs text-gray-500 mt-1">Duration: {call.duration}</p>

                                )}

                              </div>

                            ))

                          ) : null}

                          

                          {/* Show message if no data at all */}

                          {(!viewLead.checkListPage || !viewLead.checkListPage[0]?.notes) && (!viewLead.calls || viewLead.calls.length === 0) && (

                            <p className="text-sm text-gray-500 italic">No call history or notes available</p>

                          )}

                        </div>

                      </CardContent>

                    </Card>



                    <Card className="bg-white shadow-sm min-h-100">

                      <CardHeader>

                        <CardTitle className="text-lg font-semibold text-gray-800">Yield Information</CardTitle>

                      </CardHeader>

                      <CardContent className="overflow-y-auto max-h-80">

                        <div className="space-y-3">

                          {viewLead.yield && viewLead.yield !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Yield %:</span>

                              <span className="text-lg font-bold text-green-600">

                                {viewLead.yield}%

                              </span>

                            </div>

                          )}

                          {/*

                          Revenue metrics hidden per user request

                          {viewLead.revenue && viewLead.revenue !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Revenue:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(viewLead.revenue).toLocaleString()}

                              </span>

                            </div>

                          )}

                          {viewLead.rate && viewLead.rate !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">Rate:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(viewLead.rate).toLocaleString()}

                              </span>

                            </div>

                          )}

                          {viewLead.asp && viewLead.asp !== '0' && (

                            <div className="flex justify-between items-center">

                              <span className="text-sm font-medium text-gray-600">ASP:</span>

                              <span className="text-sm font-semibold text-gray-800">

                                ₹{Number(viewLead.asp).toLocaleString()}

                              </span>

                            </div>

                          )}

                          */}

                          {!viewLead.yield && (

                            <p className="text-sm text-gray-500 italic">No yield information available</p>

                          )}

                        </div>

                      </CardContent>

                    </Card>

                  </div>

                )}

              </div>

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

                                onClick={() => handleView(lead.raw)}

                                className="cursor-pointer"

                                disabled={isFetchingLead}

                              >

                                <Eye className="h-4 w-4 mr-2" />

                                View

                              </DropdownMenuItem>

                              <DropdownMenuItem

                                onClick={() => handleEdit(lead.raw)}

                                className="cursor-pointer"

                                disabled={isFetchingLead}

                              >

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

 

 