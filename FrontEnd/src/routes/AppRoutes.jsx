import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import LeadsPage from "@/pages/LeadsPage";
import Documents from "@/pages/Documents";
import Mediators from "@/pages/Mediators";
import Login from "@/pages/auth/Login";
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
const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Reports</h1>
  </div>
);

function AppRoutes() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/pages" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="users" element={<Users />} />
          <Route path="documents" element={<Documents />} />
          <Route path="owners" element={<Owners />} />
          <Route path="mediators" element={<Mediators />} />
          <Route path="masters" element={<Masters />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
