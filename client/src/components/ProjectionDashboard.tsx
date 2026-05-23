import { useMemo, useState, type ComponentType } from "react";
import {
  Calendar,
  CalendarClock,
  IndianRupee,
  TrendingUp,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  computeProjection,
  formatCurrency,
  type GoalLike,
} from "../utils/goalProjections";

interface ProjectionDashboardProps {
  goal: GoalLike & { goalName: string; deadline: string };
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const styles: Record<string, string> = {
    complete: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    on_track: "bg-blue-50 text-blue-700 ring-blue-600/20",
    at_risk: "bg-amber-50 text-amber-800 ring-amber-600/20",
    behind: "bg-orange-50 text-orange-800 ring-orange-600/20",
    overdue: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] ?? styles.on_track}`}
    >
      {status === "complete" ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" />
      )}
      {label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function ProjectionDashboard({ goal }: ProjectionDashboardProps) {
  const [plannedMonthly, setPlannedMonthly] = useState<string>("");

  const projection = useMemo(() => {
    const monthly = plannedMonthly ? Number(plannedMonthly) : undefined;
    return computeProjection(goal, monthly && monthly > 0 ? monthly : undefined);
  }, [goal, plannedMonthly]);

  const progressStroke = Math.min(projection.progressPercent, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeOffset = circumference - (progressStroke / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Quick projection</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{goal.goalName}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={projection.status} label={projection.statusLabel} />
              <span className="text-sm text-slate-500">
                Deadline:{" "}
                <span className="font-medium text-slate-800">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(goal.deadline))}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">
                  {projection.progressPercent.toFixed(0)}%
                </span>
                <span className="text-xs text-slate-500">funded</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{ width: `${progressStroke}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-600 sm:justify-end sm:gap-6">
            <span>
              Saved: <strong className="text-slate-900">{formatCurrency(projection.saved)}</strong>
            </span>
            <span>
              Target: <strong className="text-slate-900">{formatCurrency(projection.target)}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Remaining"
          value={formatCurrency(projection.remaining)}
          sub={projection.isComplete ? "Nothing left to save" : "To reach your target"}
          icon={Wallet}
        />
        <MetricCard
          label="Days left"
          value={
            projection.isComplete
              ? "—"
              : projection.isOverdue
                ? `${Math.abs(projection.daysRemaining)} overdue`
                : String(projection.daysRemaining)
          }
          sub={
            projection.isComplete
              ? "Goal complete"
              : projection.isOverdue
                ? "Extend deadline or increase savings"
                : "Until target deadline"
          }
          icon={Calendar}
        />
        <MetricCard
          label="Monthly savings needed"
          value={projection.isComplete ? "—" : formatCurrency(projection.monthlyRequired)}
          sub="To finish on time"
          icon={IndianRupee}
        />
        <MetricCard
          label="Projected completion"
          value={projection.projectedCompletionLabel}
          sub="Based on planned monthly amount"
          icon={CalendarClock}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">What-if planner</h3>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Enter how much you plan to save each month to see when you could reach this goal.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="planned-monthly" className="text-xs font-medium text-slate-600">
              Planned monthly savings (₹)
            </label>
            <input
              id="planned-monthly"
              type="number"
              min="0"
              placeholder={Math.ceil(projection.monthlyRequired).toString()}
              value={plannedMonthly}
              onChange={(e) => setPlannedMonthly(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500">Weekly pace</p>
              <p className="font-semibold text-slate-900">
                {projection.isComplete ? "—" : formatCurrency(projection.weeklyRequired)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Daily pace</p>
              <p className="font-semibold text-slate-900">
                {projection.isComplete ? "—" : formatCurrency(projection.dailyRequired)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectionDashboard;
