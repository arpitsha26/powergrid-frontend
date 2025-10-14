import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const MultifactorForecast = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    budget: 25000000,
    project_location: "Maharashtra",
    tower_type: "400kV Transmission Tower",
    substation_type: "Gas Insulated Substation",
    project_timeline_months: 12,
    materials: ["Steel", "Cement", "Copper", "Insulators"],
  });

  const renderSafe = (value: any) =>
    typeof value === "string" || typeof value === "number"
      ? value
      : JSON.stringify(value, null, 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('proxy', {
        body: { service: 'multifactor_forecast', payload: formData }
      });
      if (fnError) throw fnError;
      setResult(fnData);
      
      toast({
        title: "Multi-Factor Forecast Complete",
        description: "Material demand forecast has been generated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate forecast. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      High: "default",
      Medium: "secondary",
      Low: "destructive",
    };
    return <Badge variant={variants[confidence] || "secondary"}>{confidence}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <GitBranch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Multi-Factor Forecasting</h1>
          <p className="text-muted-foreground">Comprehensive demand analysis with multiple input factors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Forecast Parameters</CardTitle>
            <CardDescription>Project details for comprehensive material demand analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Project Location</Label>
                <Input
                  id="location"
                  value={formData.project_location}
                  onChange={(e) => setFormData({ ...formData, project_location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tower">Tower Type</Label>
                <Input
                  id="tower"
                  value={formData.tower_type}
                  onChange={(e) => setFormData({ ...formData, tower_type: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="substation">Substation Type</Label>
                <Input
                  id="substation"
                  value={formData.substation_type}
                  onChange={(e) => setFormData({ ...formData, substation_type: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Project Timeline (Months)</Label>
                <Input
                  id="timeline"
                  type="number"
                  value={formData.project_timeline_months}
                  onChange={(e) => setFormData({ ...formData, project_timeline_months: Number(e.target.value) })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  "Generate Multi-Factor Forecast"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forecast Summary</CardTitle>
                <CardDescription>{renderSafe(result.forecast?.forecast_summary)}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Material Demand Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.forecast?.materials_forecast?.map((material: any, index: number) => (
                  <div key={index} className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{renderSafe(material.material)}</h3>
                      {getConfidenceBadge(String(renderSafe(material.confidence)))}
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {renderSafe(material.estimated_quantity_tons)} tons
                    </p>
                    <p className="text-sm text-muted-foreground">{renderSafe(material.reasoning)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {result.forecast?.optimization_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {result.forecast.optimization_notes.map((note: any, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">{renderSafe(note)}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultifactorForecast;
