import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain, AlertTriangle, Clock, Stethoscope, Loader2, Globe } from "lucide-react";

interface SymptomTriageProps {
  onTriageComplete?: (result: any) => void;
}

export function SymptomTriage({ onTriageComplete }: SymptomTriageProps) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const { toast } = useToast();

  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Sore throat", "Fatigue", "Nausea", 
    "Abdominal pain", "Chest pain", "Shortness of breath", "Dizziness",
    "Rash", "Joint pain", "Back pain", "Vomiting", "Diarrhea"
  ];

  const urgencyColors = {
    emergency: "bg-destructive text-destructive-foreground",
    urgent: "bg-warning text-warning-foreground",
    moderate: "bg-secondary text-secondary-foreground",
    low: "bg-muted text-muted-foreground"
  };

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "mr", name: "मराठी (Marathi)" }
  ];

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "Please add symptoms",
        description: "Add at least one symptom to continue with triage.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-health-triage', {
        body: {
          symptoms,
          demographics: {
            duration,
            severity,
            additionalInfo,
            location: 'Mumbai, India'
          },
          language
        }
      });

      if (error) throw error;

      setTriageResult(data);
      onTriageComplete?.(data);
      
      toast({
        title: "Triage Complete",
        description: "Your symptoms have been analyzed. Please review the recommendations below."
      });

    } catch (error) {
      console.error('Triage error:', error);
      toast({
        title: "Analysis Failed", 
        description: "Unable to analyze symptoms. Please try again or consult a healthcare provider.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTriage = () => {
    setSymptoms([]);
    setDuration("");
    setSeverity("");
    setAdditionalInfo("");
    setTriageResult(null);
  };

  if (triageResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Triage Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgency Level */}
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Urgency Level:</span>
            <Badge className={urgencyColors[triageResult.urgency_level as keyof typeof urgencyColors]}>
              {triageResult.urgency_level?.toUpperCase()}
            </Badge>
          </div>

          {/* Recommended Specialty */}
          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5" />
            <span className="font-medium">Recommended Specialty:</span>
            <Badge variant="outline">{triageResult.recommended_specialty}</Badge>
          </div>

          {/* AI Analysis */}
          <div>
            <h4 className="font-semibold mb-2">AI Analysis:</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{triageResult.ai_response}</p>
            </div>
          </div>

          {/* Follow-up Recommendations */}
          {triageResult.follow_up_recommendations && (
            <div>
              <h4 className="font-semibold mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1">
                {triageResult.follow_up_recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Score */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Analysis Confidence: {Math.round(triageResult.confidence_score * 100)}%</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/patient/consultation'}>
              Book Consultation
            </Button>
            <Button variant="outline" onClick={resetTriage}>
              New Triage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Symptom Triage
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe your symptoms for AI-powered health assessment and recommendations.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Selection */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language / भाषा / भाषा
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Symptom Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Add Symptoms
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a symptom..."
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSymptom(currentSymptom)}
            />
            <Button 
              variant="outline" 
              onClick={() => addSymptom(currentSymptom)}
              disabled={!currentSymptom}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Common Symptoms */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Common Symptoms (click to add)
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
              <Badge
                key={symptom}
                variant={symptoms.includes(symptom) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {symptoms.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Selected Symptoms:
            </label>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <Badge key={symptom} variant="default" className="cursor-pointer">
                  {symptom}
                  <button
                    className="ml-2 text-xs"
                    onClick={() => removeSymptom(symptom)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            How long have you had these symptoms?
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="few_hours">A few hours</SelectItem>
              <SelectItem value="1_day">1 day</SelectItem>
              <SelectItem value="2_3_days">2-3 days</SelectItem>
              <SelectItem value="1_week">About a week</SelectItem>
              <SelectItem value="2_weeks">2 weeks</SelectItem>
              <SelectItem value="1_month">About a month</SelectItem>
              <SelectItem value="longer">Longer than a month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            How severe are your symptoms?
          </label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild - Noticeable but manageable</SelectItem>
              <SelectItem value="moderate">Moderate - Somewhat interfering with daily activities</SelectItem>
              <SelectItem value="severe">Severe - Significantly impacting daily life</SelectItem>
              <SelectItem value="unbearable">Unbearable - Unable to function normally</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Information */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Additional Information (optional)
          </label>
          <Textarea
            placeholder="Any other relevant information about your symptoms, medical history, current medications, etc."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={loading || symptoms.length === 0}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Get AI Analysis
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This AI analysis is for informational purposes only and should not replace professional medical advice.
          Always consult with healthcare providers for proper diagnosis and treatment.
        </p>
      </CardContent>
    </Card>
  );
}