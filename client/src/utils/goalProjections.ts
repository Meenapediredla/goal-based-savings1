export interface GoalLike {
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

export interface GoalProjection {
  progressPercent: number;
  saved: number;
  target: number;
  remaining: number;
  daysRemaining: number;
  monthsRemaining: number;
  monthlyRequired: number;
  weeklyRequired: number;
  dailyRequired: number;
  isComplete: boolean;
  isOverdue: boolean;
  status: "complete" | "on_track" | "at_risk" | "behind" | "overdue";
  statusLabel: string;
  projectedCompletionDate: Date | null;
  projectedCompletionLabel: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseDeadline(deadline: string): Date {
  const parsed = new Date(deadline);
  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

export function getDaysRemaining(deadline: string, from: Date = new Date()): number {
  const end = parseDeadline(deadline);
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function computeProjection(
  goal: GoalLike,
  plannedMonthlySavings?: number
): GoalProjection {
  const saved = goal.savedAmount || 0;
  const target = Math.max(goal.targetAmount, 0);
  const remaining = Math.max(target - saved, 0);
  const progressPercent = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
  const daysRemaining = getDaysRemaining(goal.deadline);
  const monthsRemaining = Math.max(daysRemaining / 30, 1 / 30);
  const isComplete = remaining <= 0;
  const isOverdue = !isComplete && daysRemaining < 0;

  const monthlyRequired = isComplete ? 0 : remaining / monthsRemaining;
  const weeklyRequired = monthlyRequired / 4.33;
  const dailyRequired = monthlyRequired / 30;

  let status: GoalProjection["status"] = "on_track";
  let statusLabel = "On track";

  if (isComplete) {
    status = "complete";
    statusLabel = "Goal achieved";
  } else if (isOverdue) {
    status = "overdue";
    statusLabel = "Past deadline";
  } else if (progressPercent < 25 && daysRemaining < 90) {
    status = "behind";
    statusLabel = "Behind schedule";
  } else if (progressPercent < 50 && daysRemaining < 60) {
    status = "at_risk";
    statusLabel = "Needs attention";
  } else if (daysRemaining <= 30 && progressPercent < 80) {
    status = "at_risk";
    statusLabel = "Needs attention";
  }

  const pace = plannedMonthlySavings && plannedMonthlySavings > 0 ? plannedMonthlySavings : monthlyRequired;
  let projectedCompletionDate: Date | null = null;
  let projectedCompletionLabel = "—";

  if (isComplete) {
    projectedCompletionLabel = "Already complete";
  } else if (pace > 0) {
    const monthsToComplete = remaining / pace;
    projectedCompletionDate = new Date();
    projectedCompletionDate.setDate(
      projectedCompletionDate.getDate() + Math.ceil(monthsToComplete * 30)
    );
    projectedCompletionLabel = formatDate(projectedCompletionDate);

    if (daysRemaining >= 0 && projectedCompletionDate > parseDeadline(goal.deadline)) {
      status = status === "complete" ? status : "behind";
      statusLabel = "Projected to miss deadline";
    }
  }

  return {
    progressPercent,
    saved,
    target,
    remaining,
    daysRemaining,
    monthsRemaining,
    monthlyRequired,
    weeklyRequired,
    dailyRequired,
    isComplete,
    isOverdue,
    status,
    statusLabel,
    projectedCompletionDate,
    projectedCompletionLabel,
  };
}
