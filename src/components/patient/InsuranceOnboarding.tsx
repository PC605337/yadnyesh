import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface OnboardingData {
  zipCode: string;
  hasInsurance: string;
  insuranceProvider: string;
  policyNumber: string;
  symptoms: string[];
  urgency: string;
  preferredProviders: string[];
  medicalHistory: string;
}

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Back Pain", "Anxiety", 
  "Depression", "Joint Pain", "Shortness of breath", "Chest Pain",
  "Nausea", "Dizziness", "Sleep problems", "Skin issues"
];

const urgencyLevels = [
  { value: "routine", label: "Routine check-up", description: "Non-urgent, can wait weeks" },
  { value: "soon", label: "Need care soon", description: "Should be seen within days" },
  { value: "urgent", label: "Urgent care", description: "Need care within 24 hours" },
  { value: "emergency", label: "Emergency", description: "Seek immediate care" }
];

const popularInsurers = [
  "ICICI Lombard", "Star Health", "Bajaj Allianz", "HDFC ERGO", 
  "New India Assurance", "Oriental Insurance", "United India Insurance", 
  "National Insurance", "Max Bupa", "Care Health"
];

export function InsuranceOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    zipCode: "",
    hasInsurance: "",
    insuranceProvider: "",
    policyNumber: "",
    symptoms: [],
    urgency: "",
    preferredProviders: [],
    medicalHistory: ""
  });

  const handleSymptomToggle = (symptom: string) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save insurance information if provided
      if (data.hasInsurance === "yes" && data.insuranceProvider && data.policyNumber) {
        const { error: insuranceError } = await supabase
          .from('patient_insurance')
          .upsert({
            patient_id: user?.id,
            provider_id: "00000000-0000-0000-0000-000000000000", // Placeholder
            policy_number: data.policyNumber,
            insurance_provider: data.insuranceProvider,
            policy_type: "health",
            is_active: true,
            policy_start_date: new Date().toISOString().split('T')[0],
            policy_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            coverage_amount: 500000, // Default coverage
            premium_amount: 15000 // Default premium
          });

        if (insuranceError) {
          console.error('Insurance save error:', insuranceError);
        }
      }

      // Create AI triage session
      const { error: triageError } = await supabase
        .from('ai_triage_sessions')
        .insert({
          patient_id: user?.id,
          input_data: {
            zipCode: data.zipCode,
            hasInsurance: data.hasInsurance,
            symptoms: data.symptoms,
            urgency: data.urgency,
            medicalHistory: data.medicalHistory
          },
          session_type: 'onboarding',
          urgency_level: data.urgency,
          language_used: 'en'
        });

      if (triageError) {
        console.error('Triage session error:', triageError);
      }

      toast.success("Onboarding completed! Redirecting to dashboard...");
      setTimeout(() => navigate("/patient"), 2000);
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.zipCode.length >= 5;
      case 2: return data.hasInsurance !== "";
      case 3: return data.hasInsurance === "no" || (data.insuranceProvider && data.policyNumber);
      case 4: return data.symptoms.length > 0 && data.urgency;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {currentStep === 1 && "Where are you located?"}
            {currentStep === 2 && "Do you have insurance?"}
            {currentStep === 3 && "Insurance Details"}
            {currentStep === 4 && "What brings you here today?"}
            {currentStep === 5 && "Medical History"}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of 5 - We'll help you find the right care
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code or PIN Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Enter your ZIP/PIN code"
                  value={data.zipCode}
                  onChange={(e) => setData(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="text-center text-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                We'll use this to find healthcare providers in your area
              </p>
            </div>
          )}

          {/* Step 2: Insurance Check */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <RadioGroup
                value={data.hasInsurance}
                onValueChange={(value) => setData(prev => ({ ...prev, hasInsurance: value }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">Yes, I have insurance</div>
                      <div className="text-sm text-muted-foreground">
                        We'll help you find in-network providers
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">No insurance / Pay out of pocket</div>
                      <div className="text-sm text-muted-foreground">
                        We'll show you affordable options
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Insurance Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CreditCard className="h-12 w-12 text-primary" />
              </div>
              
              {data.hasInsurance === "yes" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Insurance Provider</Label>
                    <Select
                      value={data.insuranceProvider}
                      onValueChange={(value) => setData(prev => ({ ...prev, insuranceProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your insurance provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {popularInsurers.map((insurer) => (
                          <SelectItem key={insurer} value={insurer}>
                            {insurer}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="policy">Policy Number</Label>
                    <Input
                      id="policy"
                      placeholder="Enter your policy number"
                      value={data.policyNumber}
                      onChange={(e) => setData(prev => ({ ...prev, policyNumber: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium">No problem!</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll show you transparent pricing and affordable options
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Symptoms & Urgency */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">What symptoms are you experiencing?</Label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant={data.symptoms.includes(symptom) ? "default" : "outline"}
                      className="cursor-pointer p-2 text-center justify-center"
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">How urgent is your need for care?</Label>
                <RadioGroup
                  value={data.urgency}
                  onValueChange={(value) => setData(prev => ({ ...prev, urgency: value }))}
                  className="mt-3 space-y-3"
                >
                  {urgencyLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 5: Medical History */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="history" className="text-base font-medium">
                  Relevant medical history (optional)
                </Label>
                <Textarea
                  id="history"
                  placeholder="Any relevant medical conditions, medications, or allergies..."
                  value={data.medicalHistory}
                  onChange={(e) => setData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  rows={4}
                  className="mt-2"
                />
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Summary:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Location:</strong> {data.zipCode}</p>
                  <p><strong>Insurance:</strong> {data.hasInsurance === "yes" ? data.insuranceProvider : "Self-pay"}</p>
                  <p><strong>Symptoms:</strong> {data.symptoms.join(", ")}</p>
                  <p><strong>Urgency:</strong> {urgencyLevels.find(l => l.value === data.urgency)?.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? "Processing..." : currentStep === 5 ? "Complete Setup" : "Next"}
              {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}