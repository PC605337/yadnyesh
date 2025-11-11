import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Droplet,
  Thermometer,
  Activity,
  Pill,
  FileText,
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OvulationEntry {
  date: string;
  lh_test: string;
  cervical_mucus: string;
  notes: string;
}

interface TemperatureEntry {
  date: string;
  temperature: number;
}

export function FertilityTracking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [ovulationData, setOvulationData] = useState<OvulationEntry[]>([]);
  const [temperatureData, setTemperatureData] = useState<TemperatureEntry[]>([]);
  const [currentTemp, setCurrentTemp] = useState("");
  const [lhTest, setLhTest] = useState("");
  const [cervicalMucus, setCervicalMucus] = useState("");
  const [notes, setNotes] = useState("");
  const [cycleDay, setCycleDay] = useState(1);
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const lhTestResults = [
    { value: "negative", label: "Negative", color: "bg-gray-200" },
    { value: "low", label: "Low", color: "bg-yellow-200" },
    { value: "high", label: "High", color: "bg-orange-300" },
    { value: "peak", label: "Peak", color: "bg-red-400" }
  ];

  const cervicalMucusTypes = [
    { value: "dry", label: "Dry" },
    { value: "sticky", label: "Sticky" },
    { value: "creamy", label: "Creamy" },
    { value: "watery", label: "Watery" },
    { value: "egg_white", label: "Egg White (Fertile)" }
  ];

  useEffect(() => {
    if (user) {
      loadFertilityData();
    }
  }, [user]);

  useEffect(() => {
    if (lastPeriodDate) {
      const daysSince = Math.floor((new Date().getTime() - new Date(lastPeriodDate).getTime()) / (1000 * 60 * 60 * 24));
      setCycleDay(daysSince + 1);
    }
  }, [lastPeriodDate]);

  const loadFertilityData = async () => {
    try {
      const { data, error } = await supabase
        .from('fertility_records')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const record = data[0];
        const ovulationDataRaw = record.ovulation_tracking as any;
        const temperatureDataRaw = record.basal_body_temperature as any;
        setOvulationData(Array.isArray(ovulationDataRaw) ? ovulationDataRaw : []);
        setTemperatureData(Array.isArray(temperatureDataRaw) ? temperatureDataRaw : []);
      }
    } catch (error) {
      console.error('Error loading fertility data:', error);
    }
  };

  const saveTemperature = async () => {
    if (!currentTemp || !user) return;

    const newEntry: TemperatureEntry = {
      date: new Date().toISOString().split('T')[0],
      temperature: parseFloat(currentTemp)
    };

    try {
      const { data: existingRecord } = await supabase
        .from('fertility_records')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      const existingTemps = existingRecord?.basal_body_temperature as any;
      const updatedTemps = [...(Array.isArray(existingTemps) ? existingTemps : []), newEntry];

      if (existingRecord) {
        await supabase
          .from('fertility_records')
          .update({ basal_body_temperature: updatedTemps as any })
          .eq('id', existingRecord.id);
      } else {
        await supabase
          .from('fertility_records')
          .insert({
            patient_id: user.id,
            basal_body_temperature: [newEntry] as any
          });
      }

      setTemperatureData(updatedTemps);
      setCurrentTemp("");

      toast({
        title: "Temperature Saved",
        description: "Basal body temperature recorded successfully."
      });
    } catch (error) {
      console.error('Error saving temperature:', error);
      toast({
        title: "Error",
        description: "Failed to save temperature.",
        variant: "destructive"
      });
    }
  };

  const saveOvulationData = async () => {
    if (!user) return;

    const newEntry: OvulationEntry = {
      date: new Date().toISOString().split('T')[0],
      lh_test: lhTest,
      cervical_mucus: cervicalMucus,
      notes: notes
    };

    try {
      const { data: existingRecord } = await supabase
        .from('fertility_records')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      const existingOvulation = existingRecord?.ovulation_tracking as any;
      const updatedOvulation = [...(Array.isArray(existingOvulation) ? existingOvulation : []), newEntry];

      if (existingRecord) {
        await supabase
          .from('fertility_records')
          .update({ ovulation_tracking: updatedOvulation as any })
          .eq('id', existingRecord.id);
      } else {
        await supabase
          .from('fertility_records')
          .insert({
            patient_id: user.id,
            ovulation_tracking: [newEntry] as any
          });
      }

      setOvulationData(updatedOvulation);
      setLhTest("");
      setCervicalMucus("");
      setNotes("");

      toast({
        title: "Data Saved",
        description: "Ovulation tracking data recorded successfully."
      });
    } catch (error) {
      console.error('Error saving ovulation data:', error);
      toast({
        title: "Error",
        description: "Failed to save ovulation data.",
        variant: "destructive"
      });
    }
  };

  const getFertileWindow = () => {
    if (!lastPeriodDate) return null;
    
    const ovulationDay = 14;
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
      return {
        status: "fertile",
        message: "You are in your fertile window",
        daysUntilOvulation: Math.max(0, ovulationDay - cycleDay)
      };
    } else if (cycleDay < fertileStart) {
      return {
        status: "pre-fertile",
        message: "Fertile window approaching",
        daysUntilOvulation: fertileStart - cycleDay
      };
    } else {
      return {
        status: "post-ovulation",
        message: "Post-ovulation phase",
        daysUntilOvulation: 28 - cycleDay + ovulationDay
      };
    }
  };

  const fertileWindow = getFertileWindow();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-800">
            <Heart className="h-6 w-6" />
            Fertility Tracking
          </CardTitle>
          <CardDescription className="text-rose-700">
            Track your cycle, ovulation, and optimize your chances of conception
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Cycle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">Day {cycleDay}</div>
            <div className="text-sm text-muted-foreground">Cycle Day</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {fertileWindow && (
              <>
                <Badge 
                  className={
                    fertileWindow.status === "fertile" ? "bg-green-500" :
                    fertileWindow.status === "pre-fertile" ? "bg-yellow-500" :
                    "bg-gray-400"
                  }
                >
                  {fertileWindow.status.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">{fertileWindow.message}</div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-healing-green">
              {fertileWindow?.daysUntilOvulation || 0}
            </div>
            <div className="text-sm text-muted-foreground">Days to Ovulation</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
          <TabsTrigger value="temperature">BBT Chart</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Daily Tracking */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menstrual Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">First Day of Last Period</label>
                <Input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Basal Body Temperature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 36.5"
                  value={currentTemp}
                  onChange={(e) => setCurrentTemp(e.target.value)}
                />
                <Button onClick={saveTemperature} disabled={!currentTemp}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Take your temperature first thing in the morning before getting out of bed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ovulation Signs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">LH Test Result</label>
                <div className="grid grid-cols-4 gap-2">
                  {lhTestResults.map((result) => (
                    <Button
                      key={result.value}
                      variant={lhTest === result.value ? "default" : "outline"}
                      className="flex flex-col h-auto py-3"
                      onClick={() => setLhTest(result.value)}
                    >
                      <div className={`w-8 h-8 rounded-full ${result.color} mb-1`} />
                      <span className="text-xs">{result.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Cervical Mucus</label>
                <div className="grid grid-cols-5 gap-2">
                  {cervicalMucusTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={cervicalMucus === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCervicalMucus(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Input
                  placeholder="Any symptoms or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button onClick={saveOvulationData} className="w-full">
                Save Today's Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Temperature Chart */}
        <TabsContent value="temperature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basal Body Temperature Chart</CardTitle>
              <CardDescription>Track temperature changes throughout your cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[36, 38]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#f43f5e" strokeWidth={2} name="Temperature (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Temperatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {temperatureData.slice(-7).reverse().map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="font-medium">{entry.temperature.toFixed(2)}°C</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fertility Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fertility Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Best Time to Conceive", desc: "5 days before ovulation to 1 day after" },
                { title: "Track BBT", desc: "Temperature rises 0.5-1°F after ovulation" },
                { title: "Monitor Cervical Mucus", desc: "Egg-white mucus indicates high fertility" },
                { title: "Maintain Healthy Weight", desc: "BMI affects fertility in both partners" },
                { title: "Reduce Stress", desc: "High stress can impact ovulation" }
              ].map((tip, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Book Fertility Specialist
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Treatment Options
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
