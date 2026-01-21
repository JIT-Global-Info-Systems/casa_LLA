// import React, { useState, useEffect } from "react";
// import { useMediators } from "../context/MediatorsContext.jsx";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Plus,
//   Search,
//   RefreshCw,
//   Filter,
//   ChevronDown,
//   Eye,
//   Edit,
//   Trash2,
//   MoreVertical,
// } from "lucide-react";

// function Mediators() {
//   const { mediators, loading, error, fetchMediators, createMediator, updateMediator, deleteMediator } = useMediators();
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedMediator, setSelectedMediator] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExecutive, setSelectedExecutive] = useState("");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   // Fetch mediators on component mount
//   useEffect(() => {
//     fetchMediators();
//   }, []); // Empty dependency array to run only once

//   // Form state for Add Mediator
//   const [formData, setFormData] = useState({
//     mediatorName: "",
//     email: "",
//     phonePrimary: "",
//     phoneSecondary: "",
//     category: "",
//     panNumber: "",
//     aadhaarNumber: "",
//     location: "",
//     linkedExecutive: "",
//     officeIndividual: "",
//     address: "",
//   });

//   // File state for uploads
//   const [files, setFiles] = useState({
//     pan_upload: null,
//     aadhar_upload: null,
//   });

//   // Filter mediators based on search and filter criteria
//   const filteredMediators = mediators.filter((mediator) => {
//     // Search filter - using actual field names from API response
//     const matchesSearch =
//       searchTerm === "" ||
//       mediator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       mediator.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       mediator.phone_primary?.includes(searchTerm) ||
//       mediator._id?.toLowerCase().includes(searchTerm.toLowerCase());

//     // Executive filter (using linked_executive from API response)
//     const matchesExecutive =
//       selectedExecutive === "" || mediator.linked_executive === selectedExecutive;

//     // Date range filter (using created_at from API response)
//     const matchesDateRange = (() => {
//       if (!dateFrom && !dateTo) return true;
//       const mediatorDate = new Date(mediator.created_at);
//       const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
//       const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31");
//       return mediatorDate >= fromDate && mediatorDate <= toDate;
//     })();

