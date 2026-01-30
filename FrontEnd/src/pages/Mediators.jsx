
 
import React, { useState, useEffect } from "react";
import { useMediators } from "../context/MediatorsContext.jsx";
import { useMaster } from "../context/Mastercontext.jsx";
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
  Plus,
  RefreshCw,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  FileText,
  Building2,
  Search,
  X,
} from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";

function Mediators() {
  const { mediators, loading, error, fetchMediators, createMediator, updateMediator, deleteMediator } = useMediators();
  const { masters, fetchTypes } = useMaster();
  const [open, setOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [viewMediator, setViewMediator] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { handleDelete, canPerformAction, confirmModal } = useEntityAction('mediator');

  useEffect(() => {
    fetchMediators();
    fetchTypes();
  }, []);

  const [formData, setFormData] = useState({
    mediatorName: "",
    email: "",
    phonePrimary: "",
    phoneSecondary: "",
    type: "",
    panNumber: "",
    aadhaarNumber: "",
    location: "",
    linkedExecutive: "",
    officeIndividual: "",
    address: "",
  });

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

  const handleCreate = () => {
    setSelectedMediator(null);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const apiData = {
        name: formData.mediatorName,
        email: formData.email,
        phone_primary: formData.phonePrimary,
        phone_secondary: formData.phoneSecondary,
        category: formData.type,
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedExecutive("");
    setDateFrom("");
    setDateTo("");
  };

  const resetForm = () => {
    setFormData({
      mediatorName: "",
      email: "",
      phonePrimary: "",
      phoneSecondary: "",
      type: "",
      panNumber: "",
      aadhaarNumber: "",
      location: "",
      linkedExecutive: "",
      officeIndividual: "",
      address: "",
    });
    setFiles({ pan_upload: null, aadhar_upload: null });
    setSelectedMediator(null);
  };

  const handleEdit = (mediator) => {
    setSelectedMediator(mediator);
    setOpen(true);

    let addressDisplay = "";
    if (mediator.address) {
      if (typeof mediator.address === 'object') {
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
      type: mediator.category || "",
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
    const deleteState = canPerformAction(mediator, 'delete');
    if (!deleteState.enabled) {
      return;
    }

    handleDelete(mediator, async () => {
      await deleteMediator(mediator._id);
    }, mediator.name);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* FORM VIEW */}
      {open && (
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Enhanced Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 border-slate-200"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedMediator ? "Edit Mediator" : "Add New Mediator"}
                    </h1>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedMediator ? "Update the mediator details below" : "Fill in the details to create a new mediator"}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Form Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-1.5 bg-indigo-500" />
              <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">Mediator Information</CardTitle>
                    <CardDescription className="text-slate-600">Personal and contact details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                {/* Form Fields with Icons */}
                <div className="space-y-2">
                  <Label htmlFor="mediatorName" className="text-slate-700 font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    Mediator Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mediatorName"
                    value={formData.mediatorName}
                    onChange={(e) => handleInputChange("mediatorName", e.target.value)}
                    placeholder="Enter mediator name"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phonePrimary" className="text-slate-700 font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    Phone Primary <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phonePrimary"
                    value={formData.phonePrimary}
                    onChange={(e) => handleInputChange("phonePrimary", e.target.value)}
                    placeholder="Enter primary phone"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneSecondary" className="text-slate-700 font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    Phone Secondary
                  </Label>
                  <Input
                    id="phoneSecondary"
                    value={formData.phoneSecondary}
                    onChange={(e) => handleInputChange("phoneSecondary", e.target.value)}
                    placeholder="Enter secondary phone"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-700 font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all h-10"
                      >
                        <span className="text-slate-700 truncate">{formData.type || "Select type"}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="w-[--radix-dropdown-menu-trigger-width] bg-white border-slate-200 shadow-lg"
                    >
                      {masters.types && masters.types.length > 0 ? (
                        masters.types.map((type) => (
                          <DropdownMenuItem
                            key={type.id}
                            onClick={() => handleInputChange("type", type.name)}
                            className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 transition-colors"
                          >
                            {type.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No types available</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber" className="text-slate-700 font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    PAN Number
                  </Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value)}
                    placeholder="Enter PAN number"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber" className="text-slate-700 font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Aadhaar Number
                  </Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                    placeholder="Enter Aadhaar number"
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    Location
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all h-10"
                      >
                        <span className="text-slate-700 truncate">{formData.location || "Select location"}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="w-[--radix-dropdown-menu-trigger-width] bg-white border-slate-200 shadow-lg"
                    >
                      {["Mumbai", "Delhi", "Bangalore", "Chennai"].map((city) => (
                        <DropdownMenuItem
                          key={city}
                          onClick={() => handleInputChange("location", city)}
                          className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 transition-colors"
                        >
                          {city}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedExecutive" className="text-slate-700 font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    Link an Executive
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all h-10"
                      >
                        <span className="text-slate-700 truncate">{formData.linkedExecutive || "Select executive"}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="w-[--radix-dropdown-menu-trigger-width] bg-white border-slate-200 shadow-lg"
                    >
                      {["Executive 1", "Executive 2", "Executive 3"].map((exec) => (
                        <DropdownMenuItem
                          key={exec}
                          onClick={() => handleInputChange("linkedExecutive", exec)}
                          className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 transition-colors"
                        >
                          {exec}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeIndividual" className="text-slate-700 font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    Office / Individual
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 transition-all h-10"
                      >
                        <span className="text-slate-700 truncate">{formData.officeIndividual || "Select type"}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="w-[--radix-dropdown-menu-trigger-width] bg-white border-slate-200 shadow-lg"
                    >
                      {["Office", "Individual"].map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => handleInputChange("officeIndividual", type)}
                          className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 transition-colors"
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panUpload" className="text-slate-700 font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    PAN Upload
                  </Label>
                  <div className="relative">
                    <Input
                      id="panUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("pan_upload", e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="panUpload"
                      className="flex items-center justify-center w-full h-10 px-4 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded group-hover:bg-indigo-200 transition-colors">
                          <FileText className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-indigo-700 transition-colors">
                          {files.pan_upload ? "Change file" : "Choose file"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {files.pan_upload && (
                    <div className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                      <p className="text-xs text-indigo-700 font-medium truncate flex-1">
                        {files.pan_upload.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileChange("pan_upload", null);
                        }}
                        className="p-1 hover:bg-indigo-200 rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-indigo-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadharUpload" className="text-slate-700 font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Aadhaar Upload
                  </Label>
                  <div className="relative">
                    <Input
                      id="aadharUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("aadhar_upload", e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="aadharUpload"
                      className="flex items-center justify-center w-full h-10 px-4 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded group-hover:bg-indigo-200 transition-colors">
                          <FileText className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-indigo-700 transition-colors">
                          {files.aadhar_upload ? "Change file" : "Choose file"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {files.aadhar_upload && (
                    <div className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                      <p className="text-xs text-indigo-700 font-medium truncate flex-1">
                        {files.aadhar_upload.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileChange("aadhar_upload", null);
                        }}
                        className="p-1 hover:bg-indigo-200 rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-indigo-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-slate-700 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                    className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all resize-none"
                  />
                </div>
              </CardContent>
              
              <div className="border-t border-slate-100 px-8 py-4 bg-slate-50/50 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="border-slate-300 hover:bg-slate-100 transition-colors"
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
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsViewMode(false)}
                  className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 border-slate-200"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      View Mediator
                    </h1>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View the mediator details below
                  </p>
                </div>
              </div>
            </div>

            {viewMediator && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />
                <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-800">Mediator Information</CardTitle>
                        <CardDescription className="text-slate-600">Personal and contact details</CardDescription>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      Active
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Mediator Name
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800 font-medium">
                      {viewMediator.name || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.email || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Phone Primary
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.phone_primary || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Phone Secondary
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.phone_secondary || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      Type
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {viewMediator.category || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      PAN Number
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800 font-mono text-sm">
                      {viewMediator.pan_number || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Aadhaar Number
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800 font-mono text-sm">
                      {viewMediator.aadhar_number || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.location || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Linked Executive
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.linked_executive || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      Office / Individual
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.mediator_type || '-'}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Address
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800 min-h-[60px]">
                      {viewMediator.address || '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Created Date
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800">
                      {viewMediator.created_at ? new Date(viewMediator.created_at).toLocaleDateString() : '-'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-600 font-medium text-sm flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Mediator ID
                    </Label>
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs">
                      {viewMediator._id || '-'}
                    </div>
                  </div>
                </CardContent>
                
                <div className="border-t border-slate-100 px-8 py-4 bg-slate-50/50 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewMode(false)}
                    className="border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    Back to List
                  </Button>
                  <Button
                    onClick={() => {
                      handleEdit(viewMediator);
                      setIsViewMode(false);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30 transition-all duration-200"
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
                <Button
                  variant="ghost"
                  className="text-gray-700"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleCreate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
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
                    placeholder="Search mediators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">Executive:</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[140px] justify-between border-gray-300"
                      >
                        {selectedExecutive || "All Executives"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border shadow-lg">
                      <DropdownMenuItem
                        onClick={() => setSelectedExecutive("")}
                        className="cursor-pointer"
                      >
                        All Executives
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedExecutive("Admin")}
                        className="cursor-pointer"
                      >
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedExecutive("Manager")}
                        className="cursor-pointer"
                      >
                        Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedExecutive("Executive")}
                        className="cursor-pointer"
                      >
                        Executive
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
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Loading mediators...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <X className="h-4 w-4" />
                            <span>Error: {error}</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredMediators.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No mediators found
                        </td>
                      </tr>
                    ) : (
                      filteredMediators.map((mediator) => (
                        <tr key={mediator._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {mediator.mediator_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mediator.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {mediator.category || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {mediator.phone_primary || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {mediator.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDisplayDate(mediator.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {mediator.linked_executive || 'N/A'}
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
                                <DropdownMenuItem onClick={() => handleView(mediator)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(mediator)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMediator(mediator)}
                                  disabled={!canPerformAction(mediator, 'delete').enabled}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
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
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredMediators.length, 10)}</span> of{' '}
                  <span className="font-medium">{filteredMediators.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={true}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-600 flex items-center">
                    Page 1 of 1
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={true}
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

export default Mediators;