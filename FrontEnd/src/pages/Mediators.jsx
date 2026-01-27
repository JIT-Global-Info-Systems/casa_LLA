

import React, { useState, useEffect } from "react";
import { useMediators } from "../context/MediatorsContext.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useEntityAction } from "@/hooks/useEntityAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
 
function Mediators() {
  const { mediators, loading, error, fetchMediators, createMediator, updateMediator, deleteMediator } = useMediators();
  const [open, setOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [viewMediator, setViewMediator] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Entity action hook for status-aware delete
  const { handleDelete, canPerformAction, confirmModal } = useEntityAction('mediator');

  useEffect(() => {
    fetchMediators();
  }, []);

  const [formData, setFormData] = useState({
    mediatorName: "",
    email: "",
    phonePrimary: "",
    phoneSecondary: "",
    category: "",
    panNumber: "",
    aadhaarNumber: "",
    location: "",
    linkedExecutive: "",
    officeIndividual: "",
    address: "",
  });

  const handleCreate = () => {
    setSelectedMediator(null);
    setOpen(true);
  };

  const [files, setFiles] = useState({
    pan_upload: null,
    aadhar_upload: null,
  });

  const filteredMediators = mediators.filter((mediator) => {
    const matchesSearch =
      searchTerm === "" ||
      mediator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.phone_primary?.includes(searchTerm) ||
      mediator._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExecutive =
      selectedExecutive === "" || mediator.linked_executive === selectedExecutive;

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const mediatorDate = new Date(mediator.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return mediatorDate >= fromDate && mediatorDate <= toDate;
    })();
 
    return matchesSearch && matchesExecutive && matchesDateRange;
  });
 
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSave = async () => {
    try {
      const apiData = {
        name: formData.mediatorName,
        email: formData.email,
        phone_primary: formData.phonePrimary,
        phone_secondary: formData.phoneSecondary,
        category: formData.category,
        pan_number: formData.panNumber,
        aadhar_number: formData.aadhaarNumber,
        location: formData.location,
        linked_executive: formData.linkedExecutive,
        mediator_type: formData.officeIndividual,
        address: formData.address,
      };

      if (selectedMediator) {
        await updateMediator(selectedMediator._id, apiData);
      } else {
        await createMediator(apiData, files);
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving mediator:", error);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedExecutive("");
    setDateFrom("");
    setDateTo("");
    fetchMediators();
  };

  const resetForm = () => {
    setFormData({
      mediatorName: "",
      email: "",
      phonePrimary: "",
      phoneSecondary: "",
      category: "",
      panNumber: "",
      aadhaarNumber: "",
      location: "",
      linkedExecutive: "",
      officeIndividual: "",
      address: "",
    });
    setFiles({ pan_upload: null, aadhar_upload: null });
    setSelectedMediator(null);
    setFiles({
      pan_upload: null,
      aadhar_upload: null,
    });
  };
 
  const handleEdit = (mediator) => {
    setSelectedMediator(mediator);
    setOpen(true);

    // Format address for display: if object, convert to formatted string; otherwise use as-is
    let addressDisplay = "";
    if (mediator.address) {
      if (typeof mediator.address === 'object') {
        // Format address object as readable string
        const addr = mediator.address;
        const parts = [];
        if (addr.street) parts.push(addr.street);
        if (addr.city) parts.push(addr.city);
        if (addr.state) parts.push(addr.state);
        if (addr.pincode) parts.push(addr.pincode);
        addressDisplay = parts.join(", ");
      } else {
        addressDisplay = mediator.address;
      }
    }

    setFormData({
      mediatorName: mediator.name || "",
      email: mediator.email || "",
      phonePrimary: mediator.phone_primary || "",
      phoneSecondary: mediator.phone_secondary || "",
      category: mediator.category || "",
      panNumber: mediator.pan_number || "",
      aadhaarNumber: mediator.aadhar_number || "",
      location: mediator.location || "",
      linkedExecutive: mediator.linked_executive || "",
      officeIndividual: mediator.mediator_type || "",
      address: addressDisplay,
    });
  };

  const handleView = (mediator) => {
    setViewMediator(mediator);
    setIsViewMode(true);
  };

  const handleDeleteMediator = (mediator) => {
    // Check if delete is allowed
    const deleteState = canPerformAction(mediator, 'delete');
    
    if (!deleteState.enabled) {
      // Mediator is already inactive/deleted - don't show error
      return;
    }

    // Perform delete with status check
    handleDelete(mediator, async () => {
      await deleteMediator(mediator._id);
      fetchMediators(); // Refresh list
    }, mediator.name);
  };
 
  return (
    <div>
      {/* FORM VIEW */}
      {open && (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }} 
                  className="bg-white shadow-sm hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {selectedMediator ? "Edit Mediator" : "Add Mediator"}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedMediator ? "Update the mediator details below" : "Fill in the details below to create a new mediator"}
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Mediator Information</CardTitle>
                <CardDescription>Personal and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="mediatorName"
                  className="text-gray-700 font-medium"
                >
                  Mediator Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mediatorName"
                  value={formData.mediatorName}
                  onChange={(e) =>
                    handleInputChange("mediatorName", e.target.value)
                  }
                  placeholder="Enter mediator name"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 font-medium"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phonePrimary"
                  className="text-gray-700 font-medium"
                >
                  Phone Primary <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phonePrimary"
                  value={formData.phonePrimary}
                  onChange={(e) =>
                    handleInputChange("phonePrimary", e.target.value)
                  }
                  placeholder="Enter primary phone"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneSecondary"
                  className="text-gray-700 font-medium"
                >
                  Phone Secondary
                </Label>
                <Input
                  id="phoneSecondary"
                  value={formData.phoneSecondary}
                  onChange={(e) =>
                    handleInputChange("phoneSecondary", e.target.value)
                  }
                  placeholder="Enter secondary phone"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-gray-700 font-medium"
                >
                  Category <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-50/50 border-gray-300"
                    >
                      {formData.category || "Select category"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                    <DropdownMenuItem
                      onClick={() => handleInputChange("category", "Individual")}
                      className="cursor-pointer"
                    >
                      Individual
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInputChange("category", "Office")}
                      className="cursor-pointer"
                    >
                      Office
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="panNumber"
                  className="text-gray-700 font-medium"
                >
                  PAN Number
                </Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange("panNumber", e.target.value)}
                  placeholder="Enter PAN number"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="aadhaarNumber"
                  className="text-gray-700 font-medium"
                >
                  Aadhaar Number
                </Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    handleInputChange("aadhaarNumber", e.target.value)
                  }
                  placeholder="Enter Aadhaar number"
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-gray-700 font-medium"
                >
                  Location
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-50/50 border-gray-300"
                    >
                      {formData.location || "Select location"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                    <DropdownMenuItem
                      onClick={() => handleInputChange("location", "Mumbai")}
                      className="cursor-pointer"
                    >
                      Mumbai
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInputChange("location", "Delhi")}
                      className="cursor-pointer"
                    >
                      Delhi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInputChange("location", "Bangalore")}
                      className="cursor-pointer"
                    >
                      Bangalore
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInputChange("location", "Chennai")}
                      className="cursor-pointer"
                    >
                      Chennai
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="linkedExecutive"
                  className="text-gray-700 font-medium"
                >
                  Link an Executive
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-50/50 border-gray-300"
                    >
                      {formData.linkedExecutive || "Select executive"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                    <DropdownMenuItem
                      onClick={() =>
                        handleInputChange("linkedExecutive", "Executive 1")
                      }
                      className="cursor-pointer"
                    >
                      Executive 1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleInputChange("linkedExecutive", "Executive 2")
                      }
                      className="cursor-pointer"
                    >
                      Executive 2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleInputChange("linkedExecutive", "Executive 3")
                      }
                      className="cursor-pointer"
                    >
                      Executive 3
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="officeIndividual"
                  className="text-gray-700 font-medium"
                >
                  Office / Individual
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-50/50 border-gray-300"
                    >
                      {formData.officeIndividual || "Select type"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                    <DropdownMenuItem
                      onClick={() =>
                        handleInputChange("officeIndividual", "Office")
                      }
                      className="cursor-pointer"
                    >
                      Office
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleInputChange("officeIndividual", "Individual")
                      }
                      className="cursor-pointer"
                    >
                      Individual
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="panUpload"
                  className="text-gray-700 font-medium"
                >
                  PAN Upload
                </Label>
                <Input
                  id="panUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("pan_upload", e.target.files[0])}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {files.pan_upload && (
                  <p className="text-xs text-gray-500">Selected: {files.pan_upload.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="aadharUpload"
                  className="text-gray-700 font-medium"
                >
                  Aadhaar Upload
                </Label>
                <Input
                  id="aadharUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("aadhar_upload", e.target.files[0])}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {files.aadhar_upload && (
                  <p className="text-xs text-gray-500">Selected: {files.aadhar_upload.name}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="address"
                  className="text-gray-700 font-medium"
                >
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                  className="bg-gray-50/50"
                />
              </div>
              </CardContent>
              <div className="border-t px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {selectedMediator ? "Update Mediator" : "Add Mediator"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW MODE */}
      {isViewMode && (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsViewMode(false)} 
                  className="bg-white shadow-sm hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">View Mediator</h1>
                  <p className="text-gray-500 text-sm mt-1">View the mediator details below</p>
                </div>
              </div>
            </div>

            {viewMediator && (
              <Card className="border-0 shadow-md bg-white overflow-hidden">
                <div className="h-2 bg-indigo-500 w-full" />
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Mediator Information</CardTitle>
                  <CardDescription>Personal and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Mediator Name</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.name || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Email</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.email || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Phone Primary</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.phone_primary || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Phone Secondary</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.phone_secondary || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Category</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {viewMediator.category || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">PAN Number</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.pan_number || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Aadhaar Number</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.aadhar_number || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Location</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.location || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Linked Executive</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.linked_executive || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Office / Individual</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.mediator_type || '-'}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-gray-700 font-medium">Address</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[60px] flex items-start">
                      {viewMediator.address || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Created Date</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                      {viewMediator.created_at ? new Date(viewMediator.created_at).toLocaleDateString() : '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Mediator ID</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center text-sm font-mono">
                      {viewMediator._id || '-'}
                    </div>
                  </div>
                </CardContent>
                <div className="border-t px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewMode(false)}
                    className="border-gray-300"
                  >
                    Back to List
                  </Button>
                  <Button
                    onClick={() => {
                      handleEdit(viewMediator);
                      setIsViewMode(false);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Mediator
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {!open && !isViewMode && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-indigo-700">Mediators</h1>
                <p className="text-sm text-gray-500 mt-1">Mediator list · Last updated today</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-gray-700" onClick={handleRefresh} disabled={loading}>
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
          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-slate-600">Loading mediators...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <Card className="bg-white shadow-sm">
              {/* Filters */}
              <div className="p-6 border-b flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                  <Input
                    placeholder="Search mediators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">Executive:</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-[140px] justify-between bg-white border-gray-300">
                        <span className="truncate">{selectedExecutive || "Select"}</span>
                        <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border shadow-lg">
                      <DropdownMenuItem onClick={() => setSelectedExecutive("")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedExecutive("Admin")}>Admin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedExecutive("Manager")}>Manager</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedExecutive("Executive")}>Executive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

              {/* Table */}
              <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Registered Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Created By
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMediators.map((mediator) => (
                          <tr
                            key={mediator._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mediator.mediator_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {mediator.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {mediator.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {mediator.phone_primary}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {mediator.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(mediator.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {mediator.linked_executive || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-white border shadow-lg"
                                >
                                  <DropdownMenuItem onClick={() => handleView(mediator)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(mediator)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-600" 
                                    onClick={() => handleDeleteMediator(mediator)}
                                    disabled={!canPerformAction(mediator, 'delete').enabled}
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

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredMediators.length} results</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled className="text-gray-400">Previous</Button>
                      <Button variant="outline" size="sm" disabled className="text-gray-400">Next</Button>
                      <Button variant="outline" size="sm" disabled className="text-gray-400">Last</Button>
                    </div>
                  </div>
              </CardContent>
            </Card>
          )}
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
 
export default Mediators;
 