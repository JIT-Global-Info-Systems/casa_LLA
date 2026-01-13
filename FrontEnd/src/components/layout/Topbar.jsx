import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

import { SidebarNav } from "./Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const pageTitles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/users": "Users",
  "/documents": "Documents",
  "/owners": "Owners",
  "/mediators": "Mediators",
  "/masters": "Masters",
  "/reports": "Reports",
};

function Topbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-16 items-center border-b border-border px-4">
                <Link to="/dashboard" className="text-sm font-semibold">
                  Casa LLA
                </Link>
              </div>
              <SidebarNav
                className="px-2"
                onNavigate={() => setMobileNavOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="flex flex-col">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="hidden text-xs text-muted-foreground sm:block">
              Analytics dashboard
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>ZA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