//     return matchesSearch && matchesExecutive && matchesDateRange;
//   });

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleFileChange = (field, file) => {
//     setFiles((prev) => ({
//       ...prev,
//       [field]: file,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       // Map form data to API field names
//       const apiData = {
//         name: formData.mediatorName,
//         email: formData.email,
//         phone_primary: formData.phonePrimary,
//         phone_secondary: formData.phoneSecondary,
//         category: formData.category,
//         pan_number: formData.panNumber,
//         aadhar_number: formData.aadhaarNumber,
//         location: formData.location,
//         linked_executive: formData.linkedExecutive,
//         mediator_type: formData.officeIndividual,
//         address: formData.address,
//       };

//       if (selectedMediator) {
//         // Update existing mediator
//         await updateMediator(selectedMediator._id, apiData);
//       } else {
//         // Create new mediator
//         await createMediator(apiData, files);
//       }

//       setIsAddModalOpen(false);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving mediator:", error);
//     }
//   };

//   const handleRefresh = () => {
//     // Reset all filters and fetch fresh data
//     setSearchTerm("");
//     setSelectedExecutive("");
//     setDateFrom("");
//     setDateTo("");
//     fetchMediators();
//   };

//   const resetForm = () => {
//     setFormData({
//       mediatorName: "",
//       email: "",
//       phonePrimary: "",
//       phoneSecondary: "",
//       category: "",
//       panNumber: "",
//       aadhaarNumber: "",
//       location: "",
//       linkedExecutive: "",
//       officeIndividual: "",
//       address: "",
//     });
//     setFiles({
//       pan_upload: null,
//       aadhar_upload: null,
//     });
//     setSelectedMediator(null);
//   };

//   const handleEdit = (mediator) => {
//     setSelectedMediator(mediator);
//     // Populate form with mediator data
//     setFormData({
//       mediatorName: mediator.name || "",
//       email: mediator.email || "",
//       phonePrimary: mediator.phone_primary || "",
//       phoneSecondary: mediator.phone_secondary || "",
//       category: mediator.category || "",
//       panNumber: mediator.pan_number || "",
//       aadhaarNumber: mediator.aadhar_number || "",
//       location: mediator.location || "",
//       linkedExecutive: mediator.linked_executive || "",
//       officeIndividual: mediator.mediator_type || "",
//       address: mediator.address || "",
//     });
//     setIsAddModalOpen(true);
//   };

//   const handleView = (mediator) => {
//     // You can implement view functionality here
//     console.log("View mediator:", mediator);
//   };

//   const handleDelete = async (mediator) => {
//     if (window.confirm(`Are you sure you want to delete ${mediator.name}?`)) {
//       try {
//         await deleteMediator(mediator._id);
//         // The UI will update automatically through the context
//       } catch (error) {
//         console.error("Error deleting mediator:", error);
//       }
//     }
//   };

//   return (
//     <div className="flex-1 space-y-6 p-6">
//       {/* Loading and Error States */}
//       {loading && (
//         <div className="text-center py-8">
//           <p className="text-slate-600">Loading mediators...</p>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="text-red-600">Error: {error}</p>
//         </div>
//       )}

//       {/* Main Content */}
//       {!loading && !error && (
//         <>
//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Mediator</h1>
//               <p className="text-sm text-slate-500 mt-1">
//                 MEDIATOR: {filteredMediators.length}{" "}
//                 {filteredMediators.length !== mediators.length &&
//                   `(${mediators.length} total)`}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" onClick={handleRefresh}>
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Refresh
//               </Button>
//               <Button onClick={() => setIsAddModalOpen(true)} size="sm">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add
//               </Button>
//             </div>
//           </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex-1 min-w-[200px]">
//               <div className="relative">
//                 {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
//                 <Input
//                   placeholder="Search mediators..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Label className="text-sm text-slate-600 whitespace-nowrap">
//                 Executive:
//               </Label>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-[140px] justify-between bg-white"
//                   >
//                     <span className="truncate">
//                       {selectedExecutive || "Select"}
//                     </span>
//                     <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="bg-white">
//                   <DropdownMenuItem onClick={() => setSelectedExecutive("")}>
//                     All
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setSelectedExecutive("Admin")}
//                   >
//                     Admin
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setSelectedExecutive("Manager")}
//                   >
//                     Manager
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setSelectedExecutive("Executive")}
//                   >
//                     Executive
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="flex items-center gap-2">
//               <Label className="text-sm text-slate-600 whitespace-nowrap">
//                 From:
//               </Label>
//               <Input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="w-[140px]"
//                 size="sm"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Label className="text-sm text-slate-600 whitespace-nowrap">
//                 To:
//               </Label>
//               <Input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="w-[140px]"
//                 size="sm"
//               />
//             </div>

