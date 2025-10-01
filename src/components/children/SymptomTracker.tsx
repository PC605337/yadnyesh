import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Smile, Meh, Frown, Heart, Brain, AlertCircle } from "lucide-react";

export default function SymptomTracker() {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState<any>(null);
  const [headache, setHeadache] = useState(0);
  const [dizziness, setDizziness] = useState(0);
  const [memoryIssues, setMemoryIssues] = useState(false);
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodayLog();
    }
  }, [user]);

  const loadTodayLog = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('child_id', user?.id)
        .eq('log_date', today)
        .maybeSingle();
      
      if (data) {
        setTodayLog(data);
        setHeadache(data.headache_level || 0);
        setDizziness(data.dizziness_level || 0);
        setMemoryIssues(data.memory_issues || false);
        setMood(data.mood_rating || 3);
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error('Error loading log:', error);
    }
  };

  const saveLog = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Award stickers based on completion
      const stickers = [];
      if (headache <= 3) stickers.push('low_headache');
      if (dizziness <= 3) stickers.push('low_dizziness');
      if (mood >= 4) stickers.push('happy_mood');
      stickers.push('daily_checkin');

      const { error } = await supabase
        .from('symptom_logs')
        .upsert({
          child_id: user?.id,
          log_date: today,
          headache_level: headache,
          dizziness_level: dizziness,
          memory_issues: memoryIssues,
          mood_rating: mood,
          notes: notes,
          stickers_earned: stickers
        });

      if (error) throw error;

      toast.success(`Great job! You earned ${stickers.length} stickers! 🌟`);
      loadTodayLog();
    } catch (error: any) {
      console.error('Error saving log:', error);
      toast.error('Oops! Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const PainScale = ({ value, onChange, icon: Icon, label, color }: any) => (
    <Card className={`${color} border-4 shadow-lg`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon className="h-6 w-6" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold">No Pain 😊</span>
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-white font-bold">Very Bad 😢</span>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <Button
              key={level}
              onClick={() => onChange(level)}
              className={`flex-1 h-12 text-lg font-bold ${
                value === level 
                  ? 'bg-white text-primary scale-110' 
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              variant="outline"
            >
              {level}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MoodSelector = () => {
    const moods = [
      { value: 1, icon: "😢", label: "Very Sad", color: "bg-red-400" },
      { value: 2, icon: "🙁", label: "Sad", color: "bg-orange-400" },
      { value: 3, icon: "😐", label: "Okay", color: "bg-yellow-400" },
      { value: 4, icon: "🙂", label: "Good", color: "bg-green-400" },
      { value: 5, icon: "😄", label: "Great!", color: "bg-blue-400" }
    ];

    return (
      <Card className="bg-gradient-to-r from-purple-400 to-pink-500 border-4 border-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Heart className="h-6 w-6" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {moods.map((m) => (
              <Button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`${m.color} hover:scale-110 transition-transform h-24 flex flex-col gap-2 ${
                  mood === m.value ? 'ring-4 ring-white scale-110' : ''
                }`}
              >
                <span className="text-4xl">{m.icon}</span>
                <span className="text-sm font-bold text-white">{m.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">📝</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Daily Check-In</h2>
              <p className="text-xl text-white/90">
                Tell us how you're feeling today and earn stickers!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MoodSelector />

      <PainScale
        value={headache}
        onChange={setHeadache}
        icon={Brain}
        label="Head Hurting?"
        color="bg-gradient-to-br from-red-400 to-pink-500"
      />

      <PainScale
        value={dizziness}
        onChange={setDizziness}
        icon={AlertCircle}
        label="Feeling Dizzy?"
        color="bg-gradient-to-br from-blue-400 to-purple-500"
      />

      <Card className="bg-green-100 border-4 border-green-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Brain className="h-6 w-6" />
            Can you remember things okay today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => setMemoryIssues(false)}
              className={`flex-1 h-20 text-xl ${
                !memoryIssues 
                  ? 'bg-green-500 text-white scale-105' 
                  : 'bg-white text-green-900'
              }`}
            >
              <span className="mr-2">✅</span> Yes, I'm good!
            </Button>
            <Button
              onClick={() => setMemoryIssues(true)}
              className={`flex-1 h-20 text-xl ${
                memoryIssues 
                  ? 'bg-orange-500 text-white scale-105' 
                  : 'bg-white text-orange-900'
              }`}
            >
              <span className="mr-2">🤔</span> A little tricky
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-100 border-4 border-blue-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Anything else you want to tell us?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us about your day... what did you do? How did you feel?"
            className="min-h-32 text-lg border-2 border-blue-300"
          />
        </CardContent>
      </Card>

      <Button
        onClick={saveLog}
        disabled={loading}
        className="w-full h-16 text-2xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-xl"
      >
        {loading ? '⏳ Saving...' : '✨ Save & Get Stickers!'}
      </Button>

      {todayLog && todayLog.stickers_earned && (
        <Card className="bg-yellow-100 border-4 border-yellow-400 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">
              🎉 Your Stickers Today!
            </h3>
            <div className="flex gap-4 flex-wrap">
              {todayLog.stickers_earned.map((sticker: string, i: number) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                  <span className="text-4xl">⭐</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
