import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Brain, 
  Baby, 
  Shield, 
  Pill, 
  Activity, 
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  FileText,
  MessageCircle,
  Video,
  Phone,
  MapPin,
  Star,
  IndianRupee
} from "lucide-react";

// Import our specialized components
import { SymptomTriage } from "./SymptomTriage";
import { MaternalHealthTracker } from "./MaternalHealthTracker";
import { PediatricCareTracker } from "./PediatricCareTracker";

interface HealthSummary {
  riskScore: number;
  upcomingAppointments: number;
  activePrescriptions: number;
  insuranceCoverage: number;
  recentActivity: any[];
}

interface QuickAction {
  icon: any;
  label: string;
  action: () => void;
  color: string;
  urgent?: boolean;
}

export function ComprehensivePatientDashboard() {
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, profile } = useAuth();

  const loadHealthSummary = async () => {
    if (!user) return;

    try {
      // Load multiple data sources in parallel
      const [appointments, prescriptions, riskScores, insurance] = await Promise.all([
        supabase.from('appointments').select('*').eq('patient_id', user.id).limit(5),
        supabase.from('prescriptions').select('*').eq('patient_id', user.id).eq('status', 'active').limit(10),
        supabase.from('patient_risk_scores').select('*').eq('patient_id', user.id).order('calculated_at', { ascending: false }).limit(1),
        supabase.from('patient_insurance').select('*').eq('patient_id', user.id).eq('is_active', true).limit(1)
      ]);

      const summary: HealthSummary = {
        riskScore: riskScores.data?.[0]?.overall_risk_score || 0,
        upcomingAppointments: appointments.data?.filter(apt => new Date(apt.appointment_date) > new Date()).length || 0,
        activePrescriptions: prescriptions.data?.length || 0,
        insuranceCoverage: insurance.data?.[0]?.coverage_amount || 0,
        recentActivity: [
          ...(appointments.data || []).map(apt => ({ type: 'appointment', data: apt })),
          ...(prescriptions.data || []).map(rx => ({ type: 'prescription', data: rx }))
        ].sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()).slice(0, 5)
      };

      setHealthSummary(summary);
    } catch (error) {
      console.error('Error loading health summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthSummary();
  }, [user]);

  const quickActions: QuickAction[] = [
    {
      icon: Video,
      label: "Book Video Consultation",
      action: () => window.location.href = '/patient/consultation',
      color: "bg-primary/10 text-primary hover:bg-primary/20"
    },
    {
      icon: Brain,
      label: "AI Symptom Check",
      action: () => setActiveTab("triage"),
      color: "bg-healing-green/10 text-healing-green hover:bg-healing-green/20"
    },
    {
      icon: Pill,
      label: "Order Medicines",
      action: () => window.location.href = '/patient/prescriptions',
      color: "bg-accent/10 text-accent hover:bg-accent/20"
    },
    {
      icon: Activity,
      label: "Lab Tests",
      action: () => window.location.href = '/patient/lab-tests',
      color: "bg-trust-purple/10 text-trust-purple hover:bg-trust-purple/20"
    },
    {
      icon: Heart,
      label: "Maternal Care",
      action: () => setActiveTab("maternal"),
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20"
    },
    {
      icon: Baby,
      label: "Child Health",
      action: () => setActiveTab("pediatric"),
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
    },
    {
      icon: Shield,
      label: "Insurance",
      action: () => window.location.href = '/patient/insurance',
      color: "bg-warning/10 text-warning hover:bg-warning/20"
    },
    {
      icon: Users,
      label: "Community",
      action: () => window.location.href = '/patient/community',
      color: "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
    }
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "text-destructive", bgColor: "bg-destructive/10" };
    if (score >= 40) return { level: "Moderate", color: "text-warning", bgColor: "bg-warning/10" };
    return { level: "Low", color: "text-healing-green", bgColor: "bg-healing-green/10" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Welcome back, {profile?.first_name || 'Patient'}! 👋
              </CardTitle>
              <p className="opacity-90">
                Your health journey continues with Mirai Health - स्वास्थ्य आपका, देखभाल हमारी
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Health Score</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {healthSummary ? 100 - healthSummary.riskScore : 85}
                </span>
                <span>/100</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Health Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getRiskLevel(healthSummary?.riskScore || 0).color}`}>
                    {getRiskLevel(healthSummary?.riskScore || 0).level}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${getRiskLevel(healthSummary?.riskScore || 0).bgColor}`}>
                <Activity className={`h-6 w-6 ${getRiskLevel(healthSummary?.riskScore || 0).color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold">{healthSummary?.upcomingAppointments || 0}</p>
              </div>
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medications</p>
                <p className="text-2xl font-bold">{healthSummary?.activePrescriptions || 0}</p>
              </div>
              <Pill className="h-6 w-6 text-healing-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="text-lg font-bold">₹{(healthSummary?.insuranceCoverage || 500000).toLocaleString()}</p>
              </div>
              <Shield className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="triage">AI Triage</TabsTrigger>
          <TabsTrigger value="maternal">Maternal</TabsTrigger>
          <TabsTrigger value="pediatric">Pediatric</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`h-auto p-4 flex flex-col gap-2 ${action.color}`}
                      onClick={action.action}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-medium text-center">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Health Insights & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-healing-green/5 rounded-lg border border-healing-green/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-healing-green mt-0.5" />
                    <div>
                      <h4 className="font-medium text-healing-green">Excellent Progress</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your vital signs are stable and within healthy ranges. Keep up the good work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-medium text-warning">Preventive Care Due</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Schedule your annual health checkup. Early detection saves lives.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Wellness Opportunity</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Join our stress management program to improve your mental wellness score.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthSummary?.recentActivity.length ? (
                    healthSummary.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          {activity.type === 'appointment' ? (
                            <Calendar className="h-4 w-4 text-primary" />
                          ) : (
                            <Pill className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {activity.type === 'appointment' ? 'Appointment' : 'Prescription'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.data.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No recent activity</p>
                      <Button className="mt-3" onClick={() => setActiveTab("triage")}>
                        Start Health Check
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Healthcare Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Healthcare Providers in Mumbai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Lilavati Hospital", type: "Hospital", rating: 4.3, distance: "2.5 km", specialties: ["Emergency", "Cardiology"] },
                  { name: "Apollo Clinic Bandra", type: "Clinic", rating: 4.1, distance: "1.2 km", specialties: ["General Medicine", "Pediatrics"] },
                  { name: "Dr. Lal PathLabs", type: "Lab", rating: 4.0, distance: "800 m", specialties: ["Blood Tests", "Diagnostics"] },
                ].map((provider, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{provider.name}</h4>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        {provider.rating}
                      </div>
                    </div>
                    <Badge variant="outline" className="mb-2">{provider.type}</Badge>
                    <p className="text-sm text-muted-foreground mb-2">{provider.distance}</p>
                    <div className="flex gap-1">
                      {provider.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triage">
          <SymptomTriage onTriageComplete={(result) => {
            // Handle triage completion
            console.log('Triage completed:', result);
          }} />
        </TabsContent>

        <TabsContent value="maternal">
          <MaternalHealthTracker />
        </TabsContent>

        <TabsContent value="pediatric">
          <PediatricCareTracker />
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Health Community & Support
              </CardTitle>
              <p className="text-muted-foreground">
                Connect with others on similar health journeys, get expert advice, and join wellness programs.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Community Forums */}
              <div>
                <h3 className="font-semibold mb-3">Popular Health Forums</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Maternal Health Support", members: 1250, posts: 450, category: "Pregnancy & Motherhood" },
                    { name: "Mental Wellness Circle", members: 890, posts: 320, category: "Mental Health" },
                    { name: "Diabetes Management", members: 650, posts: 280, category: "Chronic Conditions" },
                    { name: "Child Development", members: 430, posts: 150, category: "Pediatrics" },
                  ].map((forum, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{forum.name}</h4>
                        <Badge variant="outline" className="mb-2">{forum.category}</Badge>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{forum.members} members</span>
                          <span>{forum.posts} posts</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Wellness Programs */}
              <div>
                <h3 className="font-semibold mb-3">Recommended Wellness Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Stress Busters", duration: "4 weeks", participants: 156, rating: 4.6, cost: "Free" },
                    { name: "Pregnancy Yoga", duration: "8 weeks", participants: 89, rating: 4.8, cost: "₹2,000" },
                    { name: "Heart Health Challenge", duration: "6 weeks", participants: 203, rating: 4.4, cost: "₹500" },
                  ].map((program, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{program.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participants:</span>
                            <span>{program.participants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {program.rating}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Cost:</span>
                            <Badge variant={program.cost === "Free" ? "secondary" : "outline"}>
                              {program.cost}
                            </Badge>
                          </div>
                        </div>
                        <Button className="w-full mt-3" size="sm">
                          Join Program
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}