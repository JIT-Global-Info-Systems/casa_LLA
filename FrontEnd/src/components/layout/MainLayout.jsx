import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex h-screen flex-col overflow-hidden md:pl-64">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
