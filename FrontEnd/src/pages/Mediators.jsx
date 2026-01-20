import React, { useState, useEffect } from "react";
import { useMediators } from "../context/MediatorsContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

function Mediators() {
  const { mediators, loading, error, fetchMediators, createMediator, updateMediator, deleteMediator } = useMediators();
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch mediators on component mount
  useEffect(() => {
    fetchMediators();
  }, []); // Empty dependency array to run only once

  // Form state
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

  // File state for uploads
  const [files, setFiles] = useState({
    pan_upload: null,
    aadhar_upload: null,
  });

  // Generate new mediator ID
  const generateId = () => {
    const ids = mediators.map((m) => parseInt(m.id.replace("MED", "")));
    const maxId = Math.max(...ids, 0);
    return `MED${String(maxId + 1).padStart(3, "0")}`;
  };
 
  // Filter mediators
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
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
    setSelectedMediator(null);
  };
 
  const handleAdd = () => {
    resetForm();
    setIsAddEditModalOpen(true);
  };
 
  const handleEdit = (mediator) => {
    setSelectedMediator(mediator);
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
      address: mediator.address || "",
    });
    setIsAddEditModalOpen(true);
  };
 
  const handleDelete = async (mediator) => {
    if (window.confirm(`Are you sure you want to delete ${mediator.name}?`)) {
      try {
        await deleteMediator(mediator._id);
      } catch (error) {
        console.error("Error deleting mediator:", error);
      }
    }
  };
 
  const handleSave = async () => {
    try {
      // Map form data to API field names
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
        // Update existing mediator
        await updateMediator(selectedMediator._id, apiData);
      } else {
        // Create new mediator with files
        await createMediator(apiData, files);
      }

      setIsAddEditModalOpen(false);
      resetForm();
      setFiles({ pan_upload: null, aadhar_upload: null });
    } catch (error) {
      console.error("Error saving mediator:", error);
    }
  };
 
  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedExecutive("");
    setDateFrom("");
    setDateTo("");
  };
 
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">
          Mediators
          <div className="text-sm text-slate-500">
            Mediator list · Last updated today
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleAdd}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
 
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                <Input
                  placeholder="Search mediators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
 
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600 whitespace-nowrap">
                Executive:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[140px] justify-between bg-white"
                  >
                    <span className="truncate">
                      {selectedExecutive || "Select"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem onClick={() => setSelectedExecutive("")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Admin")}
                  >
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Manager")}
                  >
                    Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Executive")}
                  >
                    Executive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Category</TableHead>
                  <TableHead className="font-medium">Phone</TableHead>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium">Registered Date</TableHead>
                  <TableHead className="font-medium">Created By</TableHead>
                  <TableHead className="text-right font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMediators.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-slate-500"
                    >
                      No mediators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMediators.map((mediator) => (
                    <TableRow key={mediator._id}>
                      <TableCell className="font-medium">
                        {mediator._id}
                      </TableCell>
                      <TableCell>{mediator.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mediator.category === "Individual"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {mediator.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {mediator.phone_primary}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {mediator.email}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(mediator.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {mediator.linked_executive || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                              onClick={() => alert(`View ${mediator.name}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(mediator)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(mediator)}
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
          </div>
 
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredMediators.length} result
              {filteredMediators.length !== 1 ? "s" : ""}
              {filteredMediators.length !== mediators.length &&
                ` (of ${mediators.length} total)`}
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
 
      {/* Add/Edit Mediator Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {selectedMediator ? "Edit Mediator" : "Add Mediator"}
            </DialogTitle>
          </DialogHeader>
 
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="mediatorName"
                className="text-sm font-medium text-slate-700"
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
              />
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
              />
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="phonePrimary"
                className="text-sm font-medium text-slate-700"
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
              />
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="phoneSecondary"
                className="text-sm font-medium text-slate-700"
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
              />
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-slate-700"
              >
                Category <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white"
                  >
                    {formData.category || "Select category"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem
                    onClick={() => handleInputChange("category", "Individual")}
                  >
                    Individual
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("category", "Office")}
                  >
                    Office
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="panNumber"
                className="text-sm font-medium text-slate-700"
              >
                PAN Number
              </Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                placeholder="Enter PAN number"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="panUpload"
                className="text-sm font-medium text-slate-700"
              >
                PAN Upload
              </Label>
              <Input
                id="panUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("pan_upload", e.target.files[0])}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
              />
              {files.pan_upload && (
                <p className="text-xs text-slate-500">Selected: {files.pan_upload.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="aadhaarNumber"
                className="text-sm font-medium text-slate-700"
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
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="aadharUpload"
                className="text-sm font-medium text-slate-700"
              >
                Aadhaar Upload
              </Label>
              <Input
                id="aadharUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("aadhar_upload", e.target.files[0])}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
              />
              {files.aadhar_upload && (
                <p className="text-xs text-slate-500">Selected: {files.aadhar_upload.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-slate-700"
              >
                Location
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white"
                  >
                    {formData.location || "Select location"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem
                    onClick={() => handleInputChange("location", "Mumbai")}
                  >
                    Mumbai
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("location", "Delhi")}
                  >
                    Delhi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("location", "Bangalore")}
                  >
                    Bangalore
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("location", "Chennai")}
                  >
                    Chennai
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="linkedExecutive"
                className="text-sm font-medium text-slate-700"
              >
                Link an Executive
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white"
                  >
                    {formData.linkedExecutive || "Select executive"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem
                    onClick={() =>
                      handleInputChange("linkedExecutive", "Executive 1")
                    }
                  >
                    Executive 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleInputChange("linkedExecutive", "Executive 2")
                    }
                  >
                    Executive 2
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleInputChange("linkedExecutive", "Executive 3")
                    }
                  >
                    Executive 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
 
            <div className="space-y-2">
              <Label
                htmlFor="officeIndividual"
                className="text-sm font-medium text-slate-700"
              >
                Office / Individual
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white"
                  >
                    {formData.officeIndividual || "Select type"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem
                    onClick={() =>
                      handleInputChange("officeIndividual", "Office")
                    }
                  >
                    Office
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleInputChange("officeIndividual", "Individual")
                    }
                  >
                    Individual
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
 
            <div className="col-span-2 space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-slate-700"
              >
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </div>
 
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {selectedMediator ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
 
export default Mediators;