import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Star, Trophy, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ChildrenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    stickersEarned: 0,
    gamesPlayed: 0,
    daysTracked: 0,
    totalBadges: 0
  });
  const [todayLog, setTodayLog] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadStats();
      checkTodayLog();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Get symptom logs count
      const { data: logs } = await supabase
        .from('symptom_logs')
        .select('stickers_earned')
        .eq('child_id', user?.id);

      // Get activities count
      const { data: activities } = await supabase
        .from('rehabilitation_activities')
        .select('badges_earned')
        .eq('child_id', user?.id);

      const stickers = logs?.reduce((acc, log) => {
        const earned = Array.isArray(log.stickers_earned) ? log.stickers_earned.length : 0;
        return acc + earned;
      }, 0) || 0;
      
      const badges = activities?.reduce((acc, act) => {
        const earned = Array.isArray(act.badges_earned) ? act.badges_earned.length : 0;
        return acc + earned;
      }, 0) || 0;

      setStats({
        stickersEarned: stickers,
        gamesPlayed: activities?.length || 0,
        daysTracked: logs?.length || 0,
        totalBadges: badges
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkTodayLog = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('child_id', user?.id)
        .eq('log_date', today)
        .maybeSingle();
      
      setTodayLog(data);
    } catch (error) {
      console.error('Error checking today log:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <Card className={`${color} border-4 shadow-xl hover:scale-105 transition-transform`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Icon className="h-12 w-12 text-white" />
          <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/90 font-medium">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-pink-400 to-purple-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl animate-bounce">👋</span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, Champion!
              </h2>
              <p className="text-xl text-white/90">
                {todayLog 
                  ? "Great job logging your feelings today! 🌟" 
                  : "Let's check in on how you're feeling today!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Check-in Reminder */}
      {!todayLog && (
        <Card className="bg-yellow-100 border-4 border-yellow-400 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-900">
                    Time to check in!
                  </h3>
                  <p className="text-yellow-800">
                    Tell me how you're feeling today and earn a sticker! ⭐
                  </p>
                </div>
              </div>
              <Button 
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => navigate('/children/symptoms')}
              >
                Let's Go! 🚀
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Star} 
          title="Stickers" 
          value={stats.stickersEarned}
          color="bg-gradient-to-br from-yellow-400 to-orange-500"
        />
        <StatCard 
          icon={Trophy} 
          title="Badges" 
          value={stats.totalBadges}
          color="bg-gradient-to-br from-blue-400 to-purple-500"
        />
        <StatCard 
          icon={Heart} 
          title="Check-ins" 
          value={stats.daysTracked}
          color="bg-gradient-to-br from-pink-400 to-red-500"
        />
        <StatCard 
          icon={Sparkles} 
          title="Games Played" 
          value={stats.gamesPlayed}
          color="bg-gradient-to-br from-green-400 to-teal-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-purple-100 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Sparkles className="h-6 w-6" />
              Play Fun Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 mb-4">
              Play memory games, puzzles, and fun activities to help your brain!
            </p>
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => navigate('/children/games')}
            >
              Let's Play! 🎮
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 border-4 border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Heart className="h-6 w-6" />
              Family Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              See messages from your family and check your calendar!
            </p>
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate('/children/caregiver')}
            >
              Check Messages 💌
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-green-100 border-4 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Trophy className="h-6 w-6" />
              School Helper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 mb-4">
              Tips for going back to school and talking to your teachers!
            </p>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => navigate('/children/school')}
            >
              School Info 📚
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
