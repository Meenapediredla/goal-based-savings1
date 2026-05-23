import { computeProjection, formatCurrency, type GoalLike } from "./goalProjections";

export interface ExpenseLike {
  category: string;
  amount: number;
}

export interface BudgetPlanLike {
  monthlyIncome: number;
  monthlyBudgetLimit: number;
}

export type InsightTone = "positive" | "neutral" | "warning" | "critical";

export interface Insight {
  id: string;
  title: string;
  body: string;
  tone: InsightTone;
  metric?: string;
}

export interface BudgetSummary {
  totalSpent: number;
  income: number;
  budgetLimit: number;
  remainingBudget: number;
  freeCash: number;
  budgetUsedPercent: number;
}

export interface InsightsSnapshot {
  summary: BudgetSummary;
  totalMonthlySavingsRequired: number;
  savingsGap: number;
  goalsAtRisk: number;
  topCategory: { name: string; amount: number } | null;
  insights: Insight[];
}

export function summarizeBudget(
  plan: BudgetPlanLike,
  expenses: ExpenseLike[]
): BudgetSummary {
  const income = plan.monthlyIncome || 0;
  const budgetLimit = plan.monthlyBudgetLimit || 0;
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remainingBudget = Math.max(budgetLimit - totalSpent, 0);
  const freeCash = income - totalSpent;
  const budgetUsedPercent = budgetLimit > 0 ? Math.min((totalSpent / budgetLimit) * 100, 100) : 0;

  return {
    totalSpent,
    income,
    budgetLimit,
    remainingBudget,
    freeCash,
    budgetUsedPercent,
  };
}

export function buildInsights(
  goals: (GoalLike & { goalName?: string })[],
  plan: BudgetPlanLike,
  expenses: ExpenseLike[]
): InsightsSnapshot {
  const summary = summarizeBudget(plan, expenses);

  const totalMonthlySavingsRequired = goals.reduce((sum, goal) => {
    const p = computeProjection(goal);
    return sum + (p.isComplete ? 0 : p.monthlyRequired);
  }, 0);

  const goalsAtRisk = goals.filter((g) => {
    const p = computeProjection(g);
    return p.status === "at_risk" || p.status === "behind" || p.status === "overdue";
  }).length;

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + (e.amount || 0);
    return acc;
  }, {});

  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry
    ? { name: topCategoryEntry[0], amount: topCategoryEntry[1] }
    : null;

  const savingsGap = totalMonthlySavingsRequired - Math.max(summary.freeCash, 0);
  const insights: Insight[] = [];

  if (goals.length === 0) {
    insights.push({
      id: "no-goals",
      title: "Set your first goal",
      body: "Create a savings goal to see personalized funding insights alongside your budget.",
      tone: "neutral",
    });
  } else {
    insights.push({
      id: "savings-need",
      title: "Monthly savings required",
      body: `Across ${goals.length} goal${goals.length > 1 ? "s" : ""}, you need about ${formatCurrency(totalMonthlySavingsRequired)} per month to stay on schedule.`,
      tone: totalMonthlySavingsRequired > summary.income * 0.5 ? "warning" : "neutral",
      metric: formatCurrency(totalMonthlySavingsRequired),
    });
  }

  if (summary.income > 0 && totalMonthlySavingsRequired > 0) {
    const savingsRate = (totalMonthlySavingsRequired / summary.income) * 100;
    insights.push({
      id: "savings-rate",
      title: "Savings rate target",
      body: `Your goals imply a ${savingsRate.toFixed(0)}% savings rate on ${formatCurrency(summary.income)} monthly income.`,
      tone: savingsRate > 40 ? "warning" : "positive",
      metric: `${savingsRate.toFixed(0)}%`,
    });
  }

  if (savingsGap > 0) {
    insights.push({
      id: "savings-gap",
      title: "Savings shortfall",
      body: `After current spending, you're about ${formatCurrency(savingsGap)} short of what your goals need this month. Trim expenses or raise income.`,
      tone: "critical",
      metric: formatCurrency(savingsGap),
    });
  } else if (totalMonthlySavingsRequired > 0 && summary.freeCash > 0) {
    insights.push({
      id: "savings-surplus",
      title: "Room to save more",
      body: `You have roughly ${formatCurrency(summary.freeCash - totalMonthlySavingsRequired)} left after goal pacing and tracked spending.`,
      tone: "positive",
      metric: formatCurrency(summary.freeCash - totalMonthlySavingsRequired),
    });
  }

  if (summary.budgetLimit > 0 && summary.totalSpent > summary.budgetLimit) {
    insights.push({
      id: "over-budget",
      title: "Over spending limit",
      body: `You've exceeded your ${formatCurrency(summary.budgetLimit)} budget by ${formatCurrency(summary.totalSpent - summary.budgetLimit)}.`,
      tone: "critical",
    });
  } else if (summary.budgetUsedPercent >= 85 && summary.budgetLimit > 0) {
    insights.push({
      id: "near-limit",
      title: "Approaching budget cap",
      body: `${summary.budgetUsedPercent.toFixed(0)}% of your monthly spending limit is used.`,
      tone: "warning",
      metric: `${summary.budgetUsedPercent.toFixed(0)}%`,
    });
  }

  if (goalsAtRisk > 0) {
    insights.push({
      id: "goals-risk",
      title: "Goals need attention",
      body: `${goalsAtRisk} goal${goalsAtRisk > 1 ? "s are" : " is"} behind or at risk. Review projections and increase contributions.`,
      tone: "warning",
      metric: String(goalsAtRisk),
    });
  }

  if (topCategory && topCategory.amount > 0) {
    insights.push({
      id: "top-category",
      title: "Top spending category",
      body: `${topCategory.name} accounts for ${formatCurrency(topCategory.amount)} (${summary.totalSpent > 0 ? ((topCategory.amount / summary.totalSpent) * 100).toFixed(0) : 0}% of spending).`,
      tone: "neutral",
      metric: topCategory.name,
    });
  }

  if (expenses.length === 0 && summary.income > 0) {
    insights.push({
      id: "log-expenses",
      title: "Start logging expenses",
      body: "Add expenses in the Budget tab to unlock spending breakdowns and sharper recommendations.",
      tone: "neutral",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "setup",
      title: "Complete your profile",
      body: "Set monthly income and a spending limit in Budget, then add goals to unlock full insights.",
      tone: "neutral",
    });
  }

  return {
    summary,
    totalMonthlySavingsRequired,
    savingsGap,
    goalsAtRisk,
    topCategory,
    insights,
  };
}
