import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Shield,
  Calendar,
  DollarSign,
  Activity,
  Target,
  BarChart3,
  Settings
} from "lucide-react";

interface WellnessProgram {
  id: string;
  name: string;
  participants: number;
  totalEmployees: number;
  status: "active" | "scheduled" | "completed";
  completion: number;
}

interface HealthMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

export function CorporateDashboard() {
  const wellnessPrograms: WellnessProgram[] = [
    {
      id: "1",
      name: "Annual Health Checkups",
      participants: 145,
      totalEmployees: 250,
      status: "active",
      completion: 58
    },
    {
      id: "2", 
      name: "Mental Health Workshop",
      participants: 87,
      totalEmployees: 250,
      status: "scheduled",
      completion: 0
    },
    {
      id: "3",
      name: "Fitness Challenge Q1",
      participants: 203,
      totalEmployees: 250,
      status: "completed",
      completion: 100
    }
  ];

  const healthMetrics: HealthMetric[] = [
    {
      label: "Healthcare Utilization",
      value: "67%",
      change: "+12%",
      trend: "up"
    },
    {
      label: "Avg. Claims per Employee",
      value: "₹18,500",
      change: "-8%",
      trend: "down"
    },
    {
      label: "Preventive Care Adoption",
      value: "84%",
      change: "+15%",
      trend: "up"
    },
    {
      label: "Employee Satisfaction",
      value: "4.2/5",
      change: "+0.3",
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">TechCorp India - HR Dashboard</h1>
            <p className="opacity-90">Employee wellness program overview and analytics</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Total Employees</p>
            <p className="text-2xl font-bold">250</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrolled</p>
                <p className="text-2xl font-bold">238</p>
                <p className="text-xs text-healing-green">95% of workforce</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">₹4.2L</p>
                <p className="text-xs text-healing-green">vs last quarter</p>
              </div>
              <DollarSign className="h-8 w-8 text-healing-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-accent">2 launching soon</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-trust-purple">monthly average</p>
              </div>
              <Target className="h-8 w-8 text-trust-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wellness Programs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Wellness Programs
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </div>
              <CardDescription>
                Track employee participation and program effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wellnessPrograms.map((program) => (
                <div key={program.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.participants} / {program.totalEmployees} employees
                      </p>
                    </div>
                    <Badge variant={
                      program.status === "active" ? "default" : 
                      program.status === "scheduled" ? "secondary" : 
                      "outline"
                    }>
                      {program.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Participation</span>
                      <span>{Math.round((program.participants / program.totalEmployees) * 100)}%</span>
                    </div>
                    <Progress value={(program.participants / program.totalEmployees) * 100} />
                  </div>

                  {program.status === "active" && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-muted-foreground">
                        Completion: {program.completion}%
                      </span>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Health Analytics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Health Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{metric.label}</p>
                    <Badge variant="outline" className={
                      metric.trend === "up" ? "bg-healing-green/10 text-healing-green" : 
                      metric.trend === "down" ? "bg-primary/10 text-primary" : 
                      "bg-muted"
                    }>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        metric.trend === "down" ? "rotate-180" : ""
                      }`} />
                      {metric.change}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Enroll Employees
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Program
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Insurance Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROI & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Return on Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Program Investment</span>
                <span className="font-semibold">₹12,50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Healthcare Savings</span>
                <span className="font-semibold text-healing-green">₹18,75,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Productivity Gains</span>
                <span className="font-semibold text-healing-green">₹8,25,000</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="font-medium">Net ROI</span>
                <span className="text-lg font-bold text-healing-green">116%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium">High Engagement</p>
                <p className="text-xs text-muted-foreground">Mental health programs show 89% participation</p>
              </div>
              
              <div className="p-3 bg-healing-green/5 rounded-lg border-l-4 border-healing-green">
                <p className="text-sm font-medium">Cost Reduction</p>
                <p className="text-xs text-muted-foreground">Preventive care reduced claims by 23%</p>
              </div>
              
              <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                <p className="text-sm font-medium">Action Needed</p>
                <p className="text-xs text-muted-foreground">Low participation in fitness programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}