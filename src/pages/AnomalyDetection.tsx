import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AnomalyDetection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    material: "Steel Tower",
    data: [
      { date: "2024-01-01", quantity: "100" },
      { date: "2024-02-01", quantity: "105" },
      { date: "2024-03-01", quantity: "500" },
      { date: "2024-04-01", quantity: "110" },
      { date: "2024-05-01", quantity: "108" }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        material: formData.material,
        data: formData.data.map(d => ({ date: d.date, quantity: parseFloat(d.quantity) }))
      };
      const { data: fnData, error: fnError } = await supabase.functions.invoke('proxy', {
        body: { service: 'anomaly_detection', payload }
      });
      if (fnError) throw fnError;
      setResult(fnData);
      toast({ title: "Anomaly detection complete" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to detect anomalies", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Anomaly Detection</h1>
        <p className="text-lg text-muted-foreground">
          Identify unusual patterns in material usage and supply chain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Usage Data</CardTitle>
          <CardDescription>Enter historical material consumption data for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="material">Material Name</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label>Historical Data Points</Label>
              {formData.data.map((point, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={point.date}
                    onChange={(e) => {
                      const newData = [...formData.data];
                      newData[index].date = e.target.value;
                      setFormData({ ...formData, data: newData });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={point.quantity}
                    onChange={(e) => {
                      const newData = [...formData.data];
                      newData[index].quantity = e.target.value;
                      setFormData({ ...formData, data: newData });
                    }}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {loading ? "Detecting..." : "Detect Anomalies"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Detected Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.anomalies && result.anomalies.length > 0 ? (
                <div className="space-y-4">
                  {result.anomalies.map((anomaly: any, index: number) => (
                    <div key={index} className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold">
                            {typeof anomaly.date === "string" || typeof anomaly.date === "number"
                              ? anomaly.date
                              : JSON.stringify(anomaly.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-semibold">
                            {typeof anomaly.quantity === "string" || typeof anomaly.quantity === "number"
                              ? anomaly.quantity
                              : JSON.stringify(anomaly.quantity)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-semibold">
                            {typeof anomaly.confidence === "string" || typeof anomaly.confidence === "number"
                              ? anomaly.confidence + "%"
                              : JSON.stringify(anomaly.confidence)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No anomalies detected in the provided data.</p>
              )}
            </CardContent>
          </Card>

          {result.ai_insight && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Analysis & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-foreground">
                    {typeof result.ai_insight === "string"
                      ? result.ai_insight
                      : JSON.stringify(result.ai_insight, null, 2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AnomalyDetection;
