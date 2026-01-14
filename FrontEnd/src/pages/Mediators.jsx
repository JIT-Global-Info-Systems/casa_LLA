import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock data
const mockMediators = [
  {
    id: "MED001",
    name: "Rajesh Kumar",
    category: "Individual",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    registeredDate: "2024-01-15",
    createdBy: "Admin",
  },
  {
    id: "MED002",
    name: "Priya Sharma",
    category: "Office",
    phone: "+91 87654 32109",
    email: "priya.sharma@email.com",
    registeredDate: "2024-01-14",
    createdBy: "Manager",
  },
  {
    id: "MED003",
    name: "Amit Patel",
    category: "Individual",
    phone: "+91 76543 21098",
    email: "amit.patel@email.com",
    registeredDate: "2024-01-13",
    createdBy: "Admin",
  },
  {
    id: "MED004",
    name: "Sneha Reddy",
    category: "Office",
    phone: "+91 65432 10987",
    email: "sneha.reddy@email.com",
    registeredDate: "2024-01-12",
    createdBy: "Executive",
  },
  {
    id: "MED005",
    name: "Vikram Singh",
    category: "Individual",
    phone: "+91 54321 09876",
    email: "vikram.singh@email.com",
    registeredDate: "2024-01-11",
    createdBy: "Admin",
  },
];

function Mediators() {
  const [mediators] = useState(mockMediators);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Form state for Add Mediator
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

  // Filter mediators based on search and filter criteria
  const filteredMediators = mediators.filter((mediator) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      mediator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.phone.includes(searchTerm) ||
      mediator.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Executive filter (simulating createdBy as executive assignment)
    const matchesExecutive =
      selectedExecutive === "" || mediator.createdBy === selectedExecutive;

    // Date range filter
    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      const mediatorDate = new Date(mediator.registeredDate);
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

  const handleSave = () => {
    // Placeholder for save logic
    setIsAddModalOpen(false);
    // Reset form
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
  };

  const handleRefresh = () => {
    // Reset all filters
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
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
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
              <Label className="text-sm text-slate-600">Executive:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-between"
                  >
                    {selectedExecutive || "Select"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Executive 1")}
                  >
                    Executive 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Executive 2")}
                  >
                    Executive 2
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedExecutive("Executive 3")}
                  >
                    Executive 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">From:</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[140px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">To:</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[140px]"
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
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMediators.map((mediator) => (
                  <tr
                    key={mediator.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {mediator.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {mediator.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {mediator.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {mediator.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {mediator.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {mediator.registeredDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {mediator.createdBy}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right">
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredMediators.length} results{" "}
              {filteredMediators.length !== mediators.length &&
                `(of ${mediators.length} total)`}
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

      {/* Add Mediator Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Add Mediator
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="mediatorName"
                className="text-sm font-medium text-slate-700"
              >
                Mediator Name
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
                Email
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
                Phone Primary
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
                Category
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.category || "Select category"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
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
                htmlFor="location"
                className="text-sm font-medium text-slate-700"
              >
                Location
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.location || "Select location"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
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
                  <Button variant="outline" className="w-full justify-between">
                    {formData.linkedExecutive || "Select executive"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
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
                  <Button variant="outline" className="w-full justify-between">
                    {formData.officeIndividual || "Select type"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
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
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Mediators;
