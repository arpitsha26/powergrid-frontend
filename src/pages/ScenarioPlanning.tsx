import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScenarioPlanning = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    budget: 25000000,
    project_location: "Maharashtra",
    tower_type: "765kV Transmission Tower",
    substation_type: "765kV GIS Substation",
    geography: "Hilly",
    taxes: 18,
    scenario: "Budget reduced by 15% and copper prices rising globally due to demand surge",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://scenario-planning.onrender.com/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Scenario planning failed");

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Scenario Analysis Complete",
        description: "What-if analysis has been generated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze scenario. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scenario Planning</h1>
          <p className="text-muted-foreground">What-if analysis for budget and project changes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Parameters</CardTitle>
            <CardDescription>Define project baseline and what-if scenario</CardDescription>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="geography">Geography</Label>
                  <Input
                    id="geography"
                    value={formData.geography}
                    onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxes">Tax Rate (%)</Label>
                  <Input
                    id="taxes"
                    type="number"
                    value={formData.taxes}
                    onChange={(e) => setFormData({ ...formData, taxes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario">What-If Scenario</Label>
                <Textarea
                  id="scenario"
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="e.g., Budget reduced by 15% and copper prices rising"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Scenario...
                  </>
                ) : (
                  "Analyze Scenario"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Summary</CardTitle>
                <CardDescription>{result.scenario_summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Adjusted Budget</p>
                    <p className="text-xl font-bold">₹{result.project_details?.budget?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <p className="text-xl font-bold capitalize">{result.risk_assessment?.risk_level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.market_snapshot && (
              <Card>
                <CardHeader>
                  <CardTitle>Market Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(result.market_snapshot).map(([material, data]: [string, any]) => (
                    <div key={material} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold capitalize">{material}</h3>
                        <span className={`text-sm font-medium ${data.price_change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {data.price_change > 0 ? '+' : ''}{data.price_change}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium">₹{data.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Demand</p>
                          <p className="font-medium capitalize">{data.demand}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Procurement</p>
                          <p className="font-medium capitalize">{data.procurement_needs}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.material_breakdown && (
              <Card>
                <CardHeader>
                  <CardTitle>Material Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(result.material_breakdown).map(([material, data]: [string, any]) => (
                    <div key={material} className="p-3 bg-muted rounded-lg">
                      <h3 className="font-semibold capitalize mb-2">{material}</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Quantity</p>
                          <p className="font-medium">{data.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Unit Price</p>
                          <p className="font-medium">₹{data.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Total Cost</p>
                          <p className="font-medium">₹{(data.total_cost / 1000000).toFixed(2)}M</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioPlanning;
