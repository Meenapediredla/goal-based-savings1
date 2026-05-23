import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Target, Settings, Wallet } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 min-h-screen bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          GoalTracker
        </h1>
      </div>
      
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;