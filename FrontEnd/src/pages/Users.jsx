import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye, MoreVertical, RefreshCw } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([
    { _id: "USR001", name: "John Doe", email: "john.doe@example.com", password: "password123", role: "admin", phone: "+1234567890", status: "active", createdAt: "2024-01-15T10:30:00Z", createdBy: "Admin" },
    { _id: "USR002", name: "Jane Smith", email: "jane.smith@example.com", password: "password456", role: "manager", phone: "+1234567891", status: "active", createdAt: "2024-01-16T14:20:00Z", createdBy: "Manager" },
    { _id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", password: "password789", role: "telecaller", phone: "+1234567892", status: "inactive", createdAt: "2024-01-17T09:15:00Z", createdBy: "Admin" },
    { _id: "USR004", name: "Alice Brown", email: "alice.brown@example.com", password: "password012", role: "executive", phone: "+1234567893", status: "active", createdAt: "2024-01-18T16:45:00Z", createdBy: "Executive" },
    { _id: "USR005", name: "Charlie Wilson", email: "charlie.wilson@example.com", password: "password345", role: "telecaller", phone: "+1234567894", status: "active", createdAt: "2024-01-19T11:30:00Z", createdBy: "Admin" }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "telecaller",
    phone: "",
    status: "active"
  });

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter, fromDate, toDate]);

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (fromDate) {
      filtered = filtered.filter(user => new Date(user.createdAt) >= new Date(fromDate));
    }

    if (toDate) {
      filtered = filtered.filter(user => new Date(user.createdAt) <= new Date(toDate));
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    const newUser = {
      _id: `USR${String(users.length + 1).padStart(3, '0')}`,
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: "Admin"
    };
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "telecaller",
      phone: "",
      status: "active"
    });
  };

  const handleEditUser = () => {
    setUsers(users.map(user =>
      user._id === selectedUser._id ? { ...user, ...formData } : user
    ));
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "telecaller",
      phone: "",
      status: "active"
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || "",
      role: user.role,
      phone: user.phone,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (user) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const getCategoryColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-purple-100 text-purple-700",
      executive: "bg-orange-100 text-orange-700",
      telecaller: "bg-blue-100 text-blue-700"
    };
    return colors[role] || "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl font-semibold text-indigo-700">Users</h1>
            <p className="text-sm text-gray-500 mt-1">User list · Last updated today</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between capitalize">
                          {formData.role || "Select role"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "telecaller" })} className="cursor-pointer">
                          Telecaller
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "executive" })} className="cursor-pointer">
                          Executive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "manager" })} className="cursor-pointer">
                          Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "admin" })} className="cursor-pointer">
                          Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between capitalize">
                          {formData.status || "Select status"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, status: "active" })} className="cursor-pointer">
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFormData({ ...formData, status: "inactive" })} className="cursor-pointer">
                          Inactive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700">
                    Add User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  <Button variant="outline" className="min-w-[140px] justify-between border-gray-300 capitalize">
                    {roleFilter === "all" ? "Select" : roleFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => setRoleFilter("all")} className="cursor-pointer">
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("admin")} className="cursor-pointer">
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("manager")} className="cursor-pointer">
                    Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("executive")} className="cursor-pointer">
                    Executive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("telecaller")} className="cursor-pointer">
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")} className="cursor-pointer">
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")} className="cursor-pointer">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(user.role)} capitalize`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                          <DropdownMenuItem onClick={() => openViewDialog(user)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(user)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user "{user.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No users found matching your criteria.</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing {filteredUsers.length} results</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="text-gray-400">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled className="text-gray-400">
                Next
              </Button>
              <Button variant="outline" size="sm" disabled className="text-gray-400">
                Last
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between capitalize">
                    {formData.role}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "telecaller" })} className="cursor-pointer">
                    Telecaller
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "executive" })} className="cursor-pointer">
                    Executive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "manager" })} className="cursor-pointer">
                    Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFormData({ ...formData, role: "admin" })} className="cursor-pointer">
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-indigo-600 hover:bg-indigo-700">
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">ID:</Label>
                <div className="col-span-2 text-gray-900">{selectedUser._id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Name:</Label>
                <div className="col-span-2 text-gray-900">{selectedUser.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Email:</Label>
                <div className="col-span-2 text-gray-900">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Phone:</Label>
                <div className="col-span-2 text-gray-900">{selectedUser.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Role:</Label>
                <div className="col-span-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedUser.role)} capitalize`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Status:</Label>
                <div className="col-span-2 capitalize text-gray-900">{selectedUser.status}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Created:</Label>
                <div className="col-span-2 text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Label className="font-medium text-gray-700">Created By:</Label>
                <div className="col-span-2 text-gray-900">{selectedUser.createdBy}</div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsViewDialogOpen(false)} className="bg-indigo-600 hover:bg-indigo-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;