//             <Button variant="outline" size="sm">
//               <Filter className="h-4 w-4 mr-2" />
//               Filter
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table */}
//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-slate-200 bg-slate-50">
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Registered Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Created By
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200">
//                 {filteredMediators.map((mediator) => (
//                   <tr
//                     key={mediator._id}
//                     className="hover:bg-slate-50 transition-colors"
//                   >
//                     <td className="px-4 py-3 text-sm text-slate-900">
//                       {mediator._id}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-900">
//                       {mediator.name}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600">
//                       {mediator.category}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600">
//                       {mediator.phone_primary}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600">
//                       {mediator.email}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600">
//                       {new Date(mediator.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600">
//                       {mediator.linked_executive || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-slate-600 text-right relative">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                           >
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent 
//                           align="end" 
//                           className="z-50 bg-white border border-slate-200 shadow-lg"
//                         >
//                           <DropdownMenuItem onClick={() => handleView(mediator)}>
//                             <Eye className="h-4 w-4 mr-2" />
//                             View
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => handleEdit(mediator)}>
//                             <Edit className="h-4 w-4 mr-2" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(mediator)}>
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
//             <div className="text-sm text-slate-600">
//               Showing {filteredMediators.length} result
//               {filteredMediators.length !== 1 ? "s" : ""}
//               {filteredMediators.length !== mediators.length &&
//                 ` (of ${mediators.length} total)`}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" disabled>
//                 Previous
//               </Button>
//               <Button variant="outline" size="sm">
//                 Next
//               </Button>
//               <Button variant="outline" size="sm">
//                 Last
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Mediator Modal */}
//       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-slate-900">
//               {selectedMediator ? "Edit Mediator" : "Add Mediator"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="grid grid-cols-2 gap-4 py-4">
//             <div className="space-y-2">
//               <Label
//                 htmlFor="mediatorName"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Mediator Name <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="mediatorName"
//                 value={formData.mediatorName}
//                 onChange={(e) =>
//                   handleInputChange("mediatorName", e.target.value)
//                 }
//                 placeholder="Enter mediator name"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="email"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Email <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="Enter email address"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="phonePrimary"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Phone Primary <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="phonePrimary"
//                 value={formData.phonePrimary}
//                 onChange={(e) =>
//                   handleInputChange("phonePrimary", e.target.value)
//                 }
//                 placeholder="Enter primary phone"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="phoneSecondary"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Phone Secondary
//               </Label>
//               <Input
//                 id="phoneSecondary"
//                 value={formData.phoneSecondary}
//                 onChange={(e) =>
//                   handleInputChange("phoneSecondary", e.target.value)
//                 }
//                 placeholder="Enter secondary phone"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="category"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Category <span className="text-red-500">*</span>
//               </Label>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-between bg-white"
//                   >
//                     {formData.category || "Select category"}
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-full bg-white">
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("category", "Individual")}
//                   >
//                     Individual
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("category", "Office")}
//                   >
//                     Office
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="panNumber"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 PAN Number
//               </Label>
//               <Input
//                 id="panNumber"
//                 value={formData.panNumber}
//                 onChange={(e) => handleInputChange("panNumber", e.target.value)}
//                 placeholder="Enter PAN number"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="aadhaarNumber"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Aadhaar Number
//               </Label>
//               <Input
//                 id="aadhaarNumber"
//                 value={formData.aadhaarNumber}
//                 onChange={(e) =>
//                   handleInputChange("aadhaarNumber", e.target.value)
//                 }
//                 placeholder="Enter Aadhaar number"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="location"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Location
//               </Label>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-between bg-white"
//                   >
//                     {formData.location || "Select location"}
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-full bg-white">
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("location", "Mumbai")}
//                   >
//                     Mumbai
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("location", "Delhi")}
//                   >
//                     Delhi
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("location", "Bangalore")}
//                   >
//                     Bangalore
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => handleInputChange("location", "Chennai")}
//                   >
//                     Chennai
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="linkedExecutive"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Link an Executive
//               </Label>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-between bg-white"
//                   >
//                     {formData.linkedExecutive || "Select executive"}
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-full bg-white">
//                   <DropdownMenuItem
//                     onClick={() =>
//                       handleInputChange("linkedExecutive", "Executive 1")
//                     }
//                   >
//                     Executive 1
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() =>
//                       handleInputChange("linkedExecutive", "Executive 2")
//                     }
//                   >
//                     Executive 2
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() =>
//                       handleInputChange("linkedExecutive", "Executive 3")
//                     }
//                   >
//                     Executive 3
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="officeIndividual"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Office / Individual
//               </Label>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-between bg-white"
//                   >
//                     {formData.officeIndividual || "Select type"}
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-full bg-white">
//                   <DropdownMenuItem
//                     onClick={() =>
//                       handleInputChange("officeIndividual", "Office")
//                     }
//                   >
//                     Office
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() =>
//                       handleInputChange("officeIndividual", "Individual")
//                     }
//                   >
//                     Individual
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="panUpload"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 PAN Upload
//               </Label>
//               <Input
//                 id="panUpload"
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange("pan_upload", e.target.files[0])}
//                 className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
//               />
//               {files.pan_upload && (
//                 <p className="text-xs text-slate-500">Selected: {files.pan_upload.name}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="aadharUpload"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Aadhaar Upload
//               </Label>
//               <Input
//                 id="aadharUpload"
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange("aadhar_upload", e.target.files[0])}
//                 className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
//               />
//               {files.aadhar_upload && (
//                 <p className="text-xs text-slate-500">Selected: {files.aadhar_upload.name}</p>
//               )}
//             </div>

