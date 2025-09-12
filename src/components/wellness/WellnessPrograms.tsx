import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, Users, Play, CheckCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  program_type: string;
  duration_weeks: number;
  difficulty_level: string;
  rating: number;
  enrollment_count: number;
  cost: number;
  content: any;
}

interface ProgramEnrollment {
  id: string;
  program_id: string;
  status: string;
  completion_percentage: number;
  enrollment_date: string;
  progress_data: any;
}

export const WellnessPrograms = () => {
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [enrollments, setEnrollments] = useState<ProgramEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All Programs" },
    { id: "mental_health", label: "Mental Health" },
    { id: "fitness", label: "Fitness" },
    { id: "nutrition", label: "Nutrition" },
    { id: "meditation", label: "Meditation" },
    { id: "maternal", label: "Maternal Care" },
    { id: "chronic_disease", label: "Chronic Disease Management" }
  ];

  useEffect(() => {
    fetchPrograms();
    fetchEnrollments();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_programs')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wellness programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('program_enrollments')
        .select('*')
        .eq('patient_id', 'current_user_id'); // Replace with actual auth.uid()

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  const enrollInProgram = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('program_enrollments')
        .insert({
          patient_id: 'current_user_id', // Replace with actual auth.uid()
          program_id: programId,
          enrollment_date: new Date().toISOString(),
          status: 'active',
          completion_percentage: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in program!",
      });

      fetchEnrollments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in program",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = (programId: string) => {
    return enrollments.some(enrollment => enrollment.program_id === programId);
  };

  const getEnrollment = (programId: string) => {
    return enrollments.find(enrollment => enrollment.program_id === programId);
  };

  const filteredPrograms = programs.filter(program => 
    selectedCategory === "all" || program.program_type === selectedCategory
  );

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading programs...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wellness Programs</h1>
        <p className="text-muted-foreground">Personalized health and wellness programs for your journey</p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Programs</TabsTrigger>
          <TabsTrigger value="my-programs">My Programs ({enrollments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription className="mt-2">{program.description}</CardDescription>
                    </div>
                    <Badge 
                      className={`${getDifficultyColor(program.difficulty_level)} text-white`}
                    >
                      {program.difficulty_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {program.duration_weeks} weeks
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {program.enrollment_count}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {program.rating}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {program.cost === 0 ? "Free" : `₹${program.cost}`}
                        </p>
                      </div>
                      <Button
                        onClick={() => enrollInProgram(program.id)}
                        disabled={isEnrolled(program.id)}
                        className="flex items-center gap-2"
                      >
                        {isEnrolled(program.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Enrolled
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Enroll
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-programs" className="space-y-6">
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't enrolled in any programs yet</p>
                <Button onClick={() => (document.querySelector('[value="browse"]') as HTMLElement)?.click()}>
                  Browse Programs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const program = programs.find(p => p.id === enrollment.program_id);
                if (!program) return null;

                return (
                  <Card key={enrollment.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{program.name}</CardTitle>
                          <CardDescription>
                            Enrolled on {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{enrollment.completion_percentage}%</span>
                          </div>
                          <Progress value={enrollment.completion_percentage} className="w-full" />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {program.duration_weeks} weeks
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Week {Math.floor(enrollment.completion_percentage / (100 / program.duration_weeks)) + 1}
                            </div>
                          </div>
                          <Button size="sm">
                            Continue Program
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};