import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Material {
  name: string;
  current_stock: number;
  avg_monthly_consumption: number;
  forecast_demand_next_month: number;
  lead_time_days: number;
  cost_per_unit: number;
  criticality?: string;
}

const InventoryOptimization = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const [scenario, setScenario] = useState("demand +20%");
  const [materials, setMaterials] = useState<Material[]>([
    {
      name: "Steel Tower Sections",
      current_stock: 500,
      avg_monthly_consumption: 450,
      forecast_demand_next_month: 600,
      lead_time_days: 15,
      cost_per_unit: 15000,
      criticality: "high",
    },
  ]);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        name: "",
        current_stock: 0,
        avg_monthly_consumption: 0,
        forecast_demand_next_month: 0,
        lead_time_days: 0,
        cost_per_unit: 0,
      },
    ]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://inventory-optimization-s9dq.onrender.com/optimize_inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materials,
          simulation_scenario: scenario,
        }),
      });

      if (!response.ok) throw new Error("Optimization failed");

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Optimization Complete",
        description: "Inventory levels have been optimized.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimize inventory. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Optimization</h1>
          <p className="text-muted-foreground">Predict optimal stock levels and reorder points</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials & Parameters</CardTitle>
          <CardDescription>Add materials and configure simulation scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Simulation Scenario</Label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand +20%">Demand +20%</SelectItem>
                  <SelectItem value="demand -20%">Demand -20%</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Materials</h3>
                <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>

              {materials.map((material, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex justify-between items-start">
                        <Label>Material {index + 1}</Label>
                        {materials.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMaterial(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <Input
                          placeholder="Material Name"
                          value={material.name}
                          onChange={(e) => updateMaterial(index, "name", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Current Stock</Label>
                        <Input
                          type="number"
                          value={material.current_stock}
                          onChange={(e) => updateMaterial(index, "current_stock", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Avg Monthly Consumption</Label>
                        <Input
                          type="number"
                          value={material.avg_monthly_consumption}
                          onChange={(e) => updateMaterial(index, "avg_monthly_consumption", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Forecast Demand</Label>
                        <Input
                          type="number"
                          value={material.forecast_demand_next_month}
                          onChange={(e) => updateMaterial(index, "forecast_demand_next_month", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Lead Time (Days)</Label>
                        <Input
                          type="number"
                          value={material.lead_time_days}
                          onChange={(e) => updateMaterial(index, "lead_time_days", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Cost per Unit (₹)</Label>
                        <Input
                          type="number"
                          value={material.cost_per_unit}
                          onChange={(e) => updateMaterial(index, "cost_per_unit", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Criticality</Label>
                        <Select
                          value={material.criticality || "medium"}
                          onValueChange={(value) => updateMaterial(index, "criticality", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                "Optimize Inventory"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>Scenario: {result.scenario}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.optimized_inventory?.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Reorder Point</p>
                    <p className="text-xl font-bold text-primary">{item.recommended_reorder_point}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Optimal Stock</p>
                    <p className="text-xl font-bold text-secondary">{item.optimal_stock_level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Safety Stock</p>
                    <p className="text-xl font-bold text-success">{item.safety_stock}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground border-t border-border pt-3">
                  {item.comment}
                </p>
                
                {item.price_trend_info && (
                  <div className="bg-background p-3 rounded text-xs">
                    <p className="font-medium mb-1">Market Insight:</p>
                    <p className="text-muted-foreground">{item.price_trend_info}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryOptimization;
