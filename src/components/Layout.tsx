import { Link, useLocation, Outlet } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Replace this with a tower icon or SVG */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">POWERGRID</h1>
                <p className="text-xs text-muted-foreground">AI Supply Chain Planning</p>
              </div>
            </div>
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
          {/* 🔥 This is where nested route pages render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
