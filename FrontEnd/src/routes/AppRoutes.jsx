import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import LeadsPage from "@/pages/LeadsPage";
import Documents from "@/pages/Documents";
import Mediators from "@/pages/Mediators";
import Login from "@/pages/auth/Login";
import ApprovedLeads from "@/pages/ApprovedLeads";
import PurchasedLeads from "@/pages/PurchasedLeads";
import Leads from "@/pages/Leads";
import Unauthorized from "@/pages/Unauthorized";
import Calls from "@/pages/Calls";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { PERMISSIONS } from "@/config/rbac";
// const Leads = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold">Leads</h1>
//   </div>
// );
const Owners = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Owners</h1>
  </div>
);
import Masters from "@/pages/Masters";
import Profile from "@/pages/Profile";
const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Reports</h1>
  </div>
);

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Protected Routes */}
          <Route path="/pages" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_DASHBOARD}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* Lead Management Routes */}
            <Route path="leads" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_LEADS}>
                <LeadsPage />
              </ProtectedRoute>
            } />
            <Route path="approvedLeads" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_LEADS}>
                <ApprovedLeads />
              </ProtectedRoute>
            } />
            <Route path="purchasedLeads" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_LEADS}>
                <PurchasedLeads />
              </ProtectedRoute>
            } />
            <Route path="leads/new" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.LEAD_CREATE}>
                <Leads />
              </ProtectedRoute>
            } />
            <Route path="leads/:id/edit" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.LEAD_EDIT}>
                <Leads />
              </ProtectedRoute>
            } />

            {/* User Management Routes */}
            <Route path="users" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_USERS}>
                <Users />
              </ProtectedRoute>
            } />

            {/* Document Management Routes */}
            <Route path="documents" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_DOCUMENTS}>
                <Documents />
              </ProtectedRoute>
            } />

            {/* Other Routes */}
            <Route path="owners" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_OWNERS}>
                <Owners />
              </ProtectedRoute>
            } />
            <Route path="mediators" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_MEDIATORS}>
                <Mediators />
              </ProtectedRoute>
            } />
            <Route path="masters" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_MASTERS}>
                <Masters />
              </ProtectedRoute>
            } />  
            
            <Route path="profile" element={<Profile />} />
            <Route path="calls" element={
              <ProtectedRoute requiredPage="lead">
                <Calls />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PAGE_REPORTS}>
                <Reports />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;
