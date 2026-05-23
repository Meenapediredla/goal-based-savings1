import type { KeyboardEvent } from "react";
import { Trash2 } from "lucide-react";
import { computeProjection, formatCurrency } from "../utils/goalProjections";

export interface GoalOverview {
  id: number;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

interface GoalOverviewCardProps {
  goal: GoalOverview;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function GoalOverviewCard({ goal, isSelected, onSelect, onDelete }: GoalOverviewCardProps) {
  const projection = computeProjection(goal);
  const progress = projection.progressPercent;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`w-full cursor-pointer rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/30"
          : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{goal.goalName}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatCurrency(goal.savedAmount || 0)} of {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${goal.goalName}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{progress.toFixed(0)}% complete</span>
        <span>{projection.daysRemaining >= 0 ? `${projection.daysRemaining}d left` : "Overdue"}</span>
      </div>
    </div>
  );
}

export default GoalOverviewCard;
