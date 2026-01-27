import { useState, useEffect } from "react";
import { useLeads } from "../context/LeadsContext";
import { accessAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CalendarClock,
  ClipboardList,
  FileCheck2,
  FileText,
  Info,
  Users,
} from "lucide-react";
 
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
 import { locationsAPI } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateFilter from "@/components/ui/datefilter";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
 


function DashboardFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* <Select
        label="Location"
        value={filters.location}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, location: value }))
        }
        options={locations}
        placeholder="Location"
      /> */}
 
      {/* <Select
        label="Zone"
        value={filters.zone}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, zone: value }))
        }
        options={zones}
        placeholder="Zone"
      /> */}
    </div>
  );
}
 
/* -------------------- DONUT CHART -------------------- */
 
function DonutChart({ title, dateRange, total, segments, tone }) {
  const toneStyles = {
    blue: "border-sky-100 bg-sky-50/80 before:bg-sky-500",
    red: "border-rose-100 bg-rose-50/80 before:bg-rose-500",
    green: "border-emerald-100 bg-emerald-50/80 before:bg-emerald-500",
    purple: "border-violet-100 bg-violet-50/80 before:bg-violet-500",
    indigo: "border-indigo-100 bg-indigo-50/70 before:bg-indigo-500",
  };
 
  return (
    <Card
      className={
        "relative h-full overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 " +
        (toneStyles[tone] || toneStyles.indigo)
      }
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          {dateRange}
        </CardDescription>
      </CardHeader>
 
      <CardContent>
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
              >
                {segments.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
 
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-slate-900">
              {total}
            </div>
            <div className="text-xs text-slate-500">
              Total
            </div>
          </div>
        </div>
 
        <div className="mt-4 grid grid-cols-2 gap-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs text-slate-600">
                {s.label}
              </span>
              <span className="ml-auto text-xs font-medium text-slate-900">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
 
/* -------------------- STATUS CARD -------------------- */
 
function StatusCard({ icon: Icon, label, value, tone }) {
  const toneStyles = {
    success: "border-emerald-100 bg-emerald-50/80 before:bg-emerald-500",
    warning: "border-orange-100 bg-orange-50/80 before:bg-orange-500",
    destructive: "border-rose-100 bg-rose-50/80 before:bg-rose-500",
    info: "border-sky-100 bg-sky-50/80 before:bg-sky-500",
  };
 
  return (
    <Card
      className={
        "relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 " +
        toneStyles[tone]
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-slate-700" />
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {value}
            </div>
            <div className="text-xs text-slate-600">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
 
/* -------------------- WIDE CARD -------------------- */
 
function WideMetricCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-3xl font-bold text-slate-900">
            {value}
          </div>
          <div className="text-sm text-slate-600">
            {label}
          </div>
        </div>
        <Icon className="h-10 w-10 text-slate-400" />
      </CardContent>
    </Card>
  );
}
 
/* -------------------- DASHBOARD -------------------- */
 
function Dashboard() {
  const { leads, fetchLeads, loading } = useLeads();
  const [filters, setFilters] = useState({
    location: "all",
    zone: "all",
    startDate: "",
    endDate: "",
  });
  const [dashboardData, setDashboardData] = useState({
    leadStatusCounts: {},
    leadStageCounts: {},
    workStageCounts: {},
    totals: {
      approvedLeads: 0,
      pendingLeads: 0,
      purchasedLeads: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // State for date range
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
 
    const [locations, setLocations] = useState([
    { label: "All Locations", value: "all" }
  ]);
  const [selectedLocation, setSelectedLocation] = useState("all");
const [fromDate , setFromDate ] = useState("")
const [toDate , setToDate ] = useState("")
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await locationsAPI.getAll();
        const formattedLocations = [
          { label: "All Locations", value: "all" },
          ...locationsData.map(loc => ({
            label: loc.name || loc.location_name || loc.location || 'Unknown',
            value: loc._id || loc.id || loc.name || loc.location_name || loc.location || 'unknown'
          }))
        ];
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        // Keep default locations if API fails
        setLocations([
          { label: "All Locations", value: "all" },
          { label: "Chennai", value: "chennai" },
          { label: "Bangalore", value: "bangalore" },
          { label: "Mysore", value: "mysore" }
        ]);
      }
    };

    fetchLocations();
  }, []);
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
 
      // Build query parameters
      const params = new URLSearchParams();
      if (dateRange.from) params.append('fromDate', dateRange.from);
      if (dateRange.to) params.append('toDate', dateRange.to);
 
      const url = `http://localhost:5000/api/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
     
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      const data = await response.json();
      setDashboardData(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };
 
  // Fetch data when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);
 
  // Extract data from API response
  const {
    leadStatusCounts = {},
    leadStageCounts = {},
    workStageCounts = {},
    totals = {}
  } = dashboardData;
 
  // Use API response data directly without mapping
  const activeLeadsCount = leadStatusCounts.PENDING || 0;
  const approvedLeadsCount = totals.approvedLeads || 0;
  const purchasedLeadsCount = totals.purchasedLeads || 0;
 
  // Use leadStageCounts directly from API
  const leadStages = {
    ...leadStageCounts,
    // Ensure all expected keys exist with default 0
    hot: leadStageCounts.hot || 0,
    warm: leadStageCounts.warm || 0,
    cold: leadStageCounts.cold || 0,
    management_hot: leadStageCounts.management_hot || leadStageCounts['management hot'] || 0,
    step1: leadStageCounts.step1 || 0
  };
 
  // Use workStageCounts directly from API
  const workStages = { ...workStageCounts };
 
  // Debug log to see the actual API response structure
  console.log('Dashboard API Response:', {
    leadStatusCounts,
    leadStageCounts,
    workStageCounts,
    totals
  });
 
  const donutCards = [
    {
      title: "Leads Stages",
      dateRange: "2025-08-30 – 2025-11-30",
      total: activeLeadsCount + approvedLeadsCount + purchasedLeadsCount,
      tone: "blue",
      segments: Object.entries(leadStatusCounts).map(([status, count]) => ({
        label: status,
        value: count,
        color: ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"][Object.keys(leadStatusCounts).indexOf(status) % 5] || "#94a3b8"
      })),
    },
    {
      title: "Leads Status",
      dateRange: "2025-08-30 – 2025-11-30",
      total: leadStages.hot + leadStages.warm + leadStages.cold + leadStages.management_hot,
      tone: "red",
      segments: Object.entries(leadStageCounts).map(([stage, count]) => ({
        label: stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count,
        color: ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6"][Object.keys(leadStageCounts).indexOf(stage) % 5] || "#94a3b8"
      })),
    },
    {
      title: "Work Stages",
      dateRange: "2025-08-30 – 2025-11-30",
      total: Object.values(workStages).reduce((sum, count) => sum + count, 0),
      tone: "purple",
      segments: Object.entries(workStages).map(([label, value], index) => ({
        label: label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: value,
        color: [
          "#0f172a", "#22c55e", "#3b82f6", "#f59e0b",
          "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"
        ][index % 9]
      })),
    },
 
//   total: Object.values(workStages).reduce((s, v) => s + v, 0),
//   tone: "purple",
//   segments: Object.entries(workStages).map(([role, value], index) => ({
//     label: role
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, l => l.toUpperCase()),   // 👈 converts to Land Executive
//     value,
//     color: [
//       "#0f172a", "#22c55e", "#3b82f6", "#f59e0b",
//       "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"
//     ][index % 9]
//   })),
// }
 
  ];
 
  return (
    <div className="min-h-full bg-background">
           <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
             {/* HEADER + FILTERS */}
             <div className="mb-4 flex items-start justify-between">
      
       {/* LEFT SIDE - Title */}
       <div>
         <div className="text-xl font-bold text-indigo-700">
           Dashboard
         </div>
         <div className="text-sm text-slate-500">
           CRM Analytics Overview
         </div>
       </div>
    
       {/* RIGHT SIDE - Filters */}
       <div className="flex items-center gap-3">
        
         {/* Location */}
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
    
         {/* From Date */}
         <div className="flex items-center gap-2">
           <Label className="text-sm text-gray-600 whitespace-nowrap">From</Label>
           <Input
             type="date"
             value={fromDate}
             onChange={(e) => setFromDate(e.target.value)}
             className="w-full"
           />
         </div>
    
         {/* To Date */}
         <div className="flex items-center gap-2">
           <Label className="text-sm text-gray-600 whitespace-nowrap">To</Label>
           <Input
             type="date"
             value={toDate}
             onChange={(e) => setToDate(e.target.value)}
             className="w-[150px]"
           />
         </div>
       </div>
     </div>
 
        {/* FILTERS */}
        <div className="flex flex-col gap-4">
           <div className="flex justify-end items-center">
             {/* <DashboardFilters filters={filters} setFilters={setFilters} /> */}
             <Button
               variant="outline"
               size="sm"
               onClick={async () => {
                 try {
                   await fetchLeads();
                   toast.success("Dashboard data refreshed");
                 } catch (error) {
                   console.error("Error refreshing data:", error);
                   toast.error("Failed to refresh data");
                 }
               }}
               disabled={loading}
               className="gap-2"
             >
               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
               Refresh
             </Button>
           </div>
         </div>
 
        {/* DONUT CHARTS */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {donutCards.map((d) => (
            <DonutChart key={d.title} {...d} />
          ))}
        </section>
 
        {/* STATUS CARDS */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <StatusCard icon={BadgeCheck} label="Active records" value={activeLeadsCount} tone="success" />
          <StatusCard icon={FileText} label="Site visit pending" value={1738} tone="info" />
          <StatusCard icon={CalendarClock} label="Owner meet pending" value={130} tone="warning" />
          <StatusCard icon={AlertTriangle} label="Critical overdue" value={12} tone="destructive" />
        </section>
 
        {/* WIDE CARDS */}
        {/* <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WideMetricCard icon={ClipboardList} label="Open tasks" value={6} />
          <WideMetricCard icon={Bell} label="Due in 2 days" value={0} />
          <WideMetricCard icon={AlertTriangle} label="Overdue" value={4} />
        </section> */}
 
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WideMetricCard icon={Users} label="Approved Leads" value={totals.approvedLeads} />
          <WideMetricCard icon={FileCheck2} label="Purchased Leads" value={purchasedLeadsCount} />
          <WideMetricCard icon={FileCheck2} label="Pending Leads" value={totals.pendingLeads} />
        </section>
 
        {/* NOTES */}
        {/* <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notes</CardTitle>
              <CardDescription>
                Placeholder content block for additional CRM widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-4">System Healthy</div>
              <div className="rounded-lg border p-4">14 Docs Pending</div>
              <div className="rounded-lg border p-4">9 Active Users</div>
            </CardContent>
          </Card>
        </section> */}
 
      </div>
    </div>
  );
}
 
export default Dashboard;
 
 
 
 
 