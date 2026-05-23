import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Plus } from "lucide-react";
import {
  getAllGoals,
  deleteGoal,
  getBudgetPlan,
  getExpenses,
  type BudgetPlan,
  type Expense,
} from "../api/api";
import GoalSelector from "../components/GoalSelector";
import ProjectionDashboard from "../components/ProjectionDashboard";
import GoalOverviewCard from "../components/GoalOverviewCard";
import DashboardTabs, { type DashboardTab } from "../components/DashboardTabs";
import BudgetTracker from "../components/BudgetTracker";
import InsightsPanel from "../components/InsightsPanel";
import { getCurrentMonth } from "../utils/monthUtils";

interface Goal {
  id: number;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  email: string;
}

function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("goals");
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllGoals();
      const data = res.data;
      const list = Array.isArray(data) ? data : [];
      setGoals(list);
      setSelectedGoalId((prev) => {
        if (list.length === 0) return null;
        if (prev && list.some((g: Goal) => g.id === prev)) return prev;
        return list[0].id;
      });
    } catch {
      setGoals([]);
      setSelectedGoalId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgetSnapshot = useCallback(async () => {
    const month = getCurrentMonth();
    try {
      const [planRes, expRes] = await Promise.all([getBudgetPlan(month), getExpenses(month)]);
      setBudgetPlan(planRes.data);
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
    } catch {
      setBudgetPlan(null);
      setExpenses([]);
    }
  }, []);

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId) ?? null,
    [goals, selectedGoalId]
  );

  useEffect(() => {
    const userName = localStorage.getItem("name");
    setName(userName && userName !== "undefined" ? userName : "User");
    fetchGoals();
    fetchBudgetSnapshot();
  }, [fetchGoals, fetchBudgetSnapshot, location.key]);

  useEffect(() => {
    const state = location.state as { goalCreated?: boolean } | null;
    if (state?.goalCreated) {
      setSuccessMessage("Goal created successfully.");
      navigate(location.pathname, { replace: true, state: {} });
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(id);
      await fetchGoals();
    } catch {
      alert("Delete failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleBudgetChange = () => {
    fetchBudgetSnapshot();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">GoalTracker</h1>
              <p className="text-xs text-slate-500">Welcome back, {name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/addgoal")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New goal</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        )}

        <div className="mb-8">
          <DashboardTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {loading && activeTab === "goals" ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading your goals…</p>
          </div>
        ) : activeTab === "budget" ? (
          <BudgetTracker onDataChange={handleBudgetChange} />
        ) : activeTab === "insights" ? (
          <InsightsPanel goals={goals} plan={budgetPlan} expenses={expenses} />
        ) : goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              🎯
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">No goals yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Create your first savings goal to unlock projections and personalized insights.
            </p>
            <button
              type="button"
              onClick={() => navigate("/addgoal")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create first goal
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
              <GoalSelector
                goals={goals}
                selectedId={selectedGoalId}
                onSelect={setSelectedGoalId}
              />
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  All goals
                </h2>
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <GoalOverviewCard
                      key={goal.id}
                      goal={goal}
                      isSelected={goal.id === selectedGoalId}
                      onSelect={() => setSelectedGoalId(goal.id)}
                      onDelete={() => handleDelete(goal.id)}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-8 xl:col-span-9">
              {selectedGoal ? (
                <ProjectionDashboard key={selectedGoal.id} goal={selectedGoal} />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                  Select a goal to view projections.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
