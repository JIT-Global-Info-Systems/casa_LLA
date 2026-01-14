import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Button,
} from "@/components/ui/button";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
import {
  Textarea,
} from "@/components/ui/textarea";
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

// Initial mock data
const initialMediators = [
  {
    id: "MED001",
    name: "Rajesh Kumar",
    category: "Individual",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    registeredDate: "2024-01-15",
    createdBy: "Admin",
    phonePrimary: "+91 98765 43210",
    phoneSecondary: "+91 98765 43211",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234 5678 9012",
    location: "Mumbai",
    linkedExecutive: "Executive 1",
    officeIndividual: "Individual",
    address: "123 Main Street, Mumbai, Maharashtra",
  },
  {
    id: "MED002",
    name: "Priya Sharma",
    category: "Office",
    phone: "+91 87654 32109",
    email: "priya.sharma@email.com",
    registeredDate: "2024-01-14",
    createdBy: "Manager",
    phonePrimary: "+91 87654 32109",
    phoneSecondary: "+91 87654 32110",
    panNumber: "FGHIJ5678K",
    aadhaarNumber: "2345 6789 0123",
    location: "Delhi",
    linkedExecutive: "Executive 2",
    officeIndividual: "Office",
    address: "456 Park Avenue, Delhi",
  },
  {
    id: "MED003",
    name: "Amit Patel",
    category: "Individual",
    phone: "+91 76543 21098",
    email: "amit.patel@email.com",
    registeredDate: "2024-01-13",
    createdBy: "Admin",
    phonePrimary: "+91 76543 21098",
    phoneSecondary: "+91 76543 21099",
    panNumber: "KLMNO9012P",
    aadhaarNumber: "3456 7890 1234",
    location: "Bangalore",
    linkedExecutive: "Executive 1",
    officeIndividual: "Individual",
    address: "789 Tech Park, Bangalore, Karnataka",
  },
  {
    id: "MED004",
    name: "Sneha Reddy",
    category: "Office",
    phone: "+91 65432 10987",
    email: "sneha.reddy@email.com",
    registeredDate: "2024-01-12",
    createdBy: "Executive",
    phonePrimary: "+91 65432 10987",
    phoneSecondary: "+91 65432 10988",
    panNumber: "PQRST3456U",
    aadhaarNumber: "4567 8901 2345",
    location: "Chennai",
    linkedExecutive: "Executive 3",
    officeIndividual: "Office",
    address: "321 Business District, Chennai, Tamil Nadu",
  },
  {
    id: "MED005",
    name: "Vikram Singh",
    category: "Individual",
    phone: "+91 54321 09876",
    email: "vikram.singh@email.com",
    registeredDate: "2024-01-11",
    createdBy: "Admin",
    phonePrimary: "+91 54321 09876",
    phoneSecondary: "+91 54321 09877",
    panNumber: "UVWXY7890Z",
    aadhaarNumber: "5678 9012 3456",
    location: "Mumbai",
    linkedExecutive: "Executive 2",
    officeIndividual: "Individual",
    address: "654 Residential Area, Mumbai, Maharashtra",
  },
];

