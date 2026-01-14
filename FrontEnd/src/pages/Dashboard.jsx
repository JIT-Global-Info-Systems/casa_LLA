import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

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

  /* -------------------- DONUT CHART (RECHARTS) -------------------- */

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
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                >
                  {segments.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900">
                {total}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Total
              </div>
            </div>
          </div>

          {/* Legend */}
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

    const iconWrap = {
      success: "bg-green-600/10 text-green-700",
      warning: "bg-orange-600/10 text-orange-700",
      destructive: "bg-red-600/10 text-red-700",
      info: "bg-blue-600/10 text-blue-700",
    };

    return (
      <Card
        className={
          "relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 " +
          toneStyles[tone]
        }
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={
                "flex h-10 w-10 items-center justify-center rounded-lg " +
                iconWrap[tone]
              }
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {value}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-600">
                {label}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* -------------------- WIDE METRIC CARD -------------------- */

  function WideMetricCard({ icon: Icon, label, value, tone }) {
    const toneStyles = {
      success:
        "border-emerald-100 bg-emerald-50/80 before:bg-emerald-500 text-emerald-700",
      warning:
        "border-orange-100 bg-orange-50/80 before:bg-orange-500 text-orange-700",
      destructive:
        "border-rose-100 bg-rose-50/80 before:bg-rose-500 text-rose-700",
      info:
        "border-indigo-100 bg-indigo-50/70 before:bg-indigo-500 text-indigo-700",
    };

    return (
      <Card
        className={
          "relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 " +
          toneStyles[tone]
        }
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {value}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {label}
              </div>
            </div>
            <Icon className="h-10 w-10" />
          </div>
        </div>
      </Card>
    );
  }

  /* -------------------- DASHBOARD -------------------- */

  function Dashboard() {
    const donutCards = [
      {
        title: "Leads Strategy",
        dateRange: "2025-08-30 – 2025-11-30",
        total: 390,
        tone: "blue",
        segments: [
          { label: "Active", value: 193, color: "#22c55e" },
          { label: "Hold", value: 63, color: "#f59e0b" },
          { label: "Lost", value: 125, color: "#ef4444" },
          { label: "Pushed", value: 9, color: "#3b82f6" },
        ],
      },
      {
        title: "Call Strategy",
        dateRange: "2025-08-30 – 2025-11-30",
        total: 193,
        tone: "red",
        segments: [
          { label: "Hot", value: 71, color: "#ef4444" },
          { label: "Warm", value: 68, color: "#f59e0b" },
          { label: "Cold", value: 54, color: "#3b82f6" },
        ],
      },
      {
        title: "Work Stages",
        dateRange: "2025-08-30 – 2025-11-30",
        total: 193,
        tone: "purple",
        segments: [
          { label: "No Action", value: 77, color: "#0f172a" },
          { label: "Visit Done", value: 58, color: "#22c55e" },
          { label: "Negotiation", value: 38, color: "#3b82f6" },
          { label: "Due Diligence", value: 20, color: "#f59e0b" },
        ],
      },
    ];

    return (
      <div className="min-h-full bg-background">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-indigo-700">
              Dashboard
            </div>
            <div className="text-sm text-slate-500">
              CRM analytics overview · Last updated today
            </div>
          </div>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {donutCards.map((d) => (
              <DonutChart key={d.title} {...d} />
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <StatusCard icon={BadgeCheck} label="Active records" value={1991} tone="success" />
            <StatusCard icon={FileText} label="Site visit pending" value={1738} tone="info" />
            <StatusCard icon={CalendarClock} label="Owner meet pending" value={130} tone="warning" />
            <StatusCard icon={AlertTriangle} label="Critical overdue" value={12} tone="destructive" />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <WideMetricCard icon={ClipboardList} label="Open tasks" value={6} tone="success" />
            <WideMetricCard icon={Bell} label="Due in 2 days" value={0} tone="warning" />
            <WideMetricCard icon={AlertTriangle} label="Overdue" value={4} tone="destructive" />
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <WideMetricCard icon={Users} label="Leads to allocate" value={69} tone="success" />
            <WideMetricCard icon={FileCheck2} label="Leads to approve" value={20} tone="info" />
          </section>

          <section className="mt-6">
            <Card className="relative overflow-hidden border-indigo-100 bg-indigo-50/40 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-indigo-500">
              <CardHeader>
                <CardTitle className="text-sm">Notes</CardTitle>
                <CardDescription>
                  Placeholder content block for additional CRM widgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Info className="h-4 w-4" /> Health
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      All systems operational.
                    </div>
                  </div>
                  <div className="rounded-lg border border-violet-100 bg-violet-50/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" /> Documents
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      14 documents pending review.
                    </div>
                  </div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4" /> Team
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      9 active users · 2 pending invitations.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  export default Dashboard;
