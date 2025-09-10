import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Pill, 
  FileText, 
  ShieldCheck, 
  Video, 
  Brain,
  Activity,
  Phone,
  Clock,
  MapPin
} from "lucide-react";

interface UpcomingAppointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "audio" | "chat";
  status: "confirmed" | "pending";
}

interface HealthMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  color: string;
}

export function PatientDashboard() {
  const upcomingAppointments: UpcomingAppointment[] = [
    {
      id: "1",
      doctor: "Dr. Priya Sharma",
      specialty: "General Medicine", 
      date: "Today",
      time: "2:30 PM",
      type: "video",
      status: "confirmed"
    },
    {
      id: "2", 
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      date: "Tomorrow", 
      time: "10:00 AM",
      type: "video",
      status: "pending"
    }
  ];

  const healthMetrics: HealthMetric[] = [
    { label: "Blood Pressure", value: "120/80", trend: "stable", color: "bg-healing-green" },
    { label: "Heart Rate", value: "72 BPM", trend: "stable", color: "bg-primary" },
    { label: "Weight", value: "68 kg", trend: "down", color: "bg-accent" },
    { label: "Steps Today", value: "8,234", trend: "up", color: "bg-trust-purple" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Good afternoon, Rahul!</h1>
            <p className="opacity-90">Ready to take care of your health today?</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">ABHA ID</p>
            <p className="font-mono font-semibold">91-1234-5678-9012</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-medical transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Book Consultation</h3>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medical transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="bg-healing-green/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-healing-green" />
            </div>
            <h3 className="font-semibold text-sm">Mental Health</h3>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medical transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Pill className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-sm">Medicines</h3>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medical transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="bg-trust-purple/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-trust-purple" />
            </div>
            <h3 className="font-semibold text-sm">Lab Tests</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.date} at {appointment.time}
                        </span>
                        <Badge variant={appointment.type === "video" ? "default" : "secondary"}>
                          <Video className="h-3 w-3 mr-1" />
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                    {appointment.date === "Today" && (
                      <Button size="sm">Join Now</Button>
                    )}
                  </div>
                </div>
              ))}
              
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming appointments</p>
                  <Button className="mt-3">Book Your First Consultation</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{metric.label}</p>
                    <p className="text-lg font-bold text-primary">{metric.value}</p>
                  </div>
                  <div className={`w-3 h-8 rounded-full ${metric.color}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insurance Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Insurance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coverage Used</span>
                  <span className="text-sm font-semibold">₹45,000 / ₹500,000</span>
                </div>
                <Progress value={9} className="h-2" />
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-healing-green/10 text-healing-green border-healing-green">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <span className="text-xs text-muted-foreground">ICICI Lombard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Pill className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Prescription uploaded</p>
                <p className="text-sm text-muted-foreground">Dr. Priya Sharma • 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="bg-healing-green/10 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-healing-green" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Lab report available</p>
                <p className="text-sm text-muted-foreground">Thyrocare • 1 day ago</p>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stethoscope({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A3.5 3.5 0 0 0 18.5 5c-.61 0-1.16.16-1.65.42l-.9-1.68C17.03 2.66 17.78 2 18.5 2A5.5 5.5 0 0 1 24 7.5c0 3.11-2.26 5.87-5 6.34V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.16C.26 13.37-2 10.61-2 7.5A5.5 5.5 0 0 1 3.5 2c.72 0 1.47.66 1.55 1.74l-.9 1.68C3.66 5.16 3.11 5 2.5 5A3.5 3.5 0 0 0-1 8.5c0 2.29 1.51 4.04 3 5.5z"/>
    </svg>
  );
}