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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
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
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/unauthorized" element={<Unauthorized/>}/>
          {/* Protected Routes */}
          <Route path="/pages" element={
            <ProtectedRoute requiredPage="dashboard">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
           {/* Lead Management Routes */}
            <Route path="leads" element={
              <ProtectedRoute requiredPage="lead">
                <LeadsPage />
              </ProtectedRoute>
            } />
            <Route path="approvedLeads" element={
              <ProtectedRoute requiredPage="lead">
                <ApprovedLeads />
              </ProtectedRoute>
            } />
            <Route path="purchasedLeads" element={
              <ProtectedRoute requiredPage="lead">
                <PurchasedLeads />
              </ProtectedRoute>
            } />
            <Route path="leads/new" element={
              <ProtectedRoute requiredPage="lead">
                <Leads />
              </ProtectedRoute>
            } />
            <Route path="leads/:id/edit" element={
              <ProtectedRoute requiredPage="lead">
                <Leads />
              </ProtectedRoute>
            } />

            {/* User Management Routes */}
            <Route path="users" element={
              <ProtectedRoute requiredPage="users">
                <Users />
              </ProtectedRoute>
            } />

            {/* Document Management Routes */}
            <Route path="documents" element={
              <ProtectedRoute requiredPage="documents">
                <Documents />
              </ProtectedRoute>
            } />

            {/* Other Routes */}
            <Route path="owners" element={
              <ProtectedRoute requiredPage="owners">
                <Owners />
              </ProtectedRoute>
            } />
            <Route path="mediators" element={
              <ProtectedRoute requiredPage="mediator">
                <Mediators />
              </ProtectedRoute>
            } />
            <Route path="masters" element={
              <ProtectedRoute requiredPage="masters">
                <Masters />
              </ProtectedRoute>
            } />
            <Route path="profile" element={<Profile />} />
            <Route path="reports" element={
              <ProtectedRoute requiredPage="reports">
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
