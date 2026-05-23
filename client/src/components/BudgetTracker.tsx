import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  PiggyBank,
  Receipt,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  addExpense,
  deleteExpense,
  EXPENSE_CATEGORIES,
  getBudgetPlan,
  getExpenses,
  updateBudgetPlan,
  type BudgetPlan,
  type Expense,
} from "../api/api";
import { summarizeBudget } from "../utils/insightsEngine";
import { formatCurrency } from "../utils/goalProjections";
import { formatMonthLabel, getCurrentMonth, shiftMonth, todayIso } from "../utils/monthUtils";

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "bg-violet-500",
  Food: "bg-amber-500",
  Transport: "bg-blue-500",
  Utilities: "bg-cyan-500",
  Health: "bg-rose-500",
  Entertainment: "bg-pink-500",
  Shopping: "bg-indigo-500",
  Education: "bg-emerald-500",
  Other: "bg-slate-500",
};

interface BudgetTrackerProps {
  onDataChange?: () => void;
}

function BudgetTracker({ onDataChange }: BudgetTrackerProps) {
  const [month, setMonth] = useState(getCurrentMonth);
  const [, setPlan] = useState<BudgetPlan | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [income, setIncome] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    category: "Food",
    amount: "",
    description: "",
    expenseDate: todayIso(),
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [planRes, expRes] = await Promise.all([getBudgetPlan(month), getExpenses(month)]);
      const p = planRes.data;
      setPlan(p);
      setIncome(String(p.monthlyIncome || ""));
      setBudgetLimit(String(p.monthlyBudgetLimit || ""));
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
    } catch {
      setPlan(null);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(
    () =>
      summarizeBudget(
        { monthlyIncome: Number(income) || 0, monthlyBudgetLimit: Number(budgetLimit) || 0 },
        expenses
      ),
    [income, budgetLimit, expenses]
  );

  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleSavePlan = async () => {
    setSavingPlan(true);
    try {
      const res = await updateBudgetPlan({
        month,
        monthlyIncome: Number(income) || 0,
        monthlyBudgetLimit: Number(budgetLimit) || 0,
      });
      setPlan(res.data);
      onDataChange?.();
    } catch {
      alert("Could not save budget plan.");
    } finally {
      setSavingPlan(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!amount || amount <= 0) return;
    try {
      await addExpense({
        category: expenseForm.category,
        amount,
        description: expenseForm.description.trim() || undefined,
        expenseDate: expenseForm.expenseDate,
      });
      setExpenseForm((f) => ({ ...f, amount: "", description: "" }));
      await load();
      onDataChange?.();
    } catch {
      alert("Could not add expense.");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpense(id);
      await load();
      onDataChange?.();
    } catch {
      alert("Could not delete expense.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-slate-500">Loading budget…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Budget tracker</h2>
          <p className="text-sm text-slate-500">Track income, spending limits, and expenses</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-slate-900">
            {formatMonthLabel(month)}
          </span>
          <button
            type="button"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-slate-500">Income</p>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(summary.income)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-slate-500">Spent</p>
            <TrendingDown className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(summary.totalSpent)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-slate-500">Budget left</p>
            <IndianRupee className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(summary.remainingBudget)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-slate-500">Free cash</p>
            <PiggyBank className="h-4 w-4 text-slate-400" />
          </div>
          <p
            className={`mt-2 text-xl font-bold ${summary.freeCash >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(summary.freeCash)}
          </p>
        </div>
      </div>

      {summary.budgetLimit > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Spending vs limit</span>
            <span className="font-semibold text-slate-900">
              {summary.budgetUsedPercent.toFixed(0)}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                summary.budgetUsedPercent > 100
                  ? "bg-red-500"
                  : summary.budgetUsedPercent > 85
                    ? "bg-amber-500"
                    : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(summary.budgetUsedPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Monthly plan</h3>
          <p className="mt-1 text-xs text-slate-500">Set income and spending cap for {formatMonthLabel(month)}</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Monthly income (₹)</label>
              <input
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Spending limit (₹)</label>
              <input
                type="number"
                min="0"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="button"
              onClick={handleSavePlan}
              disabled={savingPlan}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {savingPlan ? "Saving…" : "Save plan"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Add expense</h3>
          <form onSubmit={handleAddExpense} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Date</label>
              <input
                type="date"
                required
                value={expenseForm.expenseDate}
                onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Note (optional)</label>
              <input
                type="text"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                placeholder="e.g. Groceries"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg border border-blue-600 bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              Add expense
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Receipt className="h-4 w-4" />
            Expenses ({expenses.length})
          </h3>
          {expenses.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No expenses logged this month.</p>
          ) : (
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {[...expenses]
                .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))
                .map((exp) => (
                  <li
                    key={exp.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{exp.category}</p>
                      <p className="text-xs text-slate-500">
                        {exp.description || "—"} · {exp.expenseDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(exp.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Spending by category</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Add expenses to see breakdown.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {categoryBreakdown.map(([cat, amount]) => {
                const pct = summary.totalSpent > 0 ? (amount / summary.totalSpent) * 100 : 0;
                return (
                  <li key={cat}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-900">
                        {formatCurrency(amount)}{" "}
                        <span className="text-slate-400">({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Other}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetTracker;
