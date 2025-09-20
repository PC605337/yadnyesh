import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoDataPopulator } from "./DemoDataPopulator";
import { SecurityMonitor } from "@/components/security/SecurityMonitor";
import { 
  Users, 
  Building2, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Database,
  Server,
  Globe,
  Clock,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SystemStats {
  totalUsers: number;
  totalProviders: number;
  totalAppointments: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  serverUptime: string;
  databaseConnections: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalAppointments: 0,
    activeUsers: 0,
    systemHealth: 'healthy',
    serverUptime: '99.9%',
    databaseConnections: 15
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1200, providers: 45 },
    { month: 'Feb', users: 1450, providers: 52 },
    { month: 'Mar', users: 1680, providers: 58 },
    { month: 'Apr', users: 1920, providers: 65 },
    { month: 'May', users: 2150, providers: 71 },
    { month: 'Jun', users: 2380, providers: 78 }
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 45, completed: 38 },
    { day: 'Tue', appointments: 52, completed: 45 },
    { day: 'Wed', appointments: 48, completed: 41 },
    { day: 'Thu', appointments: 61, completed: 54 },
    { day: 'Fri', appointments: 55, completed: 49 },
    { day: 'Sat', appointments: 35, completed: 30 },
    { day: 'Sun', appointments: 28, completed: 25 }
  ];

  useEffect(() => {
    fetchSystemStats();
    fetchRecentActivities();
  }, []);

  const fetchSystemStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch provider count
      const { count: providerCount } = await supabase
        .from('provider_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch appointment count
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      setStats(prev => ({
        ...prev,
        totalUsers: userCount || 0,
        totalProviders: providerCount || 0,
        totalAppointments: appointmentCount || 0,
        activeUsers: Math.floor((userCount || 0) * 0.6) // Mock active users
      }));
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast.error('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = () => {
    // Mock recent activities
    const mockActivities = [
      {
        id: 1,
        type: 'user_registration',
        description: 'New patient registered',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        severity: 'info'
      },
      {
        id: 2,
        type: 'provider_verification',
        description: 'Provider verification completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        severity: 'success'
      },
      {
        id: 3,
        type: 'system_alert',
        description: 'High database load detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        severity: 'warning'
      },
      {
        id: 4,
        type: 'appointment_surge',
        description: 'Appointment booking surge detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        severity: 'info'
      },
      {
        id: 5,
        type: 'security_scan',
        description: 'Security scan completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        severity: 'success'
      }
    ];
    setRecentActivities(mockActivities);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4" />;
      case 'provider_verification': return <Shield className="h-4 w-4" />;
      case 'system_alert': return <AlertTriangle className="h-4 w-4" />;
      case 'appointment_surge': return <TrendingUp className="h-4 w-4" />;
      case 'security_scan': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">Monitor and manage the healthcare platform</p>
      </div>

      {/* System Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Providers</p>
                <p className="text-2xl font-bold">{stats.totalProviders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold">{stats.totalAppointments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    stats.systemHealth === 'healthy' ? 'bg-green-500' :
                    stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium capitalize">{stats.systemHealth}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trends</CardTitle>
            <CardDescription>Monthly user and provider registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="providers" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Providers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointment Stats</CardTitle>
            <CardDescription>Scheduled vs completed appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" name="Scheduled" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Monitor */}
        <SecurityMonitor userRole="admin" />
        
        {/* Demo Data Populator */}
        <DemoDataPopulator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span className="text-sm">Server Uptime</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {stats.serverUptime}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">DB Connections</span>
                </div>
                <Badge variant="outline">
                  {stats.databaseConnections}/50
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Security Status</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Secure
                </Badge>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Security Implementation Status:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs">RLS Policies Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs">Audit Logging Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs">Rate Limiting Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span className="text-xs">Password Protection Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Review Providers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Scan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Database Backup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                System Health Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities - moved to third position */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}