import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGoal } from "../api/api";

function AddGoal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    targetAmount: 0,
    savedAmount: 0,
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newGoal.goalName.trim()) {
      setError("Please enter a goal name.");
      return;
    }
    if (newGoal.targetAmount <= 0) {
      setError("Target amount must be greater than zero.");
      return;
    }
    if (!newGoal.deadline) {
      setError("Please select a deadline.");
      return;
    }

    setLoading(true);
    try {
      await createGoal({
        goalName: newGoal.goalName.trim(),
        targetAmount: newGoal.targetAmount,
        savedAmount: newGoal.savedAmount || 0,
        deadline: newGoal.deadline,
      });
      navigate("/dashboard", { replace: true, state: { goalCreated: true } });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not save goal. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="text-xl">←</span> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Goal
            </h2>
            <p className="text-gray-600 mt-2">Set your savings target and start tracking</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Goal Name
              </label>
              <input
                type="text"
                value={newGoal.goalName}
                onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
                required
                placeholder="e.g., New Bike, Emergency Fund"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={newGoal.targetAmount || ""}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })
                  }
                  required
                  min="1"
                  placeholder="50000"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Savings <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={newGoal.savedAmount || ""}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, savedAmount: Number(e.target.value) })
                  }
                  min="0"
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Deadline
              </label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddGoal;
