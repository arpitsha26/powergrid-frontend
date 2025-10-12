import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProcurementRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    material_name: "Steel Tower Bolts",
    quantity: 5000,
    location: "Maharashtra",
    budget: 2500000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://procurement-recommendation.onrender.com/recommend-procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Recommendation failed");

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Recommendations Generated",
        description: "Procurement recommendations are ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Procurement Recommendations</h1>
          <p className="text-muted-foreground">AI-powered vendor selection and procurement timing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Procurement Request</CardTitle>
            <CardDescription>Enter material requirements for recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material Name</Label>
                <Input
                  id="material"
                  value={formData.material_name}
                  onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Required</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
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
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendation</CardTitle>
                <CardDescription>
                  {result.material} in {result.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {result.recommendation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.top_suppliers && result.top_suppliers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Suppliers</CardTitle>
                  <CardDescription>Recommended vendors based on market research</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.top_suppliers.map((supplier: any, index: number) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{supplier.title}</h3>
                        <a
                          href={supplier.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">{supplier.snippet}</p>
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

export default ProcurementRecommendation;
