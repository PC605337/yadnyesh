import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Baby, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Plus,
  AlertCircle,
  CheckCircle,
  Scale,
  Ruler,
  Clock
} from "lucide-react";

interface PediatricRecord {
  id: string;
  birth_date: string;
  birth_weight: number;
  birth_height: number;
  vaccination_schedule: any;
  growth_milestones: any;
  development_assessments: any;
  allergies: any;
  medical_conditions: any;
}

export function PediatricCareTracker() {
  const [records, setRecords] = useState<PediatricRecord[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  
  // Add child form
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthWeight, setBirthWeight] = useState("");
  const [birthHeight, setBirthHeight] = useState("");
  
  // Tracking forms
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentHeight, setCurrentHeight] = useState("");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");
  const [vaccineName, setVaccineName] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();

  const indianVaccinationSchedule = [
    { vaccine: "BCG", ageMonths: 0, description: "Tuberculosis protection" },
    { vaccine: "Hepatitis B", ageMonths: 0, description: "Birth dose" },
    { vaccine: "OPV", ageMonths: 0, description: "Oral Polio Vaccine" },
    { vaccine: "DPT", ageMonths: 1.5, description: "Diphtheria, Pertussis, Tetanus" },
    { vaccine: "IPV", ageMonths: 1.5, description: "Inactivated Polio Vaccine" },
    { vaccine: "Rotavirus", ageMonths: 1.5, description: "Rotavirus protection" },
    { vaccine: "PCV", ageMonths: 1.5, description: "Pneumococcal Conjugate Vaccine" },
    { vaccine: "Hepatitis B", ageMonths: 1.5, description: "Second dose" },
    { vaccine: "DPT", ageMonths: 2.5, description: "Second dose" },
    { vaccine: "IPV", ageMonths: 2.5, description: "Second dose" },
    { vaccine: "Rotavirus", ageMonths: 2.5, description: "Second dose" },
    { vaccine: "PCV", ageMonths: 2.5, description: "Second dose" },
    { vaccine: "DPT", ageMonths: 3.5, description: "Third dose" },
    { vaccine: "IPV", ageMonths: 3.5, description: "Third dose" },
    { vaccine: "Rotavirus", ageMonths: 3.5, description: "Third dose" },
    { vaccine: "PCV", ageMonths: 3.5, description: "Third dose" },
    { vaccine: "Hepatitis B", ageMonths: 3.5, description: "Third dose" },
    { vaccine: "MMR", ageMonths: 9, description: "Measles, Mumps, Rubella" },
    { vaccine: "Japanese Encephalitis", ageMonths: 9, description: "JE vaccine" },
    { vaccine: "DPT Booster", ageMonths: 18, description: "Booster dose" },
    { vaccine: "MMR", ageMonths: 18, description: "Second dose" },
    { vaccine: "Varicella", ageMonths: 18, description: "Chickenpox vaccine" },
    { vaccine: "DPT Booster", ageMonths: 60, description: "School entry booster" },
    { vaccine: "Typhoid", ageMonths: 24, description: "Typhoid protection" }
  ];

  const developmentMilestones = {
    0: ["Reflexes present", "Responds to sounds", "Focuses on faces"],
    1: ["Smiles socially", "Lifts head when on tummy", "Makes cooing sounds"],
    2: ["Holds head up", "Follows objects with eyes", "Makes gurgling sounds"],
    3: ["Reaches for toys", "Laughs", "Holds head steady"],
    4: ["Rolls over", "Sits with support", "Babbles"],
    6: ["Sits without support", "Transfers objects hand to hand", "Responds to name"],
    9: ["Crawls", "Pulls to stand", "Says 'mama' or 'dada'"],
    12: ["Walks independently", "Says first words", "Points to objects"],
    18: ["Runs", "Says 10-20 words", "Feeds self with spoon"],
    24: ["Jumps", "Uses 2-word phrases", "Follows simple instructions"],
    36: ["Pedals tricycle", "Uses complete sentences", "Plays with others"]
  };

  useEffect(() => {
    if (user) {
      loadPediatricRecords();
    }
  }, [user]);

  const loadPediatricRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('pediatric_records')
        .select('*')
        .eq('parent_id', user?.id)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      const formattedRecords = (data || []).map(record => ({
        ...record,
        vaccination_schedule: Array.isArray(record.vaccination_schedule) ? record.vaccination_schedule : [],
        growth_milestones: Array.isArray(record.growth_milestones) ? record.growth_milestones : [],
        development_assessments: Array.isArray(record.development_assessments) ? record.development_assessments : [],
        allergies: Array.isArray(record.allergies) ? record.allergies : [],
        medical_conditions: Array.isArray(record.medical_conditions) ? record.medical_conditions : []
      }));
      setRecords(formattedRecords);
      if (formattedRecords.length > 0 && !selectedChild) {
        setSelectedChild(formattedRecords[0].id);
      }
    } catch (error) {
      console.error('Error loading pediatric records:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} months`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years}y ${months}m` : `${years} years`;
    }
  };

  const getVaccinationStatus = (record: PediatricRecord) => {
    const ageInMonths = (new Date().getTime() - new Date(record.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const dueVaccines = indianVaccinationSchedule.filter(v => v.ageMonths <= ageInMonths);
    const completedVaccines = record.vaccination_schedule || [];
    
    return {
      due: dueVaccines.length,
      completed: completedVaccines.length,
      percentage: dueVaccines.length > 0 ? (completedVaccines.length / dueVaccines.length) * 100 : 0
    };
  };

  const addNewChild = async () => {
    if (!childName || !birthDate || !user) return;

    try {
      const { data, error } = await supabase
        .from('pediatric_records')
        .insert({
          patient_id: user.id, // Child's record
          parent_id: user.id,  // Parent who manages it
          birth_date: birthDate,
          birth_weight: parseFloat(birthWeight) || null,
          birth_height: parseFloat(birthHeight) || null
        });

      if (error) throw error;

      setChildName("");
      setBirthDate("");
      setBirthWeight("");
      setBirthHeight("");
      setShowAddChild(false);
      
      toast({
        title: "Child Added",
        description: `${childName}'s pediatric record has been created successfully.`
      });

      loadPediatricRecords();
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Unable to add child record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addVaccination = async () => {
    if (!vaccineName || !vaccineDate || !selectedChild) return;

    const selectedRecord = records.find(r => r.id === selectedChild);
    if (!selectedRecord) return;

    const newVaccination = {
      vaccine: vaccineName,
      date: vaccineDate,
      administered_by: "Healthcare Provider",
      notes: ""
    };

    const updatedSchedule = [...(selectedRecord.vaccination_schedule || []), newVaccination];

    try {
      const { error } = await supabase
        .from('pediatric_records')
        .update({ vaccination_schedule: updatedSchedule })
        .eq('id', selectedChild);

      if (error) throw error;

      setVaccineName("");
      setVaccineDate("");
      
      toast({
        title: "Vaccination Recorded",
        description: `${vaccineName} vaccination has been added to the record.`
      });

      loadPediatricRecords();
    } catch (error) {
      console.error('Error adding vaccination:', error);
    }
  };

  const addGrowthMeasurement = async () => {
    if (!currentWeight && !currentHeight) return;

    const selectedRecord = records.find(r => r.id === selectedChild);
    if (!selectedRecord) return;

    const measurement = {
      date: new Date().toISOString().split('T')[0],
      weight: currentWeight ? parseFloat(currentWeight) : null,
      height: currentHeight ? parseFloat(currentHeight) : null,
      age_months: Math.floor((new Date().getTime() - new Date(selectedRecord.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    };

    const updatedMilestones = [...(selectedRecord.growth_milestones || []), measurement];

    try {
      const { error } = await supabase
        .from('pediatric_records')
        .update({ growth_milestones: updatedMilestones })
        .eq('id', selectedChild);

      if (error) throw error;

      setCurrentWeight("");
      setCurrentHeight("");
      
      toast({
        title: "Growth Recorded",
        description: "Growth measurement has been added successfully."
      });

      loadPediatricRecords();
    } catch (error) {
      console.error('Error adding growth measurement:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  const selectedRecord = records.find(r => r.id === selectedChild);
  const vaccinationStatus = selectedRecord ? getVaccinationStatus(selectedRecord) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Baby className="h-6 w-6" />
            Pediatric Care Tracker
          </CardTitle>
          <p className="text-blue-700">
            Monitor your child's growth, vaccinations, and developmental milestones
          </p>
        </CardHeader>
      </Card>

      {/* Child Selection */}
      <div className="flex items-center gap-4">
        {records.length > 0 && (
          <div className="flex-1">
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger>
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {records.map(record => (
                  <SelectItem key={record.id} value={record.id}>
                    Child born {new Date(record.birth_date).toLocaleDateString()} - Age: {calculateAge(record.birth_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => setShowAddChild(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Child
        </Button>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Child</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Child's Name</label>
                <Input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Birth Date</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Birth Weight (kg)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={birthWeight}
                  onChange={(e) => setBirthWeight(e.target.value)}
                  placeholder="3.2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Birth Height (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={birthHeight}
                  onChange={(e) => setBirthHeight(e.target.value)}
                  placeholder="50.5"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={addNewChild} disabled={!childName || !birthDate}>
                Add Child
              </Button>
              <Button variant="outline" onClick={() => setShowAddChild(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedRecord && (
        <>
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{calculateAge(selectedRecord.birth_date)}</div>
                  <div className="text-sm text-muted-foreground">Current Age</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-healing-green">
                    {vaccinationStatus?.completed || 0}/{vaccinationStatus?.due || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Vaccinations</div>
                  <Progress value={vaccinationStatus?.percentage || 0} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {selectedRecord.growth_milestones?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Growth Records</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vaccination Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Vaccination Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={vaccineName} onValueChange={setVaccineName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianVaccinationSchedule.map((vaccine, index) => (
                        <SelectItem key={index} value={vaccine.vaccine}>
                          {vaccine.vaccine} ({vaccine.ageMonths}m)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="date"
                    value={vaccineDate}
                    onChange={(e) => setVaccineDate(e.target.value)}
                  />
                </div>
                
                <Button onClick={addVaccination} disabled={!vaccineName || !vaccineDate} className="w-full">
                  Record Vaccination
                </Button>
                
                {/* Recent Vaccinations */}
                {selectedRecord.vaccination_schedule && selectedRecord.vaccination_schedule.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Vaccinations:</h4>
                    {selectedRecord.vaccination_schedule.slice(-3).map((vac: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                        <span className="font-medium">{vac.vaccine}</span>
                        <span className="text-muted-foreground">{new Date(vac.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Growth Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Weight (kg)"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                  <Input
                    placeholder="Height (cm)"
                    value={currentHeight}
                    onChange={(e) => setCurrentHeight(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                </div>
                
                <Button 
                  onClick={addGrowthMeasurement} 
                  disabled={!currentWeight && !currentHeight}
                  className="w-full"
                >
                  Record Measurement
                </Button>
                
                {/* Recent Measurements */}
                {selectedRecord.growth_milestones && selectedRecord.growth_milestones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Measurements:</h4>
                    {selectedRecord.growth_milestones.slice(-3).map((measurement: any, index: number) => (
                      <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                        <div className="flex justify-between">
                          {measurement.weight && <span>Weight: {measurement.weight} kg</span>}
                          {measurement.height && <span>Height: {measurement.height} cm</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(measurement.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Vaccinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vaccination Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {indianVaccinationSchedule
                  .filter(vaccine => {
                    const ageInMonths = (new Date().getTime() - new Date(selectedRecord.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
                    return vaccine.ageMonths <= ageInMonths + 3; // Show upcoming vaccines
                  })
                  .slice(0, 6)
                  .map((vaccine, index) => {
                    const isCompleted = selectedRecord.vaccination_schedule?.some((v: any) => v.vaccine === vaccine.vaccine);
                    const ageInMonths = (new Date().getTime() - new Date(selectedRecord.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
                    const isDue = vaccine.ageMonths <= ageInMonths;
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${
                        isCompleted ? 'bg-healing-green/10 border-healing-green' : 
                        isDue ? 'bg-warning/10 border-warning' : 
                        'bg-muted/50'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-healing-green" />
                          ) : isDue ? (
                            <AlertCircle className="h-4 w-4 text-warning" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-sm">{vaccine.vaccine}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{vaccine.description}</p>
                        <p className="text-xs font-medium mt-1">
                          {vaccine.ageMonths === 0 ? 'At birth' : `${vaccine.ageMonths} months`}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {records.length === 0 && !showAddChild && (
        <Card>
          <CardContent className="text-center py-12">
            <Baby className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Children Added</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your child's health and development by adding their information.
            </p>
            <Button onClick={() => setShowAddChild(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Child
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}