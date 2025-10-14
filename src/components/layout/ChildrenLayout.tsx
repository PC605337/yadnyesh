import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Gamepad2, Users, School, Book, Star, Volume2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChildrenLayoutProps {
  children: ReactNode;
}

export default function ChildrenLayout({ children }: ChildrenLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [textToSpeech, setTextToSpeech] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('children_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (data) {
        setProfile(data);
        const settings = data.accessibility_settings as any;
        setTextToSpeech(settings?.textToSpeech || false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const navigationItems = [
    { name: "Home", path: "/children", icon: Heart, color: "bg-pink-500" },
    { name: "My Feelings", path: "/children/symptoms", icon: Star, color: "bg-yellow-500" },
    { name: "Fun Games", path: "/children/games", icon: Gamepad2, color: "bg-purple-500" },
    { name: "My Family", path: "/children/caregiver", icon: Users, color: "bg-blue-500" },
    { name: "School", path: "/children/school", icon: School, color: "bg-green-500" },
    { name: "Friends", path: "/children/friends", icon: Book, color: "bg-orange-500" },
  ];

  const getAvatarEmoji = (character: string) => {
    const avatars: Record<string, string> = {
      friendly_bear: "🐻",
      happy_cat: "🐱",
      brave_lion: "🦁",
      wise_owl: "🦉",
      playful_dolphin: "🐬",
      cheerful_panda: "🐼"
    };
    return avatars[character] || "🐻";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 relative overflow-hidden">
      {/* Playful animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-4 border-pink-300 dark:border-pink-700 shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <span className="relative text-6xl animate-bounce inline-block">
                  {getAvatarEmoji(profile?.avatar_character || 'friendly_bear')}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  My Recovery Journey
                </h1>
                <p className="text-base text-muted-foreground font-medium">
                  You're doing amazing! Keep it up! 🌟
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTextToSpeech(!textToSpeech)}
              className={`h-12 w-12 rounded-xl border-2 transition-all duration-300 ${textToSpeech ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-400 shadow-lg" : "hover:border-purple-300"}`}
            >
              <Volume2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${item.color} hover:scale-110 active:scale-95 transition-all duration-300 text-white shadow-lg hover:shadow-xl flex-shrink-0 rounded-2xl h-14 px-6 font-bold text-base border-2 border-white/30`}
                size="lg"
              >
                <item.icon className="h-6 w-6 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
