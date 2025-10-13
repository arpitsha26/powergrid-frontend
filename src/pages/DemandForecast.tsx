import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DemandForecast = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    material: "Steel",
    project_location: "Uttar Pradesh",
    tower_type: "Type D",
    substation_type: "Air Insulated",
    tax_rate: 18,
    budget: 15000000,
    months_ahead: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('proxy', {
        body: { service: 'demand_forecast', payload: formData }
      });
      if (fnError) throw fnError;
      setResult(fnData);
      
      toast({
        title: "Forecast Generated",
        description: "Demand forecast has been successfully generated.",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Demand Forecasting Engine</h1>
          <p className="text-muted-foreground">AI-powered material requirement predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Forecast Parameters</CardTitle>
            <CardDescription>Enter project details to generate demand forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material Type</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) => setFormData({ ...formData, material: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Steel">Steel</SelectItem>
                    <SelectItem value="Copper">Copper</SelectItem>
                    <SelectItem value="Cement">Cement</SelectItem>
                    <SelectItem value="Insulators">Insulators</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="months">Months Ahead</Label>
                  <Input
                    id="months"
                    type="number"
                    value={formData.months_ahead}
                    onChange={(e) => setFormData({ ...formData, months_ahead: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  "Generate Forecast"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Forecast Results</CardTitle>
              <CardDescription>{result.insight}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {result.forecast_data?.map((forecast: any, index: number) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(forecast.ds).toLocaleDateString()}
                      </span>
                      <span className={`text-lg font-bold ${forecast.yhat_adjusted >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {forecast.yhat_adjusted.toFixed(2)} tons
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lower: {forecast.yhat_lower.toFixed(2)}</span>
                      <span>Upper: {forecast.yhat_upper.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Source: {result.source}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DemandForecast;
