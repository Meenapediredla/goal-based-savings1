"use client";

export default function Dashboard() {
  const goals = [
    {
      id: 1,
      title: "New Car Fund",
      targetAmount: 500000,
      savedAmount: 250000,
    },
    {
      id: 2,
      title: "Europe Trip",
      targetAmount: 200000,
      savedAmount: 80000,
    },
    {
      id: 3,
      title: "Laptop Upgrade",
      targetAmount: 80000,
      savedAmount: 80000,
    },
  ];

  const totalSavings = goals.reduce(
    (sum, goal) => sum + goal.savedAmount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <ul className="mt-6 space-y-4">
          <li className="text-slate-300 hover:text-white cursor-pointer">
            Home
          </li>

          <li className="text-slate-300 hover:text-white cursor-pointer">
            Goals
          </li>

          <li className="text-slate-300 hover:text-white cursor-pointer">
            Savings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-4">
          My Savings Dashboard
        </h1>

        <p className="text-lg text-slate-300 mb-8">
          Total Savings:
          <span className="text-indigo-400 font-bold ml-2">
            ₹{totalSavings.toLocaleString()}
          </span>
        </p>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress =
              (goal.savedAmount / goal.targetAmount) * 100;

            return (
              <div
                key={goal.id}
                className="bg-slate-800 p-6 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {goal.title}
                </h2>

                <p className="mb-2">
                  Saved: ₹{goal.savedAmount.toLocaleString()}
                </p>

                <p className="mb-4">
                  Target: ₹{goal.targetAmount.toLocaleString()}
                </p>

                <div className="w-full bg-slate-700 h-3 rounded-full">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {progress.toFixed(0)}% completed
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}