import { BarChart3, Lightbulb, Target } from "lucide-react";

export type DashboardTab = "goals" | "budget" | "insights";

interface DashboardTabsProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const tabs: { id: DashboardTab; label: string; icon: typeof Target }[] = [
  { id: "goals", label: "Goals", icon: Target },
  { id: "budget", label: "Budget", icon: BarChart3 },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

function DashboardTabs({ active, onChange }: DashboardTabsProps) {
  return (
    <nav className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            active === id
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default DashboardTabs;
