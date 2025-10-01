import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { School, BookOpen, Clock, Volume2, Sun, Users } from "lucide-react";

export default function SchoolPortal() {
  const { user } = useAuth();
  const [accommodations, setAccommodations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAccommodations();
    }
  }, [user]);

  const loadAccommodations = async () => {
    try {
      const { data, error } = await supabase
        .from('school_accommodations')
        .select('*')
        .eq('child_id', user?.id)
        .eq('is_active', true);

      if (data) {
        setAccommodations(data);
      }
    } catch (error) {
      console.error('Error loading accommodations:', error);
    }
  };

  const tips = [
    {
      icon: Clock,
      title: "Take Your Time",
      description: "It's okay to work slower. Your brain is healing!",
      color: "bg-blue-400"
    },
    {
      icon: Volume2,
      title: "Ask for Quiet",
      description: "Tell your teacher if it's too noisy.",
      color: "bg-purple-400"
    },
    {
      icon: Sun,
      title: "Take Breaks",
      description: "Rest when you need to. It helps your brain!",
      color: "bg-yellow-400"
    },
    {
      icon: Users,
      title: "Talk to Friends",
      description: "Your friends want to help you!",
      color: "bg-green-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">📚</span>
            <div>
              <h2 className="text-3xl font-bold text-white">School Helper</h2>
              <p className="text-xl text-white/90">
                Tips to make school easier while you're getting better!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for School */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <Card 
            key={index}
            className={`${tip.color} border-4 border-white shadow-lg`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <tip.icon className="h-6 w-6" />
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accommodations */}
      {accommodations.length > 0 && (
        <Card className="bg-purple-100 border-4 border-purple-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <School className="h-6 w-6" />
              Special Help at School
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 mb-4">
              Your teacher knows you need these special helps:
            </p>
            <div className="space-y-3">
              {accommodations.map((acc) => (
                <div 
                  key={acc.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h4 className="font-bold text-purple-900 mb-1">
                    {acc.accommodation_type}
                  </h4>
                  <p className="text-purple-800">{acc.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Things to Tell Your Teacher */}
      <Card className="bg-orange-100 border-4 border-orange-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <BookOpen className="h-6 w-6" />
            Tell Your Teacher If...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">🤕</span>
              <span className="text-orange-900 font-bold">Your head hurts</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">😵</span>
              <span className="text-orange-900 font-bold">You feel dizzy</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">😴</span>
              <span className="text-orange-900 font-bold">You're very tired</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">😕</span>
              <span className="text-orange-900 font-bold">It's hard to remember things</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">🔊</span>
              <span className="text-orange-900 font-bold">It's too noisy or bright</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Going Back to School */}
      <Card className="bg-pink-100 border-4 border-pink-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-900">
            Returning to School
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-pink-800 text-lg">
              Going back to school is a big step! Remember:
            </p>
            <ul className="space-y-2 text-pink-900">
              <li className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Start slow - maybe half days at first</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <span>You're getting stronger every day</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🤗</span>
                <span>Your teachers and friends are there to help</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span>You can go home if you need to rest</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Card */}
      <Card className="bg-red-100 border-4 border-red-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-900">
            🚨 Important! 🚨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 text-lg font-bold mb-4">
            If you feel really bad at school, tell your teacher right away!
          </p>
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-900 mb-2">
              Always tell a grown-up if:
            </p>
            <p className="text-xl text-red-800">
              Your head hurts a lot 🤕<br />
              You feel really dizzy 😵<br />
              You want to throw up 🤢<br />
              You feel confused 😕
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
