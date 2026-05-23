import { TrendingUp, Target } from "lucide-react";

export interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  savedAmount: number;
}

const GoalCard = ({ goal }: { goal: Goal }) => {
  const percentage = Math.round((goal.savedAmount / goal.targetAmount) * 100);
  const isCompleted = percentage >= 100;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
            COMPLETED
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
          <Target className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {percentage}%
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">
        {goal.title}
      </h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-300 font-medium">
            ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-green-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <TrendingUp className="w-4 h-4" />
        <span>₹{(goal.targetAmount - goal.savedAmount).toLocaleString()} remaining</span>
      </div>
    </div>
  );
};

export default GoalCard;