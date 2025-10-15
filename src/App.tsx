import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DemandForecast from "./pages/DemandForecast";
import MultifactorForecast from "./pages/MultifactorForecast";
import InventoryOptimization from "./pages/InventoryOptimization";
import ProcurementRecommendation from "./pages/ProcurementRecommendation";
import ScenarioPlanning from "./pages/ScenarioPlanning";
import CostOptimization from "./pages/CostOptimization";
import AnomalyDetection from "./pages/AnomalyDetection";
import RiskAnalysis from "./pages/RiskAnalysis";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
  {/* Auth routes without layout */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* Main app routes inside layout */}
  <Route
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="/" element={<Dashboard />} />
    <Route path="/demand-forecast" element={<DemandForecast />} />
    <Route path="/multifactor-forecast" element={<MultifactorForecast />} />
    <Route path="/inventory-optimization" element={<InventoryOptimization />} />
    <Route path="/procurement" element={<ProcurementRecommendation />} />
    <Route path="/scenario-planning" element={<ScenarioPlanning />} />
    <Route path="/cost-optimization" element={<CostOptimization />} />
    <Route path="/anomaly-detection" element={<AnomalyDetection />} />
    <Route path="/risk-analysis" element={<RiskAnalysis />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
