import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  Clock,
  Video,
  Star,
  TrendingUp,
  MessageCircle,
  Phone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PatientAppointment {
  id: string;
  patient: string;
  time: string;
  type: "video" | "audio" | "chat";
  status: "upcoming" | "ongoing" | "completed";
  reason: string;
}

interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  trend: number;
}

export function ProviderDashboard() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [earnings, setEarnings] = useState<EarningsData>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    trend: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      // Fetch today's appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(first_name, last_name)
        `)
        .eq('provider_id', 'provider-1') // Replace with actual auth.uid()
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .lt('appointment_date', new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);

      if (appointmentsData) {
        const formattedAppointments = appointmentsData.map((apt: any) => ({
          id: apt.id,
          patient: `${apt.patient.first_name} ${apt.patient.last_name}`,
          time: new Date(apt.appointment_date).toLocaleTimeString(),
          type: apt.type === 'video_call' ? 'video' as const : apt.type === 'phone_call' ? 'audio' as const : 'chat' as const,
          status: apt.status === 'confirmed' ? 'upcoming' as const : apt.status === 'in_progress' ? 'ongoing' as const : 'completed' as const,
          reason: apt.reason || 'General consultation'
        }));
        setAppointments(formattedAppointments);
      }

      // Calculate earnings (mock for now, but structure for real data)
      setEarnings({
        today: 4500,
        thisWeek: 28000,
        thisMonth: 125000,
        trend: 12.5
      });
    } catch (error) {
      console.error('Error fetching provider data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Today's Patients",
      value: "12",
      icon: Users,
      color: "text-primary"
    },
    {
      label: "This Week",
      value: "67", 
      icon: Calendar,
      color: "text-healing-green"
    },
    {
      label: "Rating",
      value: "4.8",
      icon: Star,
      color: "text-warning"
    },
    {
      label: "Response Time",
      value: "< 2min",
      icon: Clock,
      color: "text-accent"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, Dr. Priya!</h1>
            <p className="opacity-90">You have 12 appointments scheduled for today</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Online Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-healing-green rounded-full" />
              <span className="font-semibold">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <Button variant="outline" size="sm">View Calendar</Button>
              </div>
              <CardDescription>
                {appointments.length} appointments scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No appointments scheduled for today</div>
              ) : appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {appointment.type === "video" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : appointment.type === "audio" ? (
                        <Phone className="h-5 w-5 text-primary" />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.patient}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{appointment.time}</span>
                        <Badge variant="outline" className="ml-2">
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      appointment.status === "upcoming" ? "default" : 
                      appointment.status === "ongoing" ? "secondary" : 
                      "outline"
                    }>
                      {appointment.status}
                    </Badge>
                    <Button size="sm">
                      {appointment.status === "upcoming" ? "Start" : "View"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Earnings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-primary">₹{earnings.today.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-lg font-semibold">₹{earnings.thisWeek.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">₹{earnings.thisMonth.toLocaleString()}</p>
                  <Badge variant="outline" className="bg-healing-green/10 text-healing-green">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{earnings.trend}%
                  </Badge>
                </div>
              </div>

              <Button className="w-full mt-4">
                View Detailed Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Block Time Slots
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Patient Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">245</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-healing-green">89%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">156</p>
              <p className="text-sm text-muted-foreground">Consultations This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}