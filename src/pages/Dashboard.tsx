import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, ShoppingCart, DollarSign, AlertTriangle, Target, GitBranch, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const modules = [
    {
      title: "Demand Forecasting",
      description: "ML-powered forecasting for material requirements",
      icon: TrendingUp,
      path: "/demand-forecast",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Multi-Factor Forecast",
      description: "Budget, location & project-based forecasting",
      icon: GitBranch,
      path: "/multifactor-forecast",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Inventory Optimization",
      description: "Optimal stock levels & reorder predictions",
      icon: Package,
      path: "/inventory-optimization",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Procurement Recommendations",
      description: "Smart vendor selection & timing suggestions",
      icon: ShoppingCart,
      path: "/procurement",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Cost Optimization",
      description: "Predict trends & reduce procurement costs",
      icon: DollarSign,
      path: "/cost-optimization",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Anomaly Detection",
      description: "Identify unusual patterns in supply chain",
      icon: AlertTriangle,
      path: "/anomaly-detection",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Risk Analysis",
      description: "Predict delays & mitigation strategies",
      icon: Target,
      path: "/risk-analysis",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Scenario Planning",
      description: "What-if analysis for budget & project changes",
      icon: BarChart3,
      path: "/scenario-planning",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Supply Chain Intelligence</h1>
        <p className="text-lg text-muted-foreground">
          AI-powered demand forecasting and optimization for POWERGRID operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.path} to={module.path}>
              <Card className="hover:shadow-large transition-smooth cursor-pointer h-full border-border">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${module.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-gradient-hero border-0 text-primary-foreground shadow-large">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to AI Supply Chain Planning</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base">
            Leverage advanced machine learning models to optimize your supply chain operations. 
            Each module provides real-time insights and actionable recommendations for material planning, 
            cost optimization, and risk mitigation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Real-Time Forecasting</h3>
              <p className="text-sm text-primary-foreground/80">
                Get accurate demand predictions using time series analysis and deep learning
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Cost Savings</h3>
              <p className="text-sm text-primary-foreground/80">
                Optimize procurement strategies and reduce inventory costs
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Risk Mitigation</h3>
              <p className="text-sm text-primary-foreground/80">
                Identify potential delays and supply chain disruptions early
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
