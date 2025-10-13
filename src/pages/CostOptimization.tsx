import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DollarSign, TrendingDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CostOptimization = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    budget: "10000000",
    tax_rate: "0.18",
    time_horizon_months: "6",
    materials: [
      { name: "steel", current_price_per_unit: "65000", forecasted_demand_units: "200" },
      { name: "copper", current_price_per_unit: "850000", forecasted_demand_units: "50" }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        budget: parseFloat(formData.budget),
        tax_rate: parseFloat(formData.tax_rate),
        time_horizon_months: parseInt(formData.time_horizon_months),
        materials: formData.materials.map(m => ({
          name: m.name,
          current_price_per_unit: parseFloat(m.current_price_per_unit),
          forecasted_demand_units: parseInt(m.forecasted_demand_units)
        }))
      };
      const { data: fnData, error: fnError } = await supabase.functions.invoke('proxy', {
        body: { service: 'cost_optimization', payload }
      });
      if (fnError) throw fnError;
      setResult(fnData);
      toast({ title: "Cost optimization analysis complete" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch cost optimization data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Cost Optimization</h1>
        <p className="text-lg text-muted-foreground">
          Predict procurement cost trends and optimize spending strategies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Parameters</CardTitle>
          <CardDescription>Configure budget and material details for cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="tax_rate">Tax Rate</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_horizon">Time Horizon (Months)</Label>
                <Input
                  id="time_horizon"
                  type="number"
                  value={formData.time_horizon_months}
                  onChange={(e) => setFormData({ ...formData, time_horizon_months: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <DollarSign className="mr-2 h-4 w-4" />
              {loading ? "Analyzing..." : "Optimize Costs"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.trend_analysis || {}).map(([material, data]: [string, any]) => (
                <div key={material} className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold capitalize mb-2">{material}</h3>
                  <div className="space-y-1 text-sm">
                    <p>Forecasted Price: ₹{data.forecasted_price_per_unit?.toFixed(2)}</p>
                    <p className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Trend: {data.trend_direction}
                    </p>
                    <p className="text-muted-foreground">{data.trend_comment}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procurement Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.strategy || {}).map(([material, strategy]) => (
                <div key={material} className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold capitalize mb-2">{material}</h3>
                  <p className="text-sm">{strategy as string}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Summary & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Savings Potential</p>
                  <p className="text-2xl font-bold">₹{result.summary?.savings_potential?.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                  <p className="text-2xl font-bold capitalize">{result.summary?.risk_level}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg md:col-span-1">
                  <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-sm">{result.summary?.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CostOptimization;
