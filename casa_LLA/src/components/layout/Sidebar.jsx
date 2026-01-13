import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/leads", label: "Leads", icon: "👥" },
  { path: "/owners", label: "Owners", icon: "🏠" },
  { path: "/mediators", label: "Mediators", icon: "🤝" },
  { path: "/masters", label: "Masters", icon: "⚙️" },
  { path: "/reports", label: "Reports", icon: "📈" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Casa LLA</h1>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
