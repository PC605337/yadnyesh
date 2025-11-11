import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp,
  Calendar,
  Phone,
  MessageCircle,
  BookOpen,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  sleep_hours: number;
  notes: string;
}

interface TherapySession {
  date: string;
  therapist: string;
  duration: number;
  notes: string;
  progress_rating: number;
}

export function MentalHealthSupport() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState(3);
  const [currentEnergy, setCurrentEnergy] = useState(3);
  const [sleepHours, setSleepHours] = useState("");
  const [moodNotes, setMoodNotes] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState(0);
  const [depressionScreening, setDepressionScreening] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const moodIcons = [
    { level: 1, icon: Frown, label: "Very Low", color: "text-red-500" },
    { level: 2, icon: Frown, label: "Low", color: "text-orange-500" },
    { level: 3, icon: Meh, label: "Neutral", color: "text-yellow-500" },
    { level: 4, icon: Smile, label: "Good", color: "text-green-500" },
    { level: 5, icon: Smile, label: "Great", color: "text-emerald-500" }
  ];

  const emergencyContacts = [
    { name: "National Mental Health Helpline", number: "1800-599-0019", available: "24/7" },
    { name: "Suicide Prevention Helpline", number: "9152987821", available: "24/7" },
    { name: "NIMHANS Helpline", number: "080-46110007", available: "Mon-Sat 8AM-6PM" }
  ];

  const copingStrategies = [
    { title: "Deep Breathing", description: "5-minute breathing exercises", icon: Activity },
    { title: "Journaling", description: "Write down your thoughts", icon: BookOpen },
    { title: "Talk to Someone", description: "Connect with a friend or therapist", icon: MessageCircle },
    { title: "Physical Exercise", description: "30 minutes of movement", icon: TrendingUp }
  ];

  useEffect(() => {
    if (user) {
      loadMentalHealthData();
    }
  }, [user]);

  const loadMentalHealthData = async () => {
    try {
      const { data, error } = await supabase
        .from('mental_health_records')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const record = data[0];
        const moodData = record.mood_tracking as any;
        setMoodHistory(Array.isArray(moodData) ? moodData : []);
        const anxietyData = record.anxiety_levels as any;
        setAnxietyLevel(Array.isArray(anxietyData) && anxietyData.length > 0 
          ? anxietyData[anxietyData.length - 1].level 
          : 0);
      }
    } catch (error) {
      console.error('Error loading mental health data:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (!user) return;

    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      energy: currentEnergy,
      sleep_hours: parseFloat(sleepHours) || 0,
      notes: moodNotes
    };

    try {
      const { data: existingRecord } = await supabase
        .from('mental_health_records')
        .select('*')
        .eq('patient_id', user.id)
        .single();

      const existingMoodData = existingRecord?.mood_tracking as any;
      const updatedMoodHistory = [...(Array.isArray(existingMoodData) ? existingMoodData : []), newEntry];

      if (existingRecord) {
        await supabase
          .from('mental_health_records')
          .update({ mood_tracking: updatedMoodHistory as any })
          .eq('id', existingRecord.id);
      } else {
        await supabase
          .from('mental_health_records')
          .insert({
            patient_id: user.id,
            mood_tracking: [newEntry] as any
          });
      }

      setMoodHistory(updatedMoodHistory);
      setMoodNotes("");
      setSleepHours("");

      toast({
        title: "Mood Saved",
        description: "Your mood entry has been recorded successfully."
      });
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry.",
        variant: "destructive"
      });
    }
  };

  const calculateAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodHistory.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return "stable";
    const recent = moodHistory.slice(-7);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const avgFirst = firstHalf.reduce((acc, e) => acc + e.mood, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((acc, e) => acc + e.mood, 0) / secondHalf.length;
    
    if (avgSecond > avgFirst + 0.3) return "improving";
    if (avgSecond < avgFirst - 0.3) return "declining";
    return "stable";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-6 w-6" />
            Mental Health Support
          </CardTitle>
          <CardDescription className="text-purple-700">
            Track your mental wellbeing and access professional support
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{calculateAverageMood()}</div>
            <div className="text-sm text-muted-foreground">Average Mood (7 days)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Badge variant={getMoodTrend() === "improving" ? "default" : getMoodTrend() === "declining" ? "destructive" : "secondary"}>
              {getMoodTrend().toUpperCase()}
            </Badge>
            <div className="text-sm text-muted-foreground mt-2">Mood Trend</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-healing-green">{moodHistory.length}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tracker">Mood Tracker</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Mood Tracker */}
        <TabsContent value="tracker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Select your mood</label>
                <div className="flex justify-between gap-2">
                  {moodIcons.map(({ level, icon: Icon, label, color }) => (
                    <Button
                      key={level}
                      variant={currentMood === level ? "default" : "outline"}
                      className="flex-1 flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => setCurrentMood(level)}
                    >
                      <Icon className={`h-8 w-8 ${currentMood === level ? 'text-white' : color}`} />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Energy Level</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentEnergy}
                    onChange={(e) => setCurrentEnergy(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Very Low</span>
                    <span>Low</span>
                    <span>Neutral</span>
                    <span>High</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hours of Sleep Last Night</label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g., 7.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Textarea
                  placeholder="What's on your mind today?"
                  rows={4}
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                />
              </div>

              <Button onClick={saveMoodEntry} className="w-full">
                Save Mood Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood patterns over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodHistory.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                    <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coping Strategies</CardTitle>
              <CardDescription>Quick activities to improve your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copingStrategies.map((strategy, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <strategy.icon className="h-8 w-8 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">{strategy.title}</h4>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Support</CardTitle>
              <CardDescription>Connect with mental health professionals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Book Therapy Session
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with Counselor
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Self-Help Resources
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Reading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Understanding Anxiety and Depression",
                "Mindfulness and Meditation Guide",
                "Building Healthy Coping Mechanisms",
                "Sleep Hygiene and Mental Health"
              ].map((article, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <h4 className="font-medium">{article}</h4>
                  <p className="text-sm text-muted-foreground">5 min read</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency */}
        <TabsContent value="emergency" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Crisis Support</CardTitle>
              <CardDescription className="text-red-700">
                If you're experiencing a mental health emergency, please reach out immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.available}</p>
                      </div>
                      <Button asChild>
                        <a href={`tel:${contact.number}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          {contact.number}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Plan</CardTitle>
              <CardDescription>Steps to take when you're in distress</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3">
                <li className="text-sm">Remove yourself from stressful situation</li>
                <li className="text-sm">Call someone you trust from your support network</li>
                <li className="text-sm">Use grounding techniques (5-4-3-2-1 method)</li>
                <li className="text-sm">Contact crisis helpline if thoughts worsen</li>
                <li className="text-sm">Go to nearest hospital if in immediate danger</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
