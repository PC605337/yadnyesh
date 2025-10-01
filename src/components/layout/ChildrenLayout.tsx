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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-pink-300 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-bounce">
                {getAvatarEmoji(profile?.avatar_character || 'friendly_bear')}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  My Recovery Journey
                </h1>
                <p className="text-sm text-muted-foreground">
                  You're doing great! Keep it up! 🌟
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTextToSpeech(!textToSpeech)}
              className={textToSpeech ? "bg-primary text-primary-foreground" : ""}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b-2 border-purple-200 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${item.color} hover:scale-110 transition-transform text-white shadow-lg flex-shrink-0`}
                size="lg"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
