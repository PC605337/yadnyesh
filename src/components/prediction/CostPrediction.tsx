import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, IndianRupee, Clock, Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CostPrediction {
  id: string;
  condition_or_service: string;
  prediction_type: string;
  predicted_cost: number;
  out_of_pocket_cost: number;
  insurance_coverage: number;
  confidence_level: number;
  timeline_months: number;
  cost_breakdown: any;
  recommendations: string[];
  created_at: string;
}

export const CostPrediction = () => {
  const [predictions, setPredictions] = useState<CostPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPrediction, setNewPrediction] = useState({
    condition: "",
    type: "",
    timeline: ""
  });
  const { toast } = useToast();

  const predictionTypes = [
    { value: "chronic_illness", label: "Chronic Illness Management" },
    { value: "maternal_care", label: "Maternal Care" },
    { value: "fertility_treatment", label: "Fertility Treatment" },
    { value: "pediatric_care", label: "Pediatric Care" },
    { value: "surgery", label: "Surgical Procedure" },
    { value: "preventive_care", label: "Preventive Care" }
  ];

  const commonConditions = {
    chronic_illness: ["Diabetes Type 2", "Hypertension", "Heart Disease", "Asthma", "Arthritis"],
    maternal_care: ["Normal Delivery", "C-Section", "Prenatal Care", "Postnatal Care", "High-Risk Pregnancy"],
    fertility_treatment: ["IVF Cycle", "IUI Treatment", "Fertility Assessment", "Egg Freezing", "Sperm Analysis"],
    pediatric_care: ["Vaccination Schedule", "Growth Monitoring", "Newborn Care", "Pediatric Surgery", "Special Needs Care"],
    surgery: ["Appendectomy", "Cataract Surgery", "Knee Replacement", "Cardiac Surgery", "Gallbladder Surgery"],
    preventive_care: ["Annual Health Checkup", "Cancer Screening", "Dental Checkup", "Eye Examination", "Vaccination"]
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('cost_predictions')
        .select('*')
        .eq('patient_id', 'current_user_id') // Replace with actual auth.uid()
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions((data as any) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cost predictions",
        variant: "destructive",
      });
    }
  };

  const generatePrediction = async () => {
    if (!newPrediction.condition || !newPrediction.type) {
      toast({
        title: "Error",
        description: "Please select condition and type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock cost calculation based on condition and type
      const mockPrediction = generateMockPrediction(newPrediction);

      const { error } = await supabase
        .from('cost_predictions')
        .insert({
          patient_id: 'current_user_id', // Replace with actual auth.uid()
          condition_or_service: newPrediction.condition,
          prediction_type: newPrediction.type,
          predicted_cost: mockPrediction.totalCost,
          out_of_pocket_cost: mockPrediction.outOfPocketCost,
          insurance_coverage: mockPrediction.insuranceCoverage,
          confidence_level: mockPrediction.confidenceLevel,
          timeline_months: parseInt(newPrediction.timeline) || 12,
          cost_breakdown: mockPrediction.breakdown,
          recommendations: mockPrediction.recommendations
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cost prediction generated successfully!",
      });

      setNewPrediction({ condition: "", type: "", timeline: "" });
      fetchPredictions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prediction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockPrediction = (input: any) => {
    // Mock cost calculation logic
    const baseCosts = {
      chronic_illness: { min: 50000, max: 200000 },
      maternal_care: { min: 80000, max: 300000 },
      fertility_treatment: { min: 150000, max: 500000 },
      pediatric_care: { min: 30000, max: 150000 },
      surgery: { min: 100000, max: 800000 },
      preventive_care: { min: 5000, max: 50000 }
    };

    const typeRange = baseCosts[input.type] || { min: 50000, max: 200000 };
    const totalCost = Math.floor(Math.random() * (typeRange.max - typeRange.min) + typeRange.min);
    const insuranceCoverage = Math.floor(totalCost * (0.6 + Math.random() * 0.3));
    const outOfPocketCost = totalCost - insuranceCoverage;

    return {
      totalCost,
      outOfPocketCost,
      insuranceCoverage,
      confidenceLevel: 0.75 + Math.random() * 0.2,
      breakdown: {
        consultations: Math.floor(totalCost * 0.3),
        medications: Math.floor(totalCost * 0.25),
        diagnostics: Math.floor(totalCost * 0.2),
        procedures: Math.floor(totalCost * 0.25)
      },
      recommendations: [
        "Consider health insurance with better coverage",
        "Compare prices across different healthcare providers",
        "Look into preventive care options",
        "Check for corporate wellness benefits"
      ]
    };
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 0.8) return "text-green-600";
    if (level >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadge = (level: number) => {
    if (level >= 0.8) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (level >= 0.6) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cost Prediction</h1>
        <p className="text-muted-foreground">AI-powered healthcare cost estimation and planning</p>
      </div>

      <Tabs defaultValue="new-prediction" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-prediction">New Prediction</TabsTrigger>
          <TabsTrigger value="my-predictions">My Predictions ({predictions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new-prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Generate Cost Prediction
              </CardTitle>
              <CardDescription>
                Get AI-powered cost estimates for medical conditions and treatments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Treatment Type</label>
                  <Select value={newPrediction.type} onValueChange={(value) => 
                    setNewPrediction(prev => ({ ...prev, type: value, condition: "" }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {predictionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Condition/Service</label>
                  <Select 
                    value={newPrediction.condition} 
                    onValueChange={(value) => setNewPrediction(prev => ({ ...prev, condition: value }))}
                    disabled={!newPrediction.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {newPrediction.type && commonConditions[newPrediction.type]?.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Timeline (months)</label>
                  <Select value={newPrediction.timeline} onValueChange={(value) => 
                    setNewPrediction(prev => ({ ...prev, timeline: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">1 year</SelectItem>
                      <SelectItem value="24">2 years</SelectItem>
                      <SelectItem value="36">3 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generatePrediction} 
                disabled={loading || !newPrediction.condition || !newPrediction.type}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate Cost Prediction"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-predictions" className="space-y-4">
          {predictions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No cost predictions yet</p>
                <Button onClick={() => (document.querySelector('[value="new-prediction"]') as HTMLElement)?.click()}>
                  Generate Your First Prediction
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <Card key={prediction.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prediction.condition_or_service}</CardTitle>
                        <CardDescription>
                          {prediction.prediction_type.replace('_', ' ').toUpperCase()} • {prediction.timeline_months} months
                        </CardDescription>
                      </div>
                      {getConfidenceBadge(prediction.confidence_level)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">₹{prediction.predicted_cost.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold text-green-600">₹{prediction.insurance_coverage.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Insurance Coverage</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                        <p className="text-2xl font-bold text-orange-600">₹{prediction.out_of_pocket_cost.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Out of Pocket</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold text-blue-600">{Math.round(prediction.confidence_level * 100)}%</p>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Cost Breakdown</h4>
                        <div className="space-y-2">
                          {Object.entries(prediction.cost_breakdown || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                              <span>₹{(value as number).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {prediction.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};