import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Calendar, 
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CareTask {
  id: string;
  type: "appointment" | "medication" | "test" | "followup";
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "overdue";
  aiGenerated: boolean;
}

interface CareRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  actions: string[];
}

export function AICareCoordination() {
  const [careTasks, setCareTasks] = useState<CareTask[]>([
    {
      id: "1",
      type: "appointment",
      title: "Annual Health Checkup Due",
      description: "Based on your last checkup 11 months ago, it's time for your annual physical examination.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "pending",
      aiGenerated: true
    },
    {
      id: "2",
      type: "medication",
      title: "Prescription Refill Reminder",
      description: "Your Metformin prescription will run out in 3 days. Schedule a refill.",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "pending",
      aiGenerated: true
    },
    {
      id: "3",
      type: "test",
      title: "Blood Sugar Follow-up Test",
      description: "Your doctor recommended a follow-up HbA1c test based on your diabetes management.",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      status: "pending",
      aiGenerated: true
    }
  ]);

  const [recommendations, setRecommendations] = useState<CareRecommendation[]>([
    {
      id: "1",
      category: "Preventive Care",
      title: "Cardiovascular Health Assessment",
      description: "Based on your age (45) and family history, we recommend a cardiovascular health screening.",
      confidence: 85,
      actions: [
        "Schedule ECG and lipid profile",
        "Consult with a cardiologist",
        "Review diet and exercise plan"
      ]
    },
    {
      id: "2",
      category: "Mental Wellbeing",
      title: "Stress Management Program",
      description: "Your recent mood tracking data suggests elevated stress levels. Consider stress management techniques.",
      confidence: 78,
      actions: [
        "Join mindfulness meditation sessions",
        "Consider therapy consultation",
        "Practice daily relaxation exercises"
      ]
    }
  ]);

  const [healthInsights] = useState({
    overallScore: 76,
    trend: "improving",
    riskFactors: 2,
    activeGoals: 5,
    completedTasks: 12,
    upcomingTasks: 3
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "";
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "appointment": return Calendar;
      case "medication": return Bell;
      case "test": return FileText;
      case "followup": return Users;
      default: return CheckCircle;
    }
  };

  const completeTask = (taskId: string) => {
    setCareTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: "completed" as const }
          : task
      )
    );
    toast({
      title: "Task Completed",
      description: "Great job staying on top of your health!"
    });
  };

  const dismissRecommendation = (recId: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recId));
  };

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `in ${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-800">
            <Bot className="h-6 w-6" />
            AI Care Coordinator
          </CardTitle>
          <CardDescription className="text-violet-700">
            Your intelligent health assistant that helps you stay on track with personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{healthInsights.overallScore}</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
            <Badge className="mt-2" variant="default">
              <TrendingUp className="h-3 w-3 mr-1" />
              {healthInsights.trend}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-healing-green">{healthInsights.completedTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-accent">{healthInsights.upcomingTasks}</div>
            <div className="text-sm text-muted-foreground">Upcoming Tasks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{healthInsights.riskFactors}</div>
            <div className="text-sm text-muted-foreground">Risk Factors</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommended Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Care Tasks</span>
            <Badge variant="outline">
              {careTasks.filter(t => t.status !== "completed").length} Active
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to help you manage your health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {careTasks
              .filter(task => task.status !== "completed")
              .map((task) => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <Card key={task.id} className={`border-2 ${getPriorityColor(task.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <TaskIcon className="h-5 w-5 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{task.title}</h4>
                              {task.aiGenerated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Bot className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Due {getDaysUntil(task.dueDate)}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Personalized Health Recommendations
          </CardTitle>
          <CardDescription>
            Based on your health data and medical history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-2 border-violet-200 bg-violet-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{rec.category}</Badge>
                      <h4 className="font-semibold text-lg">{rec.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-violet-700">
                        {rec.confidence}% confidence
                      </div>
                      <Progress value={rec.confidence} className="w-20 h-1 mt-1" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-healing-green mt-0.5 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      Take Action
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => dismissRecommendation(rec.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {careTasks.filter(t => t.status === "completed").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {careTasks
                .filter(task => task.status === "completed")
                .map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-healing-green" />
                      <span className="text-sm line-through text-muted-foreground">{task.title}</span>
                    </div>
                    <Badge variant="outline" className="text-healing-green border-healing-green">
                      Completed
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
