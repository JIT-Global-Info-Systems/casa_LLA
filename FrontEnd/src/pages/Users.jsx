import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Plus, Edit, Trash2, Eye, MoreVertical, RefreshCw, ChevronLeft } from "lucide-react";
import { useUsers } from "../context/UsersContext";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useEntityAction } from "@/hooks/useEntityAction";
import toast from "react-hot-toast";
import { formatDisplayDate, safeDate } from "@/utils/dateUtils";
import PhoneInput from "@/components/ui/PhoneInput";

function Users() {
  // Get users data and functions from context
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mode, setMode] = useState("list"); // 'list' | 'add' | 'edit' | 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // password: "",
    role: "",
    phone_number: "",
    status: "active"
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(new Set());

  // Entity action hook for status-aware delete
  const { handleDelete, canPerformAction, confirmModal } = useEntityAction('user');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm, roleFilter, statusFilter, fromDate, toDate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, fromDate, toDate]);

  // Validate form whenever formData changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    if (!formData.phone_number || !formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    }
    
    setFormErrors(errors);
    const phoneValid = !formErrors.phone_number;
    const formValid = Object.keys(errors).length === 0 && phoneValid;
    setIsFormValid(formValid);
    
    return formValid;
  };

  // Handle phone validation change
  const handlePhoneValidation = (isValid, error) => {
    setFormErrors(prev => ({
      ...prev,
      phone_number: isValid ? '' : error
    }));
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const filterUsers = () => {
    if (!users) return;

    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone_number && user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (fromDate) {
      filtered = filtered.filter((user) => {
        const userDate = safeDate(user.created_at);
        const filterDate = safeDate(fromDate);
        return userDate && filterDate && userDate >= filterDate;
      });
    }

    if (toDate) {
      filtered = filtered.filter((user) => {
        const userDate = safeDate(user.created_at);
        const filterDate = safeDate(toDate);
        return userDate && filterDate && userDate <= filterDate;
      });
    }

    // Sort users by creation date (newest first)
    filtered.sort((a, b) => {
      const dateA = safeDate(a.created_at);
      const dateB = safeDate(b.created_at);
      
      // Handle null dates - put them at the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(formData);
      toast.success('User added successfully');
      await fetchUsers(); // Refresh list to show new user at top
      setMode("list");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone_number: "",
        status: "active"
      });
      setFormErrors({});
    } catch (err) {
      toast.error(err.message || 'Could not add user. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUser(selectedUser.user_id, formData);
      toast.success('User updated successfully');
      await fetchUsers(); // Refresh list to maintain sorting
      setMode("list");
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "telecaller",
        phone_number: "",
        status: "active",
      });
      setFormErrors({});
    } catch (err) {
      toast.error(err.message || 'Could not update user. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user) => {
    // Check if delete is allowed
    const deleteState = canPerformAction(user, 'delete');
    
    if (!deleteState.enabled) {
      // User is already inactive/deleted - don't show error
      // UI should have disabled the button with tooltip
      return;
    }

    // Perform delete with status check
    handleDelete(user, async () => {
      await deleteUser(user.user_id);
      fetchUsers(); // Refresh list
    }, user.name);
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Usually keep password blank on edit unless changing
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
    });
    setMode("edit");
  };

  const openViewDialog = (user) => {
    setSelectedUser(user);
    setMode("view");
  };

  const getCategoryColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-purple-100 text-purple-700",
      executive: "bg-orange-100 text-orange-700",
      telecaller: "bg-blue-100 text-blue-700",
    };
    return colors[role] || "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === "list" && (
        <>
          {/* Header */}
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-indigo-700">Users</h1>
                <p className="text-sm text-gray-500 mt-1">User list · Last updated today</p>
              </div>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-700"
                      onClick={fetchUsers}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Refresh the users list to get the latest data
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedUser(null);
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          role: "telecaller",
                          phone_number: "",
                          status: "active",
                        });
                        setMode("add");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Create a new user account
                  </TooltipContent>
                </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Search by name, email, or phone number
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">Role:</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="min-w-[140px] justify-between border-gray-300 capitalize"
                          >
                            {roleFilter === "all" ? "Select" : roleFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border shadow-lg">
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("all")}
                            className="cursor-pointer"
                          >
                            All Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("admin")}
                            className="cursor-pointer"
                          >
                            Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("manager")}
                            className="cursor-pointer"
                          >
                            Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("executive")}
                            className="cursor-pointer"
                          >
                            Executive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRoleFilter("telecaller")}
                            className="cursor-pointer"
                          >
                            Telecaller
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      Filter users by their role
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">From:</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-[150px] border-gray-300"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Filter users created from this date
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">To:</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-[150px] border-gray-300"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Filter users created up to this date
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-gray-300 capitalize">
                          {statusFilter === "all" ? "Status" : statusFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border shadow-lg">
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("all")}
                          className="cursor-pointer"
                        >
                          All Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("active")}
                          className="cursor-pointer"
                        >
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusFilter("inactive")}
                          className="cursor-pointer"
                        >
                          Inactive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    Filter users by their status
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.user_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.user_id}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              user.role
                            )} capitalize`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center justify-center gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={user.status === "active"}
                                    disabled={updatingStatus.has(user.user_id)}
                                    onCheckedChange={async (checked) => {
                                      if (updatingStatus.has(user.user_id)) return;
                                      
                                      setUpdatingStatus(prev => new Set(prev).add(user.user_id));
                                      try {
                                        const newStatus = checked ? "active" : "inactive";
                                        await updateUser(user.user_id, { status: newStatus });
                                        await fetchUsers(); // Refresh list to maintain sorting
                                        toast.success(`User ${checked ? 'activated' : 'deactivated'} successfully`);
                                      } catch (error) {
                                        toast.error('Could not update status. Please try again.');
                                        console.error("Error updating user status:", error);
                                      } finally {
                                        setUpdatingStatus(prev => {
                                          const newSet = new Set(prev);
                                          newSet.delete(user.user_id);
                                          return newSet;
                                        });
                                      }
                                    }}
                                    id={`status-toggle-${user.user_id}`}
                                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300 h-4 w-8.5 [&>span]:h-3 [&>span]:w-3"
                                  />
                                  <Label
                                    htmlFor={`status-toggle-${user.user_id}`}
                                    className={`text-sm font-medium cursor-pointer ${user.status === "active"
                                        ? "text-green-700"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    {user.status === "active" ? "Active" : "Inactive"}
                                  </Label>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.status === "active" 
                                  ? "Click to deactivate this user" 
                                  : "Click to activate this user"
                                }
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDisplayDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                User actions menu
                              </TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white border shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() => openViewDialog(user)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(user)}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                disabled={!canPerformAction(user, 'delete').enabled}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                                {!canPerformAction(user, 'delete').enabled && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({canPerformAction(user, 'delete').reason})
                                  </span>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
                </p>
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
        </>
      )}

      {mode === "add" && (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setMode("list")} 
                  className="bg-white shadow-sm hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Add New User</h1>
                  <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new user</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">User Information</CardTitle>
                <CardDescription>Personal and account details.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter user name"
                    className="bg-gray-50/50"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="bg-gray-50/50"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <PhoneInput
                    label="Phone"
                    value={formData.phone_number}
                    onChange={(value) => handleInputChange('phone_number', value)}
                    onValidationChange={handlePhoneValidation}
                    placeholder="Enter phone number"
                    className="bg-gray-50/50"
                    required={true}
                    showValidation={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between capitalize bg-gray-50/50 border-gray-300">
                        {formData.role ? formData.role.replace(/_/g, ' ') : "Select role"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "tele_caller" })
                        }
                        className="cursor-pointer"
                      >
                        Telecaller
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "land_executive" })
                        }
                        className="cursor-pointer"
                      >
                        Land Executive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "feasibility_team" })
                        }
                        className="cursor-pointer"
                      >
                        Feasibility Team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "l1_md" })
                        }
                        className="cursor-pointer"
                      >
                        L1 Management
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "cmo_cro" })
                        }
                        className="cursor-pointer"
                      >
                        CMO/CRO
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "legal" })
                        }
                        className="cursor-pointer"
                      >
                        Legal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "liaison" })
                        }
                        className="cursor-pointer"
                      >
                        Liaison
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "finance" })
                        }
                        className="cursor-pointer"
                      >
                        Finance
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "admin" })
                        }
                        className="cursor-pointer"
                      >
                        Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
              <div className="border-t px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setMode("list")} className="border-gray-300">
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cancel and return to users list without saving
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAddUser}
                      disabled={!isFormValid || isSubmitting}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Adding User...' : 'Add User'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isFormValid 
                      ? "Please fill in all required fields correctly" 
                      : "Create the new user account"
                    }
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setMode("list");
                    setSelectedUser(null);
                  }} 
                  className="bg-white shadow-sm hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Edit User</h1>
                  <p className="text-gray-500 text-sm mt-1">Update the user details below</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">User Information</CardTitle>
                <CardDescription>Personal and account details.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter user name"
                    className="bg-gray-50/50"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="bg-gray-50/50"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <PhoneInput
                    label="Phone"
                    value={formData.phone_number}
                    onChange={(value) => handleInputChange('phone_number', value)}
                    onValidationChange={handlePhoneValidation}
                    placeholder="Enter phone number"
                    className="bg-gray-50/50"
                    required={true}
                    showValidation={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between capitalize bg-gray-50/50 border-gray-300">
                        {formData.role ? formData.role.replace(/_/g, ' ') : "Select role"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "tele_caller" })
                        }
                        className="cursor-pointer"
                      >
                        Telecaller
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "land_executive" })
                        }
                        className="cursor-pointer"
                      >
                        Land Executive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "feasibility_team" })
                        }
                        className="cursor-pointer"
                      >
                        Feasibility Team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "l1_md" })
                        }
                        className="cursor-pointer"
                      >
                        L1 Management
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "cmo_cro" })
                        }
                        className="cursor-pointer"
                      >
                        CMO/CRO
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "legal" })
                        }
                        className="cursor-pointer"
                      >
                        Legal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "liaison" })
                        }
                        className="cursor-pointer"
                      >
                        Liaison
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "finance" })
                        }
                        className="cursor-pointer"
                      >
                        Finance
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setFormData({ ...formData, role: "admin" })
                        }
                        className="cursor-pointer"
                      >
                        Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
              <div className="border-t px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMode("list");
                        setSelectedUser(null);
                      }}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cancel editing and return to users list
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleEditUser}
                      disabled={!isFormValid || isSubmitting}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Updating User...' : 'Update User'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isFormValid 
                      ? "Please fill in all required fields correctly" 
                      : "Save changes to this user account"
                    }
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>
          </div>
        </div>
      )}

      {mode === "view" && selectedUser && (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setMode("list");
                    setSelectedUser(null);
                  }} 
                  className="bg-white shadow-sm hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">View User</h1>
                  <p className="text-gray-500 text-sm mt-1">View the user details below</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">User Information</CardTitle>
                <CardDescription>Personal and account details.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Name</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.name || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.email || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Phone Number</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.phone_number || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Role</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        selectedUser.role
                      )} capitalize`}
                    >
                      {selectedUser.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center capitalize">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedUser.status || "-"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Created Date</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {formatDisplayDate(selectedUser.created_at)}
                  </div>
                </div>
              </CardContent>
              <div className="border-t px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMode("list");
                    setSelectedUser(null);
                  }}
                  className="border-gray-300"
                >
                  Back to List
                </Button>
                <Button
                  onClick={() => openEditDialog(selectedUser)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
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

export default Users;
