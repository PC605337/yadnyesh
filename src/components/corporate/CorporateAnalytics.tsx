import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Activity, Heart, DollarSign, Calendar, Target } from "lucide-react";

export function CorporateAnalytics() {
  // Mock data for analytics
  const healthMetrics = [
    { month: "Jan", avgScore: 72, screenings: 45, claims: 12 },
    { month: "Feb", avgScore: 75, screenings: 52, claims: 8 },
    { month: "Mar", avgScore: 78, screenings: 48, claims: 15 },
    { month: "Apr", avgScore: 80, screenings: 60, claims: 6 },
    { month: "May", avgScore: 82, screenings: 55, claims: 10 },
    { month: "Jun", avgScore: 85, screenings: 68, claims: 4 }
  ];

  const programParticipation = [
    { name: "Fitness", value: 120, color: "#3b82f6" },
    { name: "Mental Health", value: 85, color: "#8b5cf6" },
    { name: "Nutrition", value: 60, color: "#10b981" },
    { name: "Preventive Care", value: 200, color: "#f59e0b" }
  ];

  const departmentHealth = [
    { department: "Engineering", employees: 80, avgHealth: 78, programs: 3.2, claims: 5 },
    { department: "Sales", employees: 45, avgHealth: 72, programs: 2.8, claims: 8 },
    { department: "Marketing", employees: 25, avgHealth: 85, programs: 4.1, claims: 2 },
    { department: "HR", employees: 15, avgHealth: 88, programs: 4.5, claims: 1 },
    { department: "Finance", employees: 30, avgHealth: 75, programs: 3.0, claims: 4 }
  ];

  const costSavings = [
    { quarter: "Q1", traditional: 180000, withPrograms: 120000, savings: 60000 },
    { quarter: "Q2", traditional: 195000, withPrograms: 125000, savings: 70000 },
    { quarter: "Q3", traditional: 210000, withPrograms: 130000, savings: 80000 },
    { quarter: "Q4", traditional: 225000, withPrograms: 135000, savings: 90000 }
  ];

  const riskDistribution = [
    { risk: "Low", count: 145, percentage: 74 },
    { risk: "Medium", count: 35, percentage: 18 },
    { risk: "High", count: 15, percentage: 8 }
  ];

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Corporate Analytics</h1>
        <div className="flex gap-2">
          <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">195</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">+5% from last month</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Health Score</p>
                <p className="text-2xl font-bold">82</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">+8 points</span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">₹3.0L</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">+25% vs traditional</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Program Engagement</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">+12% engagement</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} name="Avg Health Score" />
                    <Line type="monotone" dataKey="screenings" stroke="#10b981" strokeWidth={2} name="Screenings" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskDistribution.map((risk) => (
                    <div key={risk.risk} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{risk.risk} Risk</span>
                        <span className="text-sm text-muted-foreground">{risk.count} employees ({risk.percentage}%)</span>
                      </div>
                      <Progress value={risk.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Claims vs Screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="screenings" fill="#3b82f6" name="Health Screenings" />
                  <Bar dataKey="claims" fill="#ef4444" name="Insurance Claims" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Program Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={programParticipation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {programParticipation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programParticipation.map((program) => (
                    <div key={program.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{program.name}</span>
                        <span className="text-sm text-muted-foreground">{program.value} participants</span>
                      </div>
                      <Progress value={(program.value / 200) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentHealth.map((dept) => (
                  <div key={dept.department} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{dept.department}</h3>
                      <Badge variant="outline">{dept.employees} employees</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Health Score</p>
                        <p className="font-medium text-lg">{dept.avgHealth}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Programs per Employee</p>
                        <p className="font-medium text-lg">{dept.programs}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Claims this Quarter</p>
                        <p className="font-medium text-lg">{dept.claims}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Savings Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costSavings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, ""]} />
                  <Bar dataKey="traditional" fill="#ef4444" name="Traditional Healthcare Cost" />
                  <Bar dataKey="withPrograms" fill="#3b82f6" name="With Wellness Programs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Savings YTD</p>
                  <p className="text-3xl font-bold text-green-600">₹3.0L</p>
                  <p className="text-sm text-muted-foreground mt-1">vs traditional approach</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">ROI on Wellness Programs</p>
                  <p className="text-3xl font-bold text-blue-600">280%</p>
                  <p className="text-sm text-muted-foreground mt-1">return on investment</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Cost per Employee</p>
                  <p className="text-3xl font-bold text-purple-600">₹1,538</p>
                  <p className="text-sm text-muted-foreground mt-1">monthly healthcare cost</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}