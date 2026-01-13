import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Users,
  UserRound,
  Handshake,
  Settings,
} from "lucide-react";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/leads", label: "Leads", icon: Users },
  { path: "/users", label: "Users", icon: UserRound },
  { path: "/documents", label: "Documents", icon: FileText },
  { path: "/owners", label: "Owners", icon: Users },
  { path: "/mediators", label: "Mediators", icon: Handshake },
  { path: "/masters", label: "Masters", icon: Settings },
  { path: "/reports", label: "Reports", icon: BarChart3 },
];

export function SidebarNav({ className, onNavigate }) {
  const location = useLocation();

  return (
    <nav className={cn("px-3 py-4", className)} aria-label="Primary">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-slate-800/70 text-white"
                  : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r",
                  isActive ? "bg-blue-500" : "bg-transparent"
                )}
                aria-hidden="true"
              />
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-slate-800 md:bg-slate-900">
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <div className="text-sm font-semibold tracking-tight text-white">
          Casa LLA
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <div className="border-t border-slate-800 p-3">
        <div className="rounded-lg bg-slate-800/40 px-3 py-2 text-xs text-slate-300">
          Enterprise CRM
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