function Mediators() {
  const [mediators, setMediators] = useState(initialMediators);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [mediatorToDelete, setMediatorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  // Generate new mediator ID
  const generateId = () => {
    const ids = mediators.map(m => parseInt(m.id.replace('MED', '')));
    const maxId = Math.max(...ids, 0);
    return `MED${String(maxId + 1).padStart(3, '0')}`;
  };

  // Filter mediators
  const filteredMediators = mediators.filter((mediator) => {
    const matchesSearch = searchTerm === "" ||
      mediator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.phone.includes(searchTerm) ||
      mediator.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExecutive = selectedExecutive === "" || mediator.createdBy === selectedExecutive;

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const mediatorDate = new Date(mediator.registeredDate);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      return mediatorDate >= fromDate && mediatorDate <= toDate;
    })();

    return matchesSearch && matchesExecutive && matchesDateRange;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      mediatorName: mediator.name,
      email: mediator.email,
      phonePrimary: mediator.phonePrimary,
      phoneSecondary: mediator.phoneSecondary,
      category: mediator.category,
      panNumber: mediator.panNumber,
      aadhaarNumber: mediator.aadhaarNumber,
      location: mediator.location,
      linkedExecutive: mediator.linkedExecutive,
      officeIndividual: mediator.officeIndividual,
      address: mediator.address,
    });
    setIsAddEditModalOpen(true);
  };

  const handleDelete = (mediator) => {
    setMediatorToDelete(mediator);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (mediatorToDelete) {
      setMediators(prev => prev.filter(m => m.id !== mediatorToDelete.id));
      setIsDeleteConfirmOpen(false);
      setMediatorToDelete(null);
    }
  };

  const handleSave = () => {
    if (selectedMediator) {
      // Edit existing mediator
      setMediators(prev => prev.map(m =>
        m.id === selectedMediator.id
          ? {
              ...m,
              name: formData.mediatorName,
              email: formData.email,
              phone: formData.phonePrimary,
              phonePrimary: formData.phonePrimary,
              phoneSecondary: formData.phoneSecondary,
              category: formData.category,
              panNumber: formData.panNumber,
              aadhaarNumber: formData.aadhaarNumber,
              location: formData.location,
              linkedExecutive: formData.linkedExecutive,
              officeIndividual: formData.officeIndividual,
              address: formData.address,
            }
          : m
      ));
    } else {
      // Add new mediator
      const newMediator = {
        id: generateId(),
        name: formData.mediatorName,
        email: formData.email,
        phone: formData.phonePrimary,
        phonePrimary: formData.phonePrimary,
        phoneSecondary: formData.phoneSecondary,
        category: formData.category,
        panNumber: formData.panNumber,
        aadhaarNumber: formData.aadhaarNumber,
        location: formData.location,
        linkedExecutive: formData.linkedExecutive,
        officeIndividual: formData.officeIndividual,
        address: formData.address,
        registeredDate: new Date().toISOString().split('T')[0],
        createdBy: "Admin",
      };
      setMediators(prev => [...prev, newMediator]);
    }

    setIsAddEditModalOpen(false);
    resetForm();
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mediator</h1>
          <p className="text-sm text-slate-500 mt-1">
            MEDIATOR: {filteredMediators.length} {filteredMediators.length !== mediators.length && `(${mediators.length} total)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAdd} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search mediators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600 whitespace-nowrap">Executive:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[140px] justify-between bg-white">
                    <span className="truncate">{selectedExecutive || "Select"}</span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem onClick={() => setSelectedExecutive("")}>
                    All
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
              <Label className="text-sm text-slate-600 whitespace-nowrap">From:</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[140px]"
                size="sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600 whitespace-nowrap">To:</Label>
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
                  <TableHead className="text-right font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMediators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No mediators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMediators.map((mediator) => (
                    <TableRow key={mediator.id}>
                      <TableCell className="font-medium">{mediator.id}</TableCell>
                      <TableCell>{mediator.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mediator.category === 'Individual'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {mediator.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{mediator.phone}</TableCell>
                      <TableCell className="text-slate-600">{mediator.email}</TableCell>
                      <TableCell className="text-slate-600">{mediator.registeredDate}</TableCell>
                      <TableCell className="text-slate-600">{mediator.createdBy}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem onClick={() => alert(`View ${mediator.name}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(mediator)}>
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
              Showing {filteredMediators.length} result{filteredMediators.length !== 1 ? 's' : ''}
              {filteredMediators.length !== mediators.length && ` (of ${mediators.length} total)`}
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
              <Label htmlFor="mediatorName" className="text-sm font-medium text-slate-700">
                Mediator Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mediatorName"
                value={formData.mediatorName}
                onChange={(e) => handleInputChange("mediatorName", e.target.value)}
                placeholder="Enter mediator name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
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
              <Label htmlFor="phonePrimary" className="text-sm font-medium text-slate-700">
                Phone Primary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phonePrimary"
                value={formData.phonePrimary}
                onChange={(e) => handleInputChange("phonePrimary", e.target.value)}
                placeholder="Enter primary phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneSecondary" className="text-sm font-medium text-slate-700">
                Phone Secondary
              </Label>
              <Input
                id="phoneSecondary"
                value={formData.phoneSecondary}
                onChange={(e) => handleInputChange("phoneSecondary", e.target.value)}
                placeholder="Enter secondary phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white">
                    {formData.category || "Select category"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem onClick={() => handleInputChange("category", "Individual")}>
                    Individual
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("category", "Office")}>
                    Office
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-sm font-medium text-slate-700">
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
              <Label htmlFor="aadhaarNumber" className="text-sm font-medium text-slate-700">
                Aadhaar Number
              </Label>
              <Input
                id="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                placeholder="Enter Aadhaar number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                Location
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white">
                    {formData.location || "Select location"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Mumbai")}>
                    Mumbai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Delhi")}>
                    Delhi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Bangalore")}>
                    Bangalore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("location", "Chennai")}>
                    Chennai
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedExecutive" className="text-sm font-medium text-slate-700">
                Link an Executive
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white">
                    {formData.linkedExecutive || "Select executive"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem onClick={() => handleInputChange("linkedExecutive", "Executive 1")}>
                    Executive 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("linkedExecutive", "Executive 2")}>
                    Executive 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("linkedExecutive", "Executive 3")}>
                    Executive 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeIndividual" className="text-sm font-medium text-slate-700">
                Office / Individual
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white">
                    {formData.officeIndividual || "Select type"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white">
                  <DropdownMenuItem onClick={() => handleInputChange("officeIndividual", "Office")}>
                    Office
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("officeIndividual", "Individual")}>
                    Individual
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">
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
            <Button variant="outline" onClick={() => {
              setIsAddEditModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {selectedMediator ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mediator <strong>{mediatorToDelete?.name}</strong> (ID: {mediatorToDelete?.id}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteConfirmOpen(false);
              setMediatorToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
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
