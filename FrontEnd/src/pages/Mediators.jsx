import React, { useState, useEffect } from "react";
import { useMediators } from "../context/MediatorsContext"; // Using Context for API calls
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
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
} from "lucide-react";

function Mediators() {
  // 1. Context Hooks
  const {
    mediators,
    loading,
    error,
    fetchMediators,
    createMediator,
    updateMediator,
    deleteMediator
  } = useMediators();

  // 2. UI State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedMediator, setSelectedMediator] = useState(null); // For Edit/View
  const [mediatorToDelete, setMediatorToDelete] = useState(null); // For Delete

  // 3. Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 4. Form State
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

  const [files, setFiles] = useState({
    pan_upload: null,
    aadhar_upload: null,
  });

  // 5. Initial Data Fetch
  useEffect(() => {
    fetchMediators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 6. Helpers & Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
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
  };

  // Helper to format address if it comes as an object from API
  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === 'object') {
      return [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
    }
    return addr;
  };

  // --- Actions ---

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
      address: formatAddress(mediator.address),
    });
    // Note: We usually don't pre-fill file inputs for security/browser reasons
    setIsAddEditModalOpen(true);
  };

  const handleView = (mediator) => {
    setSelectedMediator(mediator);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (mediator) => {
    setMediatorToDelete(mediator);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (mediatorToDelete) {
      await deleteMediator(mediatorToDelete._id);
      setIsDeleteConfirmOpen(false);
      setMediatorToDelete(null);
    }
  };

  const handleSave = async () => {
    try {
      // Map form state to API expected keys
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

      setIsAddEditModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save mediator", err);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedExecutive("");
    setDateFrom("");
    setDateTo("");
    fetchMediators();
  };

  // --- Filtering Logic ---
  const filteredMediators = mediators.filter((mediator) => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      mediator.name?.toLowerCase().includes(searchLower) ||
      mediator.email?.toLowerCase().includes(searchLower) ||
      mediator.phone_primary?.includes(searchTerm) ||
      mediator._id?.toLowerCase().includes(searchLower);

    // Executive Filter
    const matchesExecutive =
      !selectedExecutive || mediator.linked_executive === selectedExecutive;

    // Date Filter
    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const mediatorDate = new Date(mediator.created_at);
      const from = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const to = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return mediatorDate >= from && mediatorDate <= to;
    })();

    return matchesSearch && matchesExecutive && matchesDateRange;
  });

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-indigo-700">
            Mediators
          </h2>
          <p className="text-sm text-muted-foreground">
            Mediator list · Last updated today
          </p>
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
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-0">
          {/* Filters Section */}
          <div className="p-4 border-b flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search mediators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">
                Executive:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[140px] justify-between border-gray-300"
                  >
                    {selectedExecutive || "Select"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => setSelectedExecutive("")}>
                    All Executives
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedExecutive("Admin")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedExecutive("Manager")}>
                    Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedExecutive("Executive")}>
                    Executive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">
                From:
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px] border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">
                To:
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px] border-gray-300"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="rounded-md">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider text-gray-500 font-medium">
                    ID
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Phone
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Email
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Registered Date
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Linked Exec
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      Loading mediators...
                    </TableCell>
                  </TableRow>
                ) : filteredMediators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      No mediators found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMediators.map((mediator) => (
                    <TableRow key={mediator._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {mediator._id}
                      </TableCell>
                      <TableCell className="text-gray-900">{mediator.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            mediator.category === "Individual"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {mediator.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {mediator.phone_primary}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {mediator.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {mediator.created_at
                          ? new Date(mediator.created_at).toISOString().split("T")[0]
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {mediator.linked_executive || "N/A"}
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem
                              onClick={() => handleView(mediator)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(mediator)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteClick(mediator)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
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

          {error && (
            <div className="text-center py-12 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredMediators.length} results
              {filteredMediators.length !== mediators.length && ` (of ${mediators.length} total)`}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-gray-400"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-gray-400"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-gray-400"
              >
                Last
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMediator ? "Edit Mediator" : "Add Mediator"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Mediator Name <span className="text-red-500">*</span></Label>
              <Input
                value={formData.mediatorName}
                onChange={(e) => handleInputChange("mediatorName", e.target.value)}
                placeholder="Enter mediator name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Primary <span className="text-red-500">*</span></Label>
              <Input
                value={formData.phonePrimary}
                onChange={(e) => handleInputChange("phonePrimary", e.target.value)}
                placeholder="Enter primary phone"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Secondary</Label>
              <Input
                value={formData.phoneSecondary}
                onChange={(e) => handleInputChange("phoneSecondary", e.target.value)}
                placeholder="Enter secondary phone"
              />
            </div>
            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.category || "Select category"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleInputChange("category", "Individual")}>Individual</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("category", "Office")}>Office</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input
                value={formData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                placeholder="Enter PAN"
              />
            </div>
            <div className="space-y-2">
              <Label>Aadhaar Number</Label>
              <Input
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                placeholder="Enter Aadhaar"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.location || "Select location"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                   {/* Add real locations here */}
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Mumbai")}>Mumbai</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Delhi")}>Delhi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Bangalore")}>Bangalore</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Chennai")}>Chennai</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
             <div className="space-y-2">
              <Label>Link Executive</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.linkedExecutive || "Select executive"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleInputChange("linkedExecutive", "Executive 1")}>Executive 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("linkedExecutive", "Executive 2")}>Executive 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
             <div className="space-y-2">
              <Label>Type</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.officeIndividual || "Select type"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleInputChange("officeIndividual", "Office")}>Office</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("officeIndividual", "Individual")}>Individual</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* File Uploads */}
            <div className="space-y-2">
                <Label htmlFor="panUpload">PAN Upload</Label>
                <Input
                  id="panUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("pan_upload", e.target.files[0])}
                  className="file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
                 {files.pan_upload && <p className="text-xs text-green-600">Selected: {files.pan_upload.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="aadharUpload">Aadhaar Upload</Label>
                <Input
                  id="aadharUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("aadhar_upload", e.target.files[0])}
                   className="file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
                 {files.aadhar_upload && <p className="text-xs text-green-600">Selected: {files.aadhar_upload.name}</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {selectedMediator ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mediator Details</DialogTitle>
          </DialogHeader>
          {selectedMediator && (
             <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">ID</Label>
                    <div className="text-sm font-medium">{selectedMediator._id}</div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <div className="text-sm font-medium">{selectedMediator.name}</div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="text-sm font-medium">{selectedMediator.email}</div>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <div className="text-sm font-medium">{selectedMediator.category}</div>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Phone Primary</Label>
                    <div className="text-sm font-medium">{selectedMediator.phone_primary}</div>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Phone Secondary</Label>
                    <div className="text-sm font-medium">{selectedMediator.phone_secondary || '-'}</div>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">PAN</Label>
                    <div className="text-sm font-medium">{selectedMediator.pan_number || '-'}</div>
                </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Aadhaar</Label>
                    <div className="text-sm font-medium">{selectedMediator.aadhar_number || '-'}</div>
                </div>
                <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <div className="text-sm font-medium bg-slate-50 p-2 rounded">
                        {formatAddress(selectedMediator.address) || '-'}
                    </div>
                </div>
             </div>
          )}
          <DialogFooter>
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mediator <strong>{mediatorToDelete?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Mediators;
