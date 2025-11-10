import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  Heart, 
  Pill, 
  Activity,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MedicalHistory {
  chronic_conditions: string[];
  allergies: string[];
  current_medications: Array<{ name: string; dosage: string; frequency: string }>;
  past_surgeries: Array<{ procedure: string; date: string; hospital: string }>;
  family_history: Array<{ condition: string; relation: string }>;
  blood_type: string;
  height: number;
  weight: number;
  smoking: boolean;
  alcohol: boolean;
  exercise_frequency: string;
}

const commonConditions = [
  'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid Disorder',
  'Arthritis', 'COPD', 'Anxiety', 'Depression', 'Migraine'
];

const commonAllergies = [
  'Penicillin', 'Sulfa drugs', 'Peanuts', 'Shellfish', 'Latex',
  'Pollen', 'Dust', 'Pet dander', 'Aspirin', 'Iodine'
];

export const MedicalHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState<MedicalHistory>({
    chronic_conditions: [],
    allergies: [],
    current_medications: [],
    past_surgeries: [],
    family_history: [],
    blood_type: '',
    height: 0,
    weight: 0,
    smoking: false,
    alcohol: false,
    exercise_frequency: ''
  });

  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [newSurgery, setNewSurgery] = useState({ procedure: '', date: '', hospital: '' });
  const [newFamilyHistory, setNewFamilyHistory] = useState({ condition: '', relation: '' });

  useEffect(() => {
    if (user) {
      fetchMedicalHistory();
    }
  }, [user]);

  const fetchMedicalHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('patient_id', user?.id)
        .eq('type', 'medical_history')
        .maybeSingle();

      if (data?.data && typeof data.data === 'object') {
        setHistory(data.data as unknown as MedicalHistory);
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMedicalHistory = async () => {
    try {
      const { error } = await supabase
        .from('health_records')
        .upsert([{
          patient_id: user?.id,
          type: 'medical_history',
          title: 'Medical History Profile',
          recorded_date: new Date().toISOString().split('T')[0],
          data: history as any
        }]);

      if (error) throw error;

      toast.success('Medical history updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error saving medical history:', error);
      toast.error('Failed to update medical history');
    }
  };

  const toggleCondition = (condition: string) => {
    setHistory(prev => ({
      ...prev,
      chronic_conditions: prev.chronic_conditions.includes(condition)
        ? prev.chronic_conditions.filter(c => c !== condition)
        : [...prev.chronic_conditions, condition]
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setHistory(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setHistory(prev => ({
        ...prev,
        current_medications: [...prev.current_medications, newMedication]
      }));
      setNewMedication({ name: '', dosage: '', frequency: '' });
    }
  };

  const addSurgery = () => {
    if (newSurgery.procedure && newSurgery.date) {
      setHistory(prev => ({
        ...prev,
        past_surgeries: [...prev.past_surgeries, newSurgery]
      }));
      setNewSurgery({ procedure: '', date: '', hospital: '' });
    }
  };

  const addFamilyHistory = () => {
    if (newFamilyHistory.condition && newFamilyHistory.relation) {
      setHistory(prev => ({
        ...prev,
        family_history: [...prev.family_history, newFamilyHistory]
      }));
      setNewFamilyHistory({ condition: '', relation: '' });
    }
  };

  const calculateBMI = () => {
    if (history.height > 0 && history.weight > 0) {
      const heightInMeters = history.height / 100;
      const bmi = history.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading medical history...</div>;
  }

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical History</h1>
          <p className="text-muted-foreground">Complete medical profile for better care</p>
        </div>
        
        {editing ? (
          <Button onClick={saveMedicalHistory}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        ) : (
          <Button onClick={() => setEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="surgeries">Surgeries</TabsTrigger>
          <TabsTrigger value="family">Family History</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Blood Type</Label>
                  <select
                    disabled={!editing}
                    value={history.blood_type}
                    onChange={(e) => setHistory({...history, blood_type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    disabled={!editing}
                    value={history.height || ''}
                    onChange={(e) => setHistory({...history, height: parseFloat(e.target.value)})}
                  />
                </div>

                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    disabled={!editing}
                    value={history.weight || ''}
                    onChange={(e) => setHistory({...history, weight: parseFloat(e.target.value)})}
                  />
                </div>

                {bmi && (
                  <div>
                    <Label>BMI</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-2xl font-bold">{bmi}</span>
                      <Badge className={bmiCategory?.color}>{bmiCategory?.label}</Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Lifestyle</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={!editing}
                      checked={history.smoking}
                      onCheckedChange={(checked) => setHistory({...history, smoking: checked as boolean})}
                    />
                    <label className="text-sm">Smoking</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={!editing}
                      checked={history.alcohol}
                      onCheckedChange={(checked) => setHistory({...history, alcohol: checked as boolean})}
                    />
                    <label className="text-sm">Alcohol Consumption</label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Exercise Frequency</Label>
                <select
                  disabled={!editing}
                  value={history.exercise_frequency}
                  onChange={(e) => setHistory({...history, exercise_frequency: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="occasional">Occasional (1-2 times/week)</option>
                  <option value="regular">Regular (3-4 times/week)</option>
                  <option value="frequent">Frequent (5+ times/week)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Chronic Conditions</span>
              </CardTitle>
              <CardDescription>Select all conditions that apply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonConditions.map((condition) => (
                  <div
                    key={condition}
                    onClick={() => editing && toggleCondition(condition)}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      history.chronic_conditions.includes(condition)
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    } ${!editing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        disabled={!editing}
                        checked={history.chronic_conditions.includes(condition)}
                        onCheckedChange={() => toggleCondition(condition)}
                      />
                      <span className="text-sm">{condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Allergies</span>
              </CardTitle>
              <CardDescription>Important for medication safety</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAllergies.map((allergy) => (
                  <div
                    key={allergy}
                    onClick={() => editing && toggleAllergy(allergy)}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      history.allergies.includes(allergy)
                        ? 'border-red-500 bg-red-50'
                        : 'hover:border-red-300'
                    } ${!editing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        disabled={!editing}
                        checked={history.allergies.includes(allergy)}
                        onCheckedChange={() => toggleAllergy(allergy)}
                      />
                      <span className="text-sm">{allergy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.current_medications.map((med, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
              ))}

              {editing && (
                <div className="space-y-3 p-4 bg-accent/5 rounded">
                  <h4 className="font-medium">Add Medication</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Medication name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    />
                    <Input
                      placeholder="Dosage"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    />
                    <Input
                      placeholder="Frequency"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                    />
                  </div>
                  <Button onClick={addMedication} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surgeries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Past Surgeries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.past_surgeries.map((surgery, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <h4 className="font-medium">{surgery.procedure}</h4>
                  <p className="text-sm text-muted-foreground">
                    {surgery.date} • {surgery.hospital}
                  </p>
                </div>
              ))}

              {editing && (
                <div className="space-y-3 p-4 bg-accent/5 rounded">
                  <h4 className="font-medium">Add Surgery</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Procedure"
                      value={newSurgery.procedure}
                      onChange={(e) => setNewSurgery({...newSurgery, procedure: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newSurgery.date}
                      onChange={(e) => setNewSurgery({...newSurgery, date: e.target.value})}
                    />
                    <Input
                      placeholder="Hospital"
                      value={newSurgery.hospital}
                      onChange={(e) => setNewSurgery({...newSurgery, hospital: e.target.value})}
                    />
                  </div>
                  <Button onClick={addSurgery} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Family Medical History</span>
              </CardTitle>
              <CardDescription>Helps assess genetic risk factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {history.family_history.map((item, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <h4 className="font-medium">{item.condition}</h4>
                  <p className="text-sm text-muted-foreground">{item.relation}</p>
                </div>
              ))}

              {editing && (
                <div className="space-y-3 p-4 bg-accent/5 rounded">
                  <h4 className="font-medium">Add Family History</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Condition"
                      value={newFamilyHistory.condition}
                      onChange={(e) => setNewFamilyHistory({...newFamilyHistory, condition: e.target.value})}
                    />
                    <Input
                      placeholder="Relation (e.g., Father, Mother)"
                      value={newFamilyHistory.relation}
                      onChange={(e) => setNewFamilyHistory({...newFamilyHistory, relation: e.target.value})}
                    />
                  </div>
                  <Button onClick={addFamilyHistory} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
