
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/config/rbac";
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

// export const navItems = [
//   { path: "/pages/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { path: "/pages/leads", label: "Leads", icon: Users },
//   { path: "/pages/users", label: "Users", icon: UserRound },
//   { path: "/pages/approvedleads", label: "Approval", icon: UserRound },
//   { path: "/pages/purchasedleads", label: "Purchased", icon: UserRound },
//   { path: "/pages/calls", label: "Call", icon: FileText },
//   // { path: "/pages/owners", label: "Approval", icon: Users },
//   { path: "/pages/mediators", label: "Mediators", icon: Handshake },
//   { path: "/pages/masters", label: "Masters", icon: Settings },
//   { path: "/pages/reports", label: "Reports", icon: BarChart3 },
// ]

export const navItems = [
  { path: "/pages/dashboard", label: "Dashboard", icon: LayoutDashboard ,page: "dashboard"},
  { path: "/pages/leads", label: "Leads", icon: Users , page: "lead"},
  { path: "/pages/users", label: "Users", icon: UserRound , page: "users"},
  { path: "/pages/approvedleads", label: "Approval", icon: UserRound ,page: "approvedleads" },
  { path: "/pages/purchasedleads", label: "Purchased", icon: UserRound , page: "purchasedleads"},
  { path: "/pages/calls", label: "Call", icon: FileText,page: "calls" },
  // { path: "/pages/owners", label: "Approval", icon: Users },
  { path: "/pages/mediators", label: "Mediators", icon: Handshake , page: "mediator"},
  { path: "/pages/masters", label: "Masters", icon: Settings , page: "masters"  },
  { path: "/pages/reports", label: "Reports", icon: BarChart3, page: "reports" },
]

const documentsItems = [
  { hash: "#policies", label: "Policies", icon: ShieldCheck },
  { hash: "#cmda-master-plan", label: "CMDA Master Plan", icon: Map },
  { hash: "#wikimapia", label: "Wikimapia", icon: Globe },
  { hash: "#guideline-value", label: "Guideline Value", icon: Scale },
];

function Sidebar() {
  const location = useLocation();
  const { users, fetchUsers, loading } = useUsers();
  const { userRole } = useAuth();
  const activeDocHash =
    location.pathname === "/pages/documents" ? location.hash || "#policies" : "";

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.page) return true; // Show items without page requirement
    return hasAccess(userRole, item.page);
  });

  // Show disabled items with tooltips for better UX
  const allNavItemsWithAccess = navItems.map(item => ({
    ...item,
    hasAccess: !item.page || hasAccess(userRole, item.page),
    disabled: item.page && !hasAccess(userRole, item.page)
  }));
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-52 md:flex-col md:border-r md:border-indigo-700 md:bg-indigo-700">
      <div className="flex h-16 items-center border-b border-indigo-600/60 px-4">
        <div className="text-sm font-semibold tracking-tight text-white">
          Land Lead Aggregation
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-4">
          <div className="px-3 text-[11px] font-semibold tracking-wider text-white/80">
            EMPLOYEE
          </div>
          <div className="border-t border-indigo-600/60 pt-0.5 mt-2">
            <div className="mt-2 space-y-1 max-h-82 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="px-3 text-xs text-white/60">Loading users...</div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div key={user.user_id || user.id} className="px-3 py-1">
                    <div className="text-sm font-medium text-white/90">
                      {user.username || user.name || 'Unknown User'} - {user.role || 'No role'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 text-xs text-white/60">No users found</div>
              )}
            </div>
          </div>
        </div>
      
        <div className="border-t border-indigo-600/60 pt-4">
          <div className="px-3 text-[11px] font-semibold tracking-wider text-white/80">
            DOCUMENTS
          </div>
          <div className="border-t border-indigo-600/60 pt-0.5 mt-2">
            <div className="mt-2 space-y-1">
              {documentsItems.map((item) => {
                const Icon = item.icon;
                const to = `/pages/documents${item.hash}`;
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
          Land Lead Aggregation
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

