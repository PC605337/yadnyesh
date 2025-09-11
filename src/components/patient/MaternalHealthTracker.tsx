import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Heart, 
  Baby, 
  Calendar, 
  Weight, 
  Activity, 
  Plus, 
  TrendingUp,
  BookOpen,
  Pill,
  FileText
} from "lucide-react";

interface MaternalRecord {
  id: string;
  pregnancy_stage: string;
  gestational_week: number;
  expected_due_date: string;
  weight_tracking: any;
  vital_signs: any;
  ultrasound_reports: any;
  prenatal_vitamins: any;
  created_at: string;
}

export function MaternalHealthTracker() {
  const [maternalRecord, setMaternalRecord] = useState<MaternalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [gestationalWeek, setGestationalWeek] = useState<number>(0);
  const [currentWeight, setCurrentWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pregnancyStage, setPregnancyStage] = useState("prenatal");
  const [expectedDueDate, setExpectedDueDate] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const pregnancyMilestones = [
    { week: 4, title: "Missed Period", description: "Pregnancy confirmed" },
    { week: 8, title: "First Prenatal Visit", description: "Initial checkup and tests" },
    { week: 12, title: "End of First Trimester", description: "Risk of miscarriage decreases" },
    { week: 16, title: "Gender Detection", description: "Baby's gender can be determined" },
    { week: 20, title: "Anatomy Scan", description: "Detailed ultrasound examination" },
    { week: 24, title: "Viability Milestone", description: "Baby can survive outside womb with medical care" },
    { week: 28, title: "Third Trimester", description: "Baby's brain develops rapidly" },
    { week: 32, title: "Rapid Weight Gain", description: "Baby gains significant weight" },
    { week: 36, title: "Full Term Approaching", description: "Baby's organs are maturing" },
    { week: 40, title: "Due Date", description: "Expected delivery date" }
  ];

  const prenatalVitamins = [
    "Folic Acid (400-600 mcg)",
    "Iron (27 mg)",
    "Calcium (1000 mg)",
    "Vitamin D (600 IU)",
    "DHA (200-300 mg)",
    "Prenatal Multivitamin"
  ];

  const trimesterInfo = {
    first: { weeks: "1-12", focus: "Organ Development", symptoms: "Nausea, Fatigue, Breast Changes" },
    second: { weeks: "13-26", focus: "Growth & Movement", symptoms: "Increased Energy, Baby Movements" },
    third: { weeks: "27-40", focus: "Final Growth", symptoms: "Shortness of breath, Frequent urination" }
  };

  useEffect(() => {
    if (user) {
      loadMaternalRecord();
    }
  }, [user]);

  const loadMaternalRecord = async () => {
    try {
      const { data, error } = await supabase
        .from('maternal_records')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const record = {
          ...data[0],
          weight_tracking: Array.isArray(data[0].weight_tracking) ? data[0].weight_tracking : [],
          vital_signs: data[0].vital_signs || {},
          ultrasound_reports: Array.isArray(data[0].ultrasound_reports) ? data[0].ultrasound_reports : [],
          prenatal_vitamins: Array.isArray(data[0].prenatal_vitamins) ? data[0].prenatal_vitamins : []
        };
        setMaternalRecord(record);
        setGestationalWeek(record.gestational_week || 0);
        setPregnancyStage(record.pregnancy_stage || 'prenatal');
        setExpectedDueDate(record.expected_due_date || '');
      }
    } catch (error) {
      console.error('Error loading maternal record:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateRecord = async () => {
    if (!user) return;

    try {
      const recordData = {
        patient_id: user.id,
        pregnancy_stage: pregnancyStage,
        gestational_week: gestationalWeek,
        expected_due_date: expectedDueDate,
        weight_tracking: maternalRecord?.weight_tracking || [],
        vital_signs: maternalRecord?.vital_signs || {},
        ultrasound_reports: maternalRecord?.ultrasound_reports || [],
        prenatal_vitamins: maternalRecord?.prenatal_vitamins || [],
      };

      let result;
      if (maternalRecord) {
        result = await supabase
          .from('maternal_records')
          .update(recordData)
          .eq('id', maternalRecord.id);
      } else {
        result = await supabase
          .from('maternal_records')
          .insert(recordData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Record Updated",
        description: "Your maternal health record has been saved successfully."
      });

      loadMaternalRecord();
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addWeightEntry = async () => {
    if (!currentWeight || !maternalRecord) return;

    const newWeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(currentWeight),
      gestational_week: gestationalWeek
    };

    const updatedWeightTracking = [...(maternalRecord.weight_tracking || []), newWeightEntry];

    try {
      const { error } = await supabase
        .from('maternal_records')
        .update({ weight_tracking: updatedWeightTracking })
        .eq('id', maternalRecord.id);

      if (error) throw error;

      setCurrentWeight("");
      loadMaternalRecord();

      toast({
        title: "Weight Recorded",
        description: `Weight of ${currentWeight} kg recorded for week ${gestationalWeek}.`
      });
    } catch (error) {
      console.error('Error adding weight:', error);
      toast({
        title: "Error",
        description: "Unable to record weight. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addVitalSigns = async () => {
    if (!bloodPressure || !maternalRecord) return;

    const [systolic, diastolic] = bloodPressure.split('/');
    const vitalSigns = {
      blood_pressure: { systolic: parseInt(systolic), diastolic: parseInt(diastolic) },
      date: new Date().toISOString().split('T')[0],
      gestational_week: gestationalWeek
    };

    try {
      const { error } = await supabase
        .from('maternal_records')
        .update({ vital_signs: vitalSigns })
        .eq('id', maternalRecord.id);

      if (error) throw error;

      setBloodPressure("");
      loadMaternalRecord();

      toast({
        title: "Vitals Recorded",
        description: "Blood pressure has been recorded successfully."
      });
    } catch (error) {
      console.error('Error adding vitals:', error);
    }
  };

  const getCurrentTrimester = () => {
    if (gestationalWeek <= 12) return 'first';
    if (gestationalWeek <= 26) return 'second';
    return 'third';
  };

  const getProgressPercentage = () => {
    return Math.min((gestationalWeek / 40) * 100, 100);
  };

  const getNextMilestone = () => {
    return pregnancyMilestones.find(milestone => milestone.week > gestationalWeek);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="h-6 w-6" />
            Maternal Health Tracker
          </CardTitle>
          <p className="text-pink-700">
            Track your pregnancy journey with personalized insights and recommendations
          </p>
        </CardHeader>
      </Card>

      {/* Setup or Progress */}
      {!maternalRecord ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Set Up Your Pregnancy Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Pregnancy Stage</label>
                <Select value={pregnancyStage} onValueChange={setPregnancyStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preconception">Preconception</SelectItem>
                    <SelectItem value="prenatal">Prenatal</SelectItem>
                    <SelectItem value="postnatal">Postnatal</SelectItem>
                    <SelectItem value="lactation">Lactation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Current Gestational Week</label>
                <Input
                  type="number"
                  placeholder="e.g., 12"
                  value={gestationalWeek}
                  onChange={(e) => setGestationalWeek(parseInt(e.target.value) || 0)}
                  max="42"
                  min="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Expected Due Date</label>
                <Input
                  type="date"
                  value={expectedDueDate}
                  onChange={(e) => setExpectedDueDate(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={createOrUpdateRecord} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Pregnancy Tracker
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pregnancy Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pregnancy Progress - Week {gestationalWeek}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gestational Age</span>
                  <span>{gestationalWeek} / 40 weeks</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{getCurrentTrimester().toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground">Trimester</div>
                  <div className="text-xs mt-1">
                    {trimesterInfo[getCurrentTrimester() as keyof typeof trimesterInfo].weeks} weeks
                  </div>
                </div>

                <div className="text-center p-4 bg-healing-green/5 rounded-lg">
                  <div className="text-2xl font-bold text-healing-green">
                    {expectedDueDate ? Math.ceil((new Date(expectedDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Days to Due Date</div>
                </div>

                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-lg font-semibold text-accent">
                    {getNextMilestone()?.title || "Full Term"}
                  </div>
                  <div className="text-sm text-muted-foreground">Next Milestone</div>
                  {getNextMilestone() && (
                    <div className="text-xs mt-1">Week {getNextMilestone()?.week}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  Weight Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Weight (kg)"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                  <Button onClick={addWeightEntry} disabled={!currentWeight}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {maternalRecord.weight_tracking && maternalRecord.weight_tracking.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Entries:</h4>
                    {maternalRecord.weight_tracking.slice(-3).map((entry, index) => (
                      <div key={index} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                        <span>Week {entry.gestational_week}</span>
                        <span>{entry.weight} kg</span>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="BP (e.g., 120/80)"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                  />
                  <Button onClick={addVitalSigns} disabled={!bloodPressure}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {maternalRecord.vital_signs && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Latest Reading:</h4>
                    <div className="bg-muted/50 p-3 rounded">
                      <div className="flex justify-between">
                        <span>Blood Pressure</span>
                        <span>{maternalRecord.vital_signs.blood_pressure?.systolic}/{maternalRecord.vital_signs.blood_pressure?.diastolic}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {maternalRecord.vital_signs.date && new Date(maternalRecord.vital_signs.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trimester Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Trimester Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {getCurrentTrimester().charAt(0).toUpperCase() + getCurrentTrimester().slice(1)} Trimester 
                  ({trimesterInfo[getCurrentTrimester() as keyof typeof trimesterInfo].weeks} weeks)
                </h4>
                <p className="text-sm mb-2">
                  <strong>Focus:</strong> {trimesterInfo[getCurrentTrimester() as keyof typeof trimesterInfo].focus}
                </p>
                <p className="text-sm">
                  <strong>Common Symptoms:</strong> {trimesterInfo[getCurrentTrimester() as keyof typeof trimesterInfo].symptoms}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prenatal Vitamins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Recommended Prenatal Vitamins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {prenatalVitamins.map((vitamin, index) => (
                  <Badge key={index} variant="outline" className="justify-start p-2">
                    {vitamin}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Consult your healthcare provider before starting any supplements
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pregnancyMilestones
                  .filter(milestone => milestone.week > gestationalWeek)
                  .slice(0, 3)
                  .map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                        {milestone.week}
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}