import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/demand-forecast" element={<DemandForecast />} />
            <Route path="/multifactor-forecast" element={<MultifactorForecast />} />
            <Route path="/inventory-optimization" element={<InventoryOptimization />} />
            <Route path="/procurement" element={<ProcurementRecommendation />} />
            <Route path="/scenario-planning" element={<ScenarioPlanning />} />
            <Route path="/cost-optimization" element={<CostOptimization />} />
            <Route path="/anomaly-detection" element={<AnomalyDetection />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
