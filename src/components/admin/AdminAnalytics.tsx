import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Activity,
  CreditCard,
  UserCheck,
  Stethoscope,
  Target,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalUsers: number;
  totalPatients: number;
  totalProviders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  avgTransactionValue: number;
  userGrowth: number;
  revenueGrowth: number;
  popularServices: Array<{
    service: string;
    count: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    users: number;
    revenue: number;
    appointments: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const { data: profiles } = await supabase
        .from('profiles')
        .select('role, created_at');

      // Fetch payment transactions
      const { data: transactions } = await supabase
        .from('payment_transactions')
        .select('amount, payment_method, created_at, status, metadata');

      // Fetch appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('status, created_at, fee_amount, type');

      if (!profiles || !transactions || !appointments) {
        throw new Error('Failed to fetch analytics data');
      }

      // Calculate user metrics
      const totalUsers = profiles.length;
      const totalPatients = profiles.filter(p => p.role === 'patient').length;
      const totalProviders = profiles.filter(p => p.role === 'provider').length;

      // Calculate revenue metrics
      const completedTransactions = transactions.filter(t => t.status === 'completed');
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedTransactions
        .filter(t => {
          const date = new Date(t.created_at);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate appointment metrics
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(a => a.status === 'completed').length;

      // Calculate average transaction value
      const avgTransactionValue = completedTransactions.length > 0 
        ? totalRevenue / completedTransactions.length 
        : 0;

      // Calculate growth rates (simplified - comparing last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const recentUsers = profiles.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length;
      const previousUsers = profiles.filter(p => 
        new Date(p.created_at) >= sixtyDaysAgo && new Date(p.created_at) < thirtyDaysAgo
      ).length;
      const userGrowth = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0;

      const recentRevenue = completedTransactions
        .filter(t => new Date(t.created_at) >= thirtyDaysAgo)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const previousRevenue = completedTransactions
        .filter(t => new Date(t.created_at) >= sixtyDaysAgo && new Date(t.created_at) < thirtyDaysAgo)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Popular services analysis
      const serviceStats = appointments.reduce((acc, apt) => {
        const service = apt.type || 'General Consultation';
        if (!acc[service]) {
          acc[service] = { count: 0, revenue: 0 };
        }
        acc[service].count++;
        acc[service].revenue += Number(apt.fee_amount || 0);
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>);

      const popularServices = Object.entries(serviceStats)
        .map(([service, stats]) => ({ service, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Payment methods breakdown
      const paymentStats = completedTransactions.reduce((acc, t) => {
        const method = t.payment_method || 'Unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalPayments = completedTransactions.length;
      const paymentMethods = Object.entries(paymentStats)
        .map(([method, count]) => ({
          method,
          count,
          percentage: totalPayments > 0 ? (count / totalPayments) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      // Monthly data for trends (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthUsers = profiles.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length;

        const monthRevenue = completedTransactions
          .filter(t => {
            const createdAt = new Date(t.created_at);
            return createdAt >= monthStart && createdAt <= monthEnd;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const monthAppointments = appointments.filter(a => {
          const createdAt = new Date(a.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length;

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          users: monthUsers,
          revenue: monthRevenue,
          appointments: monthAppointments
        });
      }

      setAnalytics({
        totalUsers,
        totalPatients,
        totalProviders,
        totalRevenue,
        monthlyRevenue,
        totalAppointments,
        completedAppointments,
        avgTransactionValue,
        userGrowth,
        revenueGrowth,
        popularServices,
        monthlyData,
        paymentMethods
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <p>Failed to load analytics data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Badge variant="outline" className="px-3 py-1">
          Real-time Data
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center ${analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.userGrowth >= 0 ? '+' : ''}{analytics.userGrowth.toFixed(1)}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.revenueGrowth >= 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Current month earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalAppointments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.completedAppointments} completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-blue-500" />
                    <span>Patients</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{analytics.totalPatients}</div>
                    <div className="text-sm text-muted-foreground">
                      {((analytics.totalPatients / analytics.totalUsers) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(analytics.totalPatients / analytics.totalUsers) * 100} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-green-500" />
                    <span>Providers</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{analytics.totalProviders}</div>
                    <div className="text-sm text-muted-foreground">
                      {((analytics.totalProviders / analytics.totalUsers) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(analytics.totalProviders / analytics.totalUsers) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Avg Transaction Value</span>
                  <span className="font-semibold">₹{analytics.avgTransactionValue.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Appointment Completion Rate</span>
                  <span className="font-semibold">
                    {analytics.totalAppointments > 0 
                      ? ((analytics.completedAppointments / analytics.totalAppointments) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Patient to Provider Ratio</span>
                  <span className="font-semibold">
                    {analytics.totalProviders > 0 
                      ? (analytics.totalPatients / analytics.totalProviders).toFixed(1)
                      : 0}:1
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.popularServices.map((service, index) => (
                    <div key={service.service} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{service.service}</div>
                        <div className="text-sm text-muted-foreground">
                          {service.count} appointments
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{service.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{(service.revenue / service.count).toFixed(0)} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.paymentMethods.map((method) => (
                    <div key={method.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{method.method}</span>
                        <span className="font-semibold">{method.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyData.map((month) => (
                  <div key={month.month} className="grid grid-cols-4 gap-4 py-2 border-b">
                    <div className="font-medium">{month.month}</div>
                    <div className="text-center">
                      <div className="font-semibold">{month.users}</div>
                      <div className="text-sm text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">₹{month.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{month.appointments}</div>
                      <div className="text-sm text-muted-foreground">Appointments</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  {((analytics.totalPatients / analytics.totalUsers) * 100).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProviders}</div>
                <p className="text-xs text-muted-foreground">
                  {((analytics.totalProviders / analytics.totalUsers) * 100).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Growth</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.userGrowth >= 0 ? '+' : ''}{analytics.userGrowth.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Compared to last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Registration Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex items-center space-x-4">
                      <span>{month.users} new users</span>
                      <Progress value={(month.users / Math.max(...analytics.monthlyData.map(m => m.users))) * 100} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Revenue Projections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Month (Projected)</span>
                    <span className="font-semibold">
                      ₹{(analytics.monthlyRevenue * (1 + analytics.revenueGrowth / 100)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Quarter (Projected)</span>
                    <span className="font-semibold">
                      ₹{(analytics.monthlyRevenue * 3 * (1 + analytics.revenueGrowth / 100)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Run Rate</span>
                    <span className="font-semibold">
                      ₹{(analytics.monthlyRevenue * 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Growth Projections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Projected Users (Next Month)</span>
                    <span className="font-semibold">
                      {Math.round(analytics.totalUsers * (1 + analytics.userGrowth / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Appointments (Monthly)</span>
                    <span className="font-semibold">
                      {Math.round(analytics.totalAppointments * 1.1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Penetration</span>
                    <span className="font-semibold">
                      {((analytics.totalUsers / 10000) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Monthly Recurring Revenue Growth</span>
                      <span className="font-semibold">{analytics.revenueGrowth.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(Math.abs(analytics.revenueGrowth), 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>User Acquisition Rate</span>
                      <span className="font-semibold">{analytics.userGrowth.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(Math.abs(analytics.userGrowth), 100)} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Appointment Completion Rate</span>
                      <span className="font-semibold">
                        {analytics.totalAppointments > 0 
                          ? ((analytics.completedAppointments / analytics.totalAppointments) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={analytics.totalAppointments > 0 
                        ? (analytics.completedAppointments / analytics.totalAppointments) * 100
                        : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Platform Utilization</span>
                      <span className="font-semibold">
                        {analytics.totalProviders > 0 
                          ? ((analytics.totalAppointments / analytics.totalProviders) * 10).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={analytics.totalProviders > 0 
                        ? Math.min((analytics.totalAppointments / analytics.totalProviders) * 10, 100)
                        : 0} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}