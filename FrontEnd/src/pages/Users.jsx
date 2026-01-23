import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, Trash2, Eye, MoreVertical, RefreshCw, ChevronLeft } from "lucide-react";
import { useUsers } from "../context/UsersContext";
// Import the Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // password: "",
    role: "",
    phone_number: "",
    status: "active"
  });

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
      filtered = filtered.filter(
        (user) => new Date(user.created_at) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (user) => new Date(user.created_at) <= new Date(toDate)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    try {
      await createUser(formData);
      setMode("list");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone_number: "",
        
      });
    } catch (err) {
      // Error handled by context
      console.error(err);
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser.user_id, formData);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error(err);
    }
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
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">Role:</Label>
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
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">From:</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-[150px] border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600 whitespace-nowrap">To:</Label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-[150px] border-gray-300"
                  />
                </div>

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
                    {filteredUsers.map((user) => (
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
                            <Switch
                              checked={user.status === "active"}
                              onCheckedChange={async (checked) => {
                                try {
                                  const newStatus = checked ? "active" : "inactive";
                                  await updateUser(user.user_id, { status: newStatus });
                                } catch (error) {
                                  console.error("Error updating user status:", error);
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(user.created_at).toISOString().split("T")[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete "${user.name}"?`
                                    )
                                  ) {
                                    handleDeleteUser(user.user_id);
                                  }
                                }}
                                className="cursor-pointer text-red-600"
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

              {loading && (
                <div className="text-center py-12 text-gray-500">
                  <p>Loading users...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12 text-red-500">
                  <p>Error: {error}</p>
                </div>
              )}

              {!loading && !error && filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No users found matching your criteria.</p>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredUsers.length} results
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
            </Card>
          </div>
        </>
      )}

      {mode === "add" && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Button
              variant="outline"
              onClick={() => setMode("list")}
              className="mb-4"
            >
              ← Back to Users
            </Button>
            <h2 className="text-xl font-semibold mb-1">Add New User</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter user name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between capitalize">
                      {formData.role || "Select role"}
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
                      LandExecutive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "feasibility_team" })
                      }
                      className="cursor-pointer"
                    >
                      Feasibility
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "l1_md" })
                      }
                      className="cursor-pointer"
                    >
                      Management
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "cmo_cro" })
                      }
                      className="cursor-pointer"
                    >
                      Market Analysis 
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
                        setFormData({ ...formData, role: "management" })
                      }
                      className="cursor-pointer"
                    >
                      Management
                    </DropdownMenuItem>
                  

                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "all_team" })
                      }
                      className="cursor-pointer"
                    >
                      AllTeam
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
             
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setMode("list")}>
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Add User
              </Button>
            </div>
            {/* ... rest of edit inputs ... */}
          </div>
        </div>
      )}

      {mode === "edit" && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Button
              variant="outline"
              onClick={() => {
                setMode("list");
                setSelectedUser(null);
              }}
              className="mb-4"
            >
              ← Back to Users
            </Button>
            <h2 className="text-xl font-semibold mb-6">Edit User</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter user name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_number: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between capitalize">
                      {formData.role || "Select role"}
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
                      LandExecutive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "feasibility_team" })
                      }
                      className="cursor-pointer"
                    >
                      Feasibility
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "l1_md" })
                      }
                      className="cursor-pointer"
                    >
                      Management
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "cmo_cro" })
                      }
                      className="cursor-pointer"
                    >
                      Market Analysis 
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
                        setFormData({ ...formData, role: "management" })
                      }
                      className="cursor-pointer"
                    >
                      Management
                    </DropdownMenuItem>
                  

                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, role: "all_team" })
                      }
                      className="cursor-pointer"
                    >
                      AllTeam
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMode("list");
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditUser}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Update User
              </Button>
            </div>
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
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">View User</h1>
                  <p className="text-gray-500 text-sm mt-1">View the user details below.</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">User Information</CardTitle>
                <CardDescription>Personal and account details.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Name</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.name || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.email || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Phone Number</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.phone_number || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Role</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        selectedUser.role
                      )} capitalize`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center capitalize">
                    {selectedUser.status || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Created Date</Label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[40px] flex items-center">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "-"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
