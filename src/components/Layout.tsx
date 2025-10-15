import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Target,
  GitBranch,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/demand-forecast", label: "Demand Forecast", icon: TrendingUp },
  { path: "/multifactor-forecast", label: "Multi-Factor", icon: GitBranch },
  { path: "/inventory-optimization", label: "Inventory", icon: Package },
  { path: "/procurement", label: "Procurement", icon: ShoppingCart },
  { path: "/cost-optimization", label: "Cost Optimization", icon: DollarSign },
  { path: "/anomaly-detection", label: "Anomaly Detection", icon: AlertTriangle },
  { path: "/risk-analysis", label: "Risk Analysis", icon: Target },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check token from localStorage
    setToken(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">POWERGRID</h1>
              <p className="text-xs text-muted-foreground">AI Supply Chain Planning</p>
            </div>
          </div>

          {/* Auth Button */}
          <div>
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
