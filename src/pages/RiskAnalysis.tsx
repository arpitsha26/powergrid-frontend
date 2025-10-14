import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// --- Safe render helper ---
function renderSafe(value: any): React.ReactNode {
  if (typeof value === "string" || typeof value === "number") return value;
  if (value === null || value === undefined) return "-";
  try {
    return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  } catch {
    return "-";
  }
}

const RiskAnalysis = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    project_name: "North Grid Expansion",
    location: "Lucknow",
    budget: "750000",
    supplier_reliability: "0.55",
    material_type: "Steel Tower",
    expected_delivery_days: "45",
    project_deadline_days: "30",
    external_factors: ["tax hike", "bad weather"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        project_name: formData.project_name,
        location: formData.location,
        budget: parseFloat(formData.budget),
        supplier_reliability: parseFloat(formData.supplier_reliability),
        material_type: formData.material_type,
        expected_delivery_days: parseInt(formData.expected_delivery_days),
        project_deadline_days: parseInt(formData.project_deadline_days),
        external_factors: formData.external_factors,
      };
      const { data: fnData, error: fnError } = await supabase.functions.invoke("proxy", {
        body: { service: "risk_analysis", payload },
      });
      if (fnError) throw fnError;
      setResult(fnData);
      toast({ title: "Risk analysis complete" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to analyze risk", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Risk Analysis</h1>
        <p className="text-lg text-muted-foreground">
          Predict delays and identify mitigation strategies for supply chain risks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Risk Parameters</CardTitle>
          <CardDescription>Configure project details for comprehensive risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material_type">Material Type</Label>
                <Input
                  id="material_type"
                  value={formData.material_type}
                  onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier_reliability">Supplier Reliability (0-1)</Label>
                <Input
                  id="supplier_reliability"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.supplier_reliability}
                  onChange={(e) => setFormData({ ...formData, supplier_reliability: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_delivery_days">Expected Delivery (Days)</Label>
                <Input
                  id="expected_delivery_days"
                  type="number"
                  value={formData.expected_delivery_days}
                  onChange={(e) => setFormData({ ...formData, expected_delivery_days: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_deadline_days">Project Deadline (Days)</Label>
                <Input
                  id="project_deadline_days"
                  type="number"
                  value={formData.project_deadline_days}
                  onChange={(e) => setFormData({ ...formData, project_deadline_days: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Target className="mr-2 h-4 w-4" />
              {loading ? "Analyzing..." : "Analyze Risk"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive">
                  {renderSafe(result.risk_score)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {result.risk_score > 70
                    ? "High Risk"
                    : result.risk_score > 40
                    ? "Medium Risk"
                    : "Low Risk"}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Project Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Project:</span> {renderSafe(result.project)}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {renderSafe(result.location)}
                  </p>
                  <p>
                    <span className="font-semibold">External Factors:</span>{" "}
                    <pre className="whitespace-pre-wrap">{renderSafe(result.external_factors)}</pre>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {result.real_time_context && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Real-Time Market Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap">{renderSafe(result.real_time_context)}</pre>
              </CardContent>
            </Card>
          )}

          {result.ai_mitigation_recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  AI-Powered Mitigation Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap">{renderSafe(result.ai_mitigation_recommendations)}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskAnalysis;
