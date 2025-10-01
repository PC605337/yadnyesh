import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Star, MessageCircle } from "lucide-react";

export default function PeerSupport() {
  const stories = [
    {
      name: "Emma",
      age: 10,
      story: "I had a concussion playing soccer. It was scary at first, but now I'm better! Games helped me a lot!",
      avatar: "⚽",
      color: "bg-green-400"
    },
    {
      name: "Lucas",
      age: 8,
      story: "I bumped my head really hard. My family helped me every day. Now I can play with my friends again!",
      avatar: "🎮",
      color: "bg-blue-400"
    },
    {
      name: "Mia",
      age: 9,
      story: "Going back to school was hard, but my teacher was really nice. Taking breaks helped me!",
      avatar: "📚",
      color: "bg-purple-400"
    },
    {
      name: "Noah",
      age: 11,
      story: "The symptom tracker helped me see that I was getting better each day. Don't give up!",
      avatar: "⭐",
      color: "bg-yellow-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-orange-400 to-pink-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">👫</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Friends Like You</h2>
              <p className="text-xl text-white/90">
                Stories from other kids who got better!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-100 border-4 border-green-300 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <span className="text-5xl mb-4 block">💚</span>
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              You're Not Alone!
            </h3>
            <p className="text-green-800 text-lg">
              Lots of kids have had head injuries and they all got better, just like you will! 
              Here are their stories to help you feel better. 🌟
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story, index) => (
          <Card 
            key={index}
            className={`${story.color} border-4 border-white shadow-lg`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-4xl">{story.avatar}</span>
                <div>
                  <div className="font-bold">{story.name}</div>
                  <div className="text-sm font-normal">Age {story.age}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-lg bg-white/20 p-4 rounded-lg">
                "{story.story}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Helpful Tips from Kids */}
      <Card className="bg-blue-100 border-4 border-blue-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Star className="h-6 w-6" />
            Tips from Other Kids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">💤</span>
              <span className="text-blue-900">"Rest a lot! Your brain needs it to heal."</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">🎮</span>
              <span className="text-blue-900">"The games are actually fun! They helped me get better."</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">👨‍👩‍👧</span>
              <span className="text-blue-900">"Talk to your family when you don't feel good."</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">📱</span>
              <span className="text-blue-900">"Don't use your phone or tablet too much at first."</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl mr-2">🌈</span>
              <span className="text-blue-900">"It gets better every day! Be patient with yourself."</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Support */}
      <Card className="bg-purple-100 border-4 border-purple-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Users className="h-6 w-6" />
            Find Local Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-800 text-lg mb-4">
            There are places near you that help kids like you! Ask your parents about:
          </p>
          <div className="space-y-3">
            <Button className="w-full justify-start bg-purple-500 hover:bg-purple-600 text-white h-14">
              <span className="text-2xl mr-3">🏥</span>
              <span className="text-left">TBI Support Groups for Kids</span>
            </Button>
            <Button className="w-full justify-start bg-purple-500 hover:bg-purple-600 text-white h-14">
              <span className="text-2xl mr-3">🧠</span>
              <span className="text-left">Brain Injury Rehabilitation Centers</span>
            </Button>
            <Button className="w-full justify-start bg-purple-500 hover:bg-purple-600 text-white h-14">
              <span className="text-2xl mr-3">👨‍⚕️</span>
              <span className="text-left">Pediatric Neurologists</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Positive Messages */}
      <Card className="bg-gradient-to-r from-pink-400 to-red-400 border-4 border-white shadow-lg">
        <CardContent className="p-8 text-center">
          <span className="text-6xl mb-4 block">🌟</span>
          <h3 className="text-3xl font-bold text-white mb-4">
            You're Doing Amazing!
          </h3>
          <p className="text-xl text-white/90">
            Every day you're getting stronger. Keep going, superstar! 
            Your family and friends are so proud of you! 💪✨
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
