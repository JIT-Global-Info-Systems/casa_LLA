import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/config/rbac";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Map,
  Scale,
  ShieldCheck,
  Users,
  UserRound,
  Handshake,
  Settings,
  Globe,
  Phone,
  ClipboardCheck,
  FileCheck,
  ScaleIcon,
  UserCheck,
  Building,
} from "lucide-react";

export const navItems = [
  { path: "/pages/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/pages/leads", label: "Leads", icon: Users },
  { path: "/pages/users", label: "Users", icon: UserRound },
  { path: "/pages/approvedleads", label: "Approved", icon: UserRound },
  { path: "/pages/purchasedleads", label: "Purchased", icon: UserRound },
  // { path: "/pages/documents", label: "Documents", icon: FileText },
  // { path: "/pages/owners", label: "Approval", icon: Users },
  { path: "/pages/mediators", label: "Mediators", icon: Handshake },
  { path: "/pages/masters", label: "Masters", icon: Settings },
  // { path: "/pages/reports", label: "Reports", icon: BarChart3 },
];

const documentsItems = [
  { hash: "#policies", label: "Policies", icon: ShieldCheck },
  { hash: "#cmda-master-plan", label: "CMDA Master Plan", icon: Map },
  { hash: "#wikimapia", label: "Wikimapia", icon: Globe },
  { hash: "#guideline-value", label: "Guideline Value", icon: Scale },
];

function Sidebar() {
  const location = useLocation();
  const { userRole } = useAuth();
  const activeDocHash =
    location.pathname === "/pages/documents" ? location.hash || "#policies" : "";

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.page) return true; // Show items without page requirement
    return hasAccess(userRole, item.page);
  });

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-52 md:flex-col md:border-r md:border-indigo-700 md:bg-indigo-700">
      <div className="flex h-16 items-center border-b border-indigo-600/60 px-4">
        <div className="text-sm font-semibold tracking-tight text-white">
          Land Lead Aggregation
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
          <div className="border-t border-indigo-600/60 pt-4">
            <div className="px-3 text-[11px] font-semibold tracking-wider text-white/80">
              MAIN NAVIGATION
            </div>
            <div className="mt-2 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "group flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "bg-indigo-500/25 text-white"
                        : "text-white/90 hover:bg-indigo-500/15 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
      </div>
      <div className="border-t border-indigo-600/60 p-3">
        <div className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80">
          Land Lead Aggregation
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
