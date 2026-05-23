import { ChevronDown, Target } from "lucide-react";
import { formatCurrency } from "../utils/goalProjections";

export interface GoalOption {
  id: number;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
}

interface GoalSelectorProps {
  goals: GoalOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function GoalSelector({ goals, selectedId, onSelect }: GoalSelectorProps) {
  const selected = goals.find((g) => g.id === selectedId) ?? goals[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label htmlFor="goal-select" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Target className="h-3.5 w-3.5" aria-hidden />
        Active goal
      </label>
      <div className="relative mt-2">
        <select
          id="goal-select"
          value={selected?.id ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
        >
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.goalName} — {formatCurrency(goal.savedAmount || 0)} / {formatCurrency(goal.targetAmount)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      {selected && (
        <p className="mt-2 text-xs text-slate-500">
          Switch goals to update projections and insights for each target.
        </p>
      )}
    </div>
  );
}

export default GoalSelector;
