import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  Clock,
  Download,
  Eye,
  CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface EarningsData {
  total_earnings: number;
  monthly_earnings: number;
  weekly_earnings: number;
  total_consultations: number;
  avg_consultation_fee: number;
  pending_payments: number;
}

interface PaymentRecord {
  id: string;
  patient_name: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  consultation_type: string;
}

export function EarningsDashboard() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData>({
    total_earnings: 0,
    monthly_earnings: 0,
    weekly_earnings: 0,
    total_consultations: 0,
    avg_consultation_fee: 0,
    pending_payments: 0
  });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEarningsData();
      fetchPaymentRecords();
    }
  }, [user]);

  const fetchEarningsData = async () => {
    try {
      // Fetch completed appointments with fees
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('fee_amount, appointment_date, type')
        .eq('provider_id', user?.id)
        .eq('status', 'completed')
        .not('fee_amount', 'is', null);

      if (error) throw error;

      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalEarnings = appointments?.reduce((sum, apt) => sum + (apt.fee_amount || 0), 0) || 0;
      const monthlyEarnings = appointments?.filter(apt => 
        new Date(apt.appointment_date) >= oneMonthAgo
      ).reduce((sum, apt) => sum + (apt.fee_amount || 0), 0) || 0;
      
      const weeklyEarnings = appointments?.filter(apt => 
        new Date(apt.appointment_date) >= oneWeekAgo
      ).reduce((sum, apt) => sum + (apt.fee_amount || 0), 0) || 0;

      setEarnings({
        total_earnings: totalEarnings,
        monthly_earnings: monthlyEarnings,
        weekly_earnings: weeklyEarnings,
        total_consultations: appointments?.length || 0,
        avg_consultation_fee: appointments?.length ? totalEarnings / appointments.length : 0,
        pending_payments: 2450 // Mock data
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRecords = () => {
    // Mock payment records for demo
    setPayments([
      {
        id: '1',
        patient_name: 'Priya Sharma',
        amount: 500,
        date: '2024-01-15',
        status: 'paid',
        consultation_type: 'Video Consultation'
      },
      {
        id: '2',
        patient_name: 'Rahul Kumar',
        amount: 750,
        date: '2024-01-14',
        status: 'paid',
        consultation_type: 'In-Person Consultation'
      },
      {
        id: '3',
        patient_name: 'Anita Patel',
        amount: 400,
        date: '2024-01-13',
        status: 'pending',
        consultation_type: 'Audio Consultation'
      },
      {
        id: '4',
        patient_name: 'Vikram Singh',
        amount: 600,
        date: '2024-01-10',
        status: 'overdue',
        consultation_type: 'Video Consultation'
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
          <p className="text-muted-foreground">Track your consultation earnings and payments</p>
        </div>
        
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.total_earnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {earnings.total_consultations} consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.monthly_earnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.weekly_earnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(earnings.avg_consultation_fee)}</div>
            <p className="text-xs text-muted-foreground">
              Per consultation
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{payment.patient_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payment.consultation_type} • {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">₹{payment.amount}</div>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.filter(p => p.status === 'pending' || p.status === 'overdue').map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{payment.patient_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payment.consultation_type} • {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">₹{payment.amount}</div>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      <Button size="sm">
                        Follow Up
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Analytics</CardTitle>
                <CardDescription>Detailed breakdown of your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Video Consultations</span>
                    <span className="font-semibold">65% (₹{Math.round(earnings.total_earnings * 0.65).toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">In-Person Consultations</span>
                    <span className="font-semibold">25% (₹{Math.round(earnings.total_earnings * 0.25).toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Audio Consultations</span>
                    <span className="font-semibold">10% (₹{Math.round(earnings.total_earnings * 0.1).toLocaleString()})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <p className="text-sm text-muted-foreground">Payment Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3.2 days</div>
                    <p className="text-sm text-muted-foreground">Avg Payment Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">₹{earnings.pending_payments}</div>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}