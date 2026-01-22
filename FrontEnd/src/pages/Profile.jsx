import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, EyeOff, Mail, Phone, Calendar, Shield, CheckCircle2, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../services/api";

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || {});

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name || '',
    phone: profile.phone_number || ''
  });

  useEffect(() => {
    if (user) {
      setProfile(user);
      setEditForm({
        name: user.name || '',
        phone: user.phone_number || ''
      });
    }
  }, [user]);

  const handleEditProfile = async () => {
    try {
      console.log('Updating profile with:', editForm);
      const response = await usersAPI.update(profile._id, editForm);
      console.log('Profile update response:', response);

      // Update local state with the response data
      if (response.user) {
        setProfile({ ...profile, ...response.user });
      } else {
        // Fallback: update local state with form data
        setProfile({ ...profile, name: editForm.name, phone_number: editForm.phone });
      }

      setIsEditDialogOpen(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Failed to update profile: " + error.message);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-200",
      manager: "bg-purple-100 text-purple-700 border-purple-200",
      executive: "bg-orange-100 text-orange-700 border-orange-200",
      telecaller: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return colors[role.toLowerCase()] || "bg-blue-100 text-blue-700 border-blue-200";
  };

  // Show loading state
  if (loading || !profile || !profile._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and security settings</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <Card className="bg-white shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-indigo-600">
                        {getInitials(profile.name)}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(profile.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 md:mt-0 md:pb-2">
                <Button
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => navigate('/pages/change-password')}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Edit Profile Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                          id="edit-name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone Number</Label>
                        <Input
                          id="edit-phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email Address</Label>
                        <Input
                          id="edit-email"
                          value={profile.email}
                          disabled
                          className="bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Input
                          id="edit-role"
                          value={profile.role}
                          disabled
                          className="bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500">Contact administrator to change role</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditProfile} className="bg-indigo-600 hover:bg-indigo-700">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-600 mt-1">Your basic profile details</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-sm text-gray-900 mt-1">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-sm text-gray-900 mt-1">{profile.phone_number}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Joined Date</p>
                  <p className="text-sm text-gray-900 mt-1">{new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card className="bg-white shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-600 mt-1">Your role and access level</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(profile.role)}`}>
                      {profile.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Account Status</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Password</p>
                  <p className="text-sm text-gray-900 mt-1">••••••••</p>
                  <button
                    onClick={() => navigate('/pages/change-password')}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1"
                  >
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm mt-6">
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Security Tip</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Keep your account secure by using a strong password and never sharing your credentials with others.
                  Consider enabling two-factor authentication for added security.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