//             <div className="col-span-2 space-y-2">
//               <Label
//                 htmlFor="address"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 Address
//               </Label>
//               <Textarea
//                 id="address"
//                 value={formData.address}
//                 onChange={(e) => handleInputChange("address", e.target.value)}
//                 placeholder="Enter complete address"
//                 rows={3}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setIsAddModalOpen(false);
//               resetForm();
//             }}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSave}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white"
//             >
//               {selectedMediator ? "Update" : "Save"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//         </>
//       )}
//     </div>
//   );
// }

// export default Mediators;





import React, { useState, useEffect, useCallback } from "react";
import { useMediators } from "../context/MediatorsContext.jsx";
import { locationsAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Modal from "@/components/ui/modal";
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
} from "lucide-react";

function Mediators() {
  const { mediators, loading, error, fetchMediators, createMediator, updateMediator, deleteMediator } = useMediators();
  const [open, setOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [viewMediator, setViewMediator] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [locations, setLocations] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchLocations = useCallback(async () => {
    try {
      const data = await locationsAPI.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  }, []);

  useEffect(() => {
    fetchMediators();
    fetchLocations();
  }, [fetchMediators, fetchLocations]);

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
    fetchLocations();
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

  const handleDelete = async (mediator) => {
    if (window.confirm(`Are you sure you want to delete ${mediator.name}?`)) {
      try {
        await deleteMediator(mediator._id);
      } catch (error) {
        console.error("Error deleting mediator:", error);
      }
    }
  };

  return (
    <div>
      {/* FORM VIEW */}
      {open && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="mb-4"
            >
              ← Back to Mediators
            </Button>

            <h2 className="text-xl font-semibold mb-6">
              {selectedMediator ? "Edit Mediator" : "Add Mediator"}
            </h2>

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
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-white"
                    >
                      {formData.location || "Select location"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-white max-h-[300px] overflow-y-auto">
                    {locations.length > 0 ? (
                      locations.map((loc) => (
                        <DropdownMenuItem
                          key={loc._id}
                          onClick={() => handleInputChange("location", loc.location)}
                        >
                          {loc.location}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No locations found</div>
                    )}
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

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedMediator ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE */}
      {isViewMode && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Button
              variant="outline"
              onClick={() => setIsViewMode(false)}
              className="mb-4"
            >
              ← Back to Mediators
            </Button>

            <h2 className="text-xl font-semibold mb-6">Mediator Details</h2>

            {viewMediator && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Mediator Name
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.name || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.email || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Phone Primary
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.phone_primary || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Phone Secondary
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.phone_secondary || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Category
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.category || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    PAN Number
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.pan_number || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Aadhaar Number
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.aadhar_number || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Location
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.location || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Linked Executive
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.linked_executive || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Office / Individual
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.mediator_type || 'N/A'}
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Address
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded min-h-[60px]">
                    {viewMediator.address || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Created Date
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator.created_at ? new Date(viewMediator.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Mediator ID
                  </Label>
                  <div className="text-sm text-slate-900 bg-gray-50 p-2 rounded">
                    {viewMediator._id || 'N/A'}
                  </div>
                </div>
              </div>
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

                <Button variant="outline" className="border-gray-300" disabled>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
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
                                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDelete(mediator)}>
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
    </div>
  );
}

export default Mediators;
