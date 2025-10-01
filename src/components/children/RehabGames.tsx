import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Gamepad2, Trophy, Zap, Target } from "lucide-react";

export default function RehabGames() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const games = [
    {
      id: "memory",
      name: "Memory Match",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      description: "Match the cards and improve your memory!",
      difficulty: "Easy"
    },
    {
      id: "reaction",
      name: "Quick Click",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      description: "Test your reaction time!",
      difficulty: "Medium"
    },
    {
      id: "puzzle",
      name: "Picture Puzzle",
      icon: Target,
      color: "from-blue-400 to-cyan-500",
      description: "Complete the puzzle!",
      difficulty: "Easy"
    },
    {
      id: "sequence",
      name: "Pattern Game",
      icon: Gamepad2,
      color: "from-green-400 to-teal-500",
      description: "Remember the pattern!",
      difficulty: "Hard"
    }
  ];

  const saveActivity = async (gameName: string, gameScore: number, duration: number) => {
    try {
      const badges = [];
      if (gameScore >= 80) badges.push('high_score');
      if (gameScore === 100) badges.push('perfect_score');
      badges.push('game_completed');

      const { error } = await supabase
        .from('rehabilitation_activities')
        .insert({
          child_id: user?.id,
          activity_type: 'cognitive',
          activity_name: gameName,
          score: gameScore,
          duration_minutes: duration,
          badges_earned: badges
        });

      if (error) throw error;

      toast.success(`Amazing! You earned ${badges.length} badges! 🏆`);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const GameCard = ({ game }: any) => (
    <Card 
      className={`bg-gradient-to-br ${game.color} border-4 border-white shadow-xl hover:scale-105 transition-transform cursor-pointer`}
      onClick={() => setSelectedGame(game.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <game.icon className="h-8 w-8" />
          {game.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/90 mb-2 text-lg">{game.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white bg-white/20 px-3 py-1 rounded-full">
            {game.difficulty}
          </span>
          <Button className="bg-white text-primary hover:bg-white/90">
            Play Now! 🎮
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Simple Memory Game Implementation
  const MemoryGame = () => {
    const [cards, setCards] = useState<string[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
      initGame();
    }, []);

    const initGame = () => {
      const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
      const gameCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      setCards(gameCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
    };

    const handleCardClick = (index: number) => {
      if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [first, second] = newFlipped;
        if (cards[first] === cards[second]) {
          setMatched([...matched, first, second]);
          setFlipped([]);
          if (matched.length + 2 === cards.length) {
            const finalScore = Math.max(0, 100 - moves * 2);
            saveActivity('Memory Match', finalScore, 5);
            toast.success('🎉 You won! Great memory!');
          }
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-400 to-pink-500 border-4 border-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-2xl font-bold">Memory Match Game</h3>
                <p className="text-lg">Moves: {moves}</p>
              </div>
              <Button onClick={initGame} className="bg-white text-primary">
                New Game 🔄
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`h-24 text-4xl ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500'
              }`}
              disabled={matched.includes(index)}
            >
              {flipped.includes(index) || matched.includes(index) ? card : '?'}
            </Button>
          ))}
        </div>

        <Button 
          onClick={() => setSelectedGame(null)}
          className="w-full bg-gradient-to-r from-red-400 to-pink-500"
        >
          Back to Games
        </Button>
      </div>
    );
  };

  if (selectedGame === 'memory') {
    return <MemoryGame />;
  }

  if (selectedGame && selectedGame !== 'memory') {
    return (
      <Card className="bg-yellow-100 border-4 border-yellow-400">
        <CardContent className="p-12 text-center">
          <span className="text-6xl mb-4 block">🎮</span>
          <h3 className="text-2xl font-bold text-yellow-900 mb-4">
            Coming Soon!
          </h3>
          <p className="text-yellow-800 mb-6">
            This game is being built just for you! Check back soon!
          </p>
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">🎮</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Fun Games</h2>
              <p className="text-xl text-white/90">
                Play games to help your brain get stronger!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <Card className="bg-yellow-100 border-4 border-yellow-400 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Trophy className="h-6 w-6" />
            Physical Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800 text-lg mb-4">
            Don't forget to do your physical exercises too! Ask your parent or therapist which ones to do today! 💪
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-yellow-500 hover:bg-yellow-600 h-16">
              <span className="mr-2">🧘</span> Gentle Stretches
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 h-16">
              <span className="mr-2">👁️</span> Eye Exercises
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 h-16">
              <span className="mr-2">⚖️</span> Balance Practice
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 h-16">
              <span className="mr-2">🚶</span> Walking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
