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

function DonutChart({
  title,
  dateRange,
  total,
  segments,
}) {
  const size = 160;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="hsl(var(--border))"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {segments.map((s) => {
                const dash = (s.value / total) * c;
                const dashOffset = c - offset;
                offset += dash;

                return (
                  <circle
                    key={s.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={s.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${dash} ${c - dash}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                );
              })}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold leading-none text-foreground">
                {total}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Total</div>
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
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="ml-auto text-xs font-medium text-foreground">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const toneStyles = {
    success: "border-green-200 bg-green-50",
    warning: "border-orange-200 bg-orange-50",
    destructive: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
  };

  const iconWrap = {
    success: "bg-green-600/10 text-green-700",
    warning: "bg-orange-600/10 text-orange-700",
    destructive: "bg-red-600/10 text-red-700",
    info: "bg-blue-600/10 text-blue-700",
  };

  return (
    <Card className={"" + toneStyles[tone]}>
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
          <div className="min-w-0">
            <div className="text-2xl font-bold leading-none text-foreground">
              {value}
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WideMetricCard({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const toneStyles = {
    success: "bg-green-600",
    warning: "bg-orange-500",
    destructive: "bg-red-500",
    info: "bg-blue-600",
  };

  return (
    <Card className="overflow-hidden">
      <div className={"p-5 text-white " + toneStyles[tone]}>
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="text-3xl font-bold leading-none">{value}</div>
            <div className="mt-2 text-sm/5 opacity-90">{label}</div>
          </div>
          <Icon className="h-10 w-10 opacity-90" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const donutCards = [
    {
      title: "Leads Strategy",
      dateRange: "2025-08-30 – 2025-11-30",
      total: 390,
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
          <div className="text-xl font-semibold text-foreground">
            Dashboard
          </div>
          <div className="text-sm text-muted-foreground">
            CRM analytics overview · Last updated today
          </div>
        </div>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {donutCards.map((d) => (
              <DonutChart
                key={d.title}
                title={d.title}
                dateRange={d.dateRange}
                total={d.total}
                segments={d.segments}
              />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <StatusCard
              icon={BadgeCheck}
              label="Active records"
              value={1991}
              tone="success"
            />
            <StatusCard
              icon={FileText}
              label="Site visit pending"
              value={1738}
              tone="info"
            />
            <StatusCard
              icon={CalendarClock}
              label="Owner meet pending"
              value={130}
              tone="warning"
            />
            <StatusCard
              icon={AlertTriangle}
              label="Critical overdue"
              value={12}
              tone="destructive"
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <WideMetricCard
              icon={ClipboardList}
              label="Open tasks"
              value={6}
              tone="success"
            />
            <WideMetricCard
              icon={Bell}
              label="Due in 2 days"
              value={0}
              tone="warning"
            />
            <WideMetricCard
              icon={AlertTriangle}
              label="Overdue"
              value={4}
              tone="destructive"
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <WideMetricCard
              icon={Users}
              label="Leads to allocate"
              value={69}
              tone="success"
            />
            <WideMetricCard
              icon={FileCheck2}
              label="Leads to approve"
              value={20}
              tone="info"
            />
          </div>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notes</CardTitle>
              <CardDescription>
                Placeholder content block for additional CRM widgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Info className="h-4 w-4" />
                    Health
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    All systems operational.
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4" />
                    Documents
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    14 documents pending review.
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Users className="h-4 w-4" />
                    Team
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
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
