import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Map,
  Scale,
  ShieldCheck,
  Globe,
  Users,
  UserRound,
  Handshake,
  Settings,
} from "lucide-react";

export const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/leads", label: "Leads", icon: Users },
  { path: "/users", label: "Users", icon: UserRound },
  // { path: "/documents", label: "Documents", icon: FileText },
  { path: "/owners", label: "Approval", icon: Users },
  { path: "/mediators", label: "Mediators", icon: Handshake },
  { path: "/masters", label: "Masters", icon: Settings },
  // { path: "/reports", label: "Reports", icon: BarChart3 },
];

const documentsItems = [
  { hash: "#policies", label: "Policies", icon: ShieldCheck },
  { hash: "#cmda-master-plan", label: "CMDA Master Plan", icon: Map },
  { hash: "#wikimapia", label: "Wikimapia", icon: Globe },
  { hash: "#guideline-value", label: "Guideline Value", icon: Scale },
];

function Sidebar() {
  const location = useLocation();
  const activeDocHash =
    location.pathname === "/documents" ? location.hash || "#policies" : "";

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-52 md:flex-col md:border-r md:border-indigo-700 md:bg-indigo-700">
      <div className="flex h-16 items-center border-b border-indigo-600/60 px-4">
        <div className="text-sm font-semibold tracking-tight text-white">
          Land Lead Aggregation
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-4">
          <div className="border-t border-indigo-600/60 pt-4">
            <div className="px-3 text-[11px] font-semibold tracking-wider text-white/80">
              DOCUMENTS
            </div>
            <div className="mt-2 space-y-1">
              {documentsItems.map((item) => {
                const Icon = item.icon;
                const to = `/documents${item.hash}`;
                const isActive = activeDocHash === item.hash;

                return (
                  <Link
                    key={item.hash}
                    to={to}
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
      </div>
      <div className="border-t border-indigo-600/60 p-3">
        <div className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80">
          Enterprise CRM
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
