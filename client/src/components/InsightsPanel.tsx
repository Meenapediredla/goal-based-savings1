import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { buildInsights, type InsightTone } from "../utils/insightsEngine";
import { formatCurrency } from "../utils/goalProjections";
import type { BudgetPlan, Expense } from "../api/api";

interface GoalForInsights {
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

interface InsightsPanelProps {
  goals: GoalForInsights[];
  plan: BudgetPlan | null;
  expenses: Expense[];
}

const toneStyles: Record<InsightTone, { card: string; icon: string; Icon: typeof Lightbulb }> = {
  positive: {
    card: "border-emerald-200 bg-emerald-50/80",
    icon: "text-emerald-600",
    Icon: CheckCircle2,
  },
  neutral: {
    card: "border-slate-200 bg-white",
    icon: "text-blue-600",
    Icon: Lightbulb,
  },
  warning: {
    card: "border-amber-200 bg-amber-50/80",
    icon: "text-amber-600",
    Icon: AlertTriangle,
  },
  critical: {
    card: "border-red-200 bg-red-50/80",
    icon: "text-red-600",
    Icon: AlertTriangle,
  },
};

function InsightsPanel({ goals, plan, expenses }: InsightsPanelProps) {
  const snapshot = useMemo(
    () =>
      buildInsights(
        goals,
        {
          monthlyIncome: plan?.monthlyIncome || 0,
          monthlyBudgetLimit: plan?.monthlyBudgetLimit || 0,
        },
        expenses
      ),
    [goals, plan, expenses]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Insights</h2>
        <p className="text-sm text-slate-500">
          Smart recommendations from your goals and budget activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
            <Target className="h-3.5 w-3.5" />
            Goals at risk
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{snapshot.goalsAtRisk}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
            <TrendingUp className="h-3.5 w-3.5" />
            Savings needed / mo
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(snapshot.totalMonthlySavingsRequired)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
            <Wallet className="h-3.5 w-3.5" />
            Free cash
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              snapshot.summary.freeCash >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {formatCurrency(snapshot.summary.freeCash)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
            Savings gap
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              snapshot.savingsGap > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {snapshot.savingsGap > 0
              ? formatCurrency(snapshot.savingsGap)
              : "On track"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {snapshot.insights.map((insight) => {
          const style = toneStyles[insight.tone];
          const Icon = style.Icon;
          return (
            <article
              key={insight.id}
              className={`rounded-xl border p-5 shadow-sm ${style.card}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg bg-white/80 p-2 ${style.icon}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                    {insight.metric && (
                      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.body}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default InsightsPanel;
