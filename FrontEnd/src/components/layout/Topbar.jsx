// import * as React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Bell, Menu } from "lucide-react";
 
// import { navItems } from "./Sidebar";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useAuth } from "../../context/AuthContext";
 
// const pageTitles = {
//   "/pages": "Dashboard",
//   "/pages/dashboard": "Dashboard",
//   "/pages/leads": "Leads",
//   "/pages/users": "Users",
//   "/pages/approvedleads": "Approval",
//   "/pages/mediators": "Mediators",
//   "/pages/masters": "Masters",
//   "/pages/documents": "Documents",
//   "/pages/profile": "Profile",
// };
 
// const locations = [
//   { label: "All Locations", value: "all" },
//   { label: "Chennai", value: "chennai" },
//   { label: "Bangalore", value: "bangalore" },
//   { label: "Mysore", value: "mysore" },
// ];
 
// function Topbar() {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate()
//   const title = pageTitles[location.pathname] || "Dashboard";
//   const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
//   const [selectedLocation, setSelectedLocation] = React.useState("all");
 
//   // Function to get initials from user name
//   const getInitials = (name) => {
//     if (!name || typeof name !== 'string') {
//       return 'U'; // Default for undefined/invalid names
//     }
//     return name
//       .split(" ")
//       .map(word => word[0])
//       .join("")
//       .toUpperCase();
//   };
 
//   const isItemActive = (path) => {
//     return (
//       location.pathname === path ||
//       (path === "/pages/dashboard" && location.pathname === "/pages")
//     );
//   };
 
//   return (
//     <header className="sticky top-0 z-30 h-16 border-b border-border bg-white shadow-sm">
//       <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
//         <div className="flex items-center gap-3">
//           <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
//             <SheetTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="md:hidden"
//                 aria-label="Open navigation"
//               >
//                 <Menu />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="border-r border-indigo-700 bg-indigo-700 p-0 text-white">
//               <div className="flex h-16 items-center border-b border-indigo-600/60 px-4">
//                 <Link to="/dashboard" className="text-sm font-semibold text-white">
//                   Casa LLA
//                 </Link>
//               </div>
//               <nav className=" ms-5 px-3 py-4" aria-label="Primary">
//                 <div className="space-y-1">
//                   {navItems.map((item) => {
//                     const active = isItemActive(item.path);
//                     const Icon = item.icon;
 
//                     return (
//                       <Link
//                         key={item.path}
//                         to={item.path}
//                         onClick={() => setMobileNavOpen(false)}
//                         className={
//                           "group flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
//                           (active
//                             ? "bg-indigo-500/25 text-white"
//                             : "text-white/90 hover:bg-indigo-500/15 hover:text-white")
//                         }
//                       >
//                         <Icon className="h-4 w-4" />
//                         <span className="truncate">{item.label}</span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </nav>
//             </SheetContent>
//           </Sheet>
 
//           <div className="flex flex-col">
//             <div className="text-base font-bold text-indigo-700">{title}</div>
//             <div className="hidden text-xs text-slate-500 sm:block">
//               Analytics dashboard
//             </div>
//           </div>
 
//           <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
//             {navItems.map((item) => {
//               const active = isItemActive(item.path);
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={
//                     "rounded-full px-3 py-2 text-sm font-medium transition-colors " +
//                     (active
//                       ? "bg-indigo-50 text-indigo-700"
//                       : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
//                   }
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
 
//         <div className="flex items-center gap-2">
//           <Select value={selectedLocation} onValueChange={setSelectedLocation}>
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Location" />
//             </SelectTrigger>
//             <SelectContent className="bg-white border border-gray-200 shadow-lg">
//               {locations.map((location) => (
//                 <SelectItem key={location.value} value={location.value}>
//                   {location.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
         
//           <Button variant="ghost" size="icon" aria-label="Notifications">
//             <Bell />
//           </Button>
 
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-full"
//                 aria-label="Open user menu"
//               >
//                 <Avatar className="h-9 w-9">
//                   <AvatarFallback className="bg-indigo-600 text-white">
//                     {getInitials(user?.name)}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
//               <DropdownMenuLabel className="text-slate-900">Account</DropdownMenuLabel>
//               <DropdownMenuSeparator className="bg-gray-200" />
//               <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer" onClick={() => navigate('/pages/profile')}>Profile</DropdownMenuItem>
//               <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">Settings</DropdownMenuItem>
//               <DropdownMenuSeparator className="bg-gray-200" />
//               <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer" onClick={() => navigate('/')}>Logout</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// }
 
// export default Topbar;



import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
 
import { navItems } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useAuth } from "../../context/AuthContext";
 
const pageTitles = {
  "/pages": "Dashboard",
  "/pages/dashboard": "Dashboard",
  "/pages/leads": "Leads",
  "/pages/users": "Users",
  "/pages/approvedleads": "Approval",
  "/pages/purchasedleads":"Purchased",
  "/pages/mediators": "Mediators",
  "/pages/masters": "Masters",
  "/pages/documents": "Documents",
  "/pages/profile": "Profile",
  "/pages/calls": "Calls",
};
 
const locations = [
  { label: "All Locations", value: "all" },
  { label: "Chennai", value: "chennai" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Mysore", value: "mysore" },
];
 
function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] || "Dashboard";
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState("all");
 
  // Function to get initials from user name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'U'; // Default for undefined/invalid names
    }
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };
 
  const isItemActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/pages/dashboard" && location.pathname === "/pages")
    );
  };
 
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white shadow-sm">
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
            <SheetContent side="left" className="border-r border-indigo-700 bg-indigo-700 p-0 text-white">
              <div className="flex h-16 items-center border-b border-indigo-600/60 px-4">
                <Link to="/dashboard" className="text-sm font-semibold text-white">
                  Casa LLA
                </Link>
              </div>
              <nav className=" ms-5 px-3 py-4" aria-label="Primary">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const active = isItemActive(item.path);
                    const Icon = item.icon;
 
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileNavOpen(false)}
                        className={
                          "group flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                          (active
                            ? "bg-indigo-500/25 text-white"
                            : "text-white/90 hover:bg-indigo-500/15 hover:text-white")
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
 
          <div className="flex flex-col">
            <div className="text-base font-bold text-indigo-700">{title}</div>
            <div className="hidden text-xs text-slate-500 sm:block">
              Analytics dashboard
            </div>
          </div>
 
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
 
        <div className="flex items-center gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
         
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
                  <AvatarFallback className="bg-indigo-600 text-white">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel className="text-slate-900">Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer" onClick={() => navigate('/pages/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer" onClick={() => navigate('/')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
 
export default Topbar