import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText,
  Download,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Home,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { labOrderSchema } from "@/utils/validationSchemas";
import { z } from "zod";

type LabOrderFormData = z.infer<typeof labOrderSchema>;

interface LabOrder {
  id: string;
  patient_id: string;
  provider_id?: string;
  lab_partner: string;
  test_types: string[];
  order_date: string;
  sample_collection_date?: string;
  results_expected_date?: string;
  results_received_date?: string;
  status: 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  test_results?: any;
  ai_interpretation?: any;
  recommendations?: any[];
  critical_values?: any[];
  cost: number;
  insurance_covered: boolean;
}

interface LabPartner {
  name: string;
  rating: number;
  turnaround: string;
  accreditation: string[];
  home_collection: boolean;
  location: string;
}

const labTests = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 350 },
  { id: 'lipid', name: 'Lipid Profile', price: 550 },
  { id: 'thyroid', name: 'Thyroid Function Test (TSH, T3, T4)', price: 650 },
  { id: 'hba1c', name: 'HbA1c (Diabetes)', price: 450 },
  { id: 'liver', name: 'Liver Function Test (LFT)', price: 500 },
  { id: 'kidney', name: 'Kidney Function Test (KFT)', price: 500 },
  { id: 'vitamin_d', name: 'Vitamin D', price: 800 },
  { id: 'iron', name: 'Iron Studies', price: 700 },
];

const labPartners: LabPartner[] = [
  {
    name: "Dr. Lal PathLabs",
    rating: 4.7,
    turnaround: "24-48 hours",
    accreditation: ["NABL", "CAP"],
    home_collection: true,
    location: "Nationwide"
  },
  {
    name: "Thyrocare",
    rating: 4.5,
    turnaround: "12-24 hours",
    accreditation: ["NABL", "ISO"],
    home_collection: true,
    location: "Nationwide"
  },
  {
    name: "Metropolis Healthcare",
    rating: 4.6,
    turnaround: "24 hours",
    accreditation: ["NABL", "CAP", "ISO"],
    home_collection: true,
    location: "Major Cities"
  }
];

export const LabIntegration = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<LabPartner | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<LabOrderFormData>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      sample_type: 'home_collection'
    }
  });

  const sampleType = watch('sample_type');

  useEffect(() => {
    if (user) {
      fetchLabOrders();
    }
  }, [user]);

  const fetchLabOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_orders')
        .select('*')
        .eq('patient_id', user?.id)
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders((data || []).map(order => ({
        ...order,
        test_types: Array.isArray(order.test_types) ? order.test_types.map(String) : [],
        recommendations: Array.isArray(order.recommendations) ? order.recommendations : [],
        critical_values: Array.isArray(order.critical_values) ? order.critical_values : [],
        status: order.status as LabOrder['status']
      })));
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      toast.error('Failed to load lab orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, testId) => {
      const test = labTests.find(t => t.id === testId);
      return total + (test?.price || 0);
    }, 0);
  };

  const onSubmit = async (data: LabOrderFormData) => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    if (!selectedPartner) {
      toast.error('Please select a lab partner');
      return;
    }

    try {
      const totalCost = calculateTotal();
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 2);

      const { error } = await supabase
        .from('lab_orders')
        .insert({
          patient_id: user?.id,
          provider_id: null,
          lab_partner: selectedPartner.name,
          test_types: selectedTests as any,
          order_date: new Date().toISOString(),
          results_expected_date: expectedDate.toISOString(),
          status: 'ordered',
          cost: totalCost,
          insurance_covered: false
        });

      if (error) throw error;

      toast.success('Lab test order placed successfully!');
      setIsOrdering(false);
      setSelectedTests([]);
      setSelectedPartner(null);
      reset();
      fetchLabOrders();
    } catch (error) {
      console.error('Error placing lab order:', error);
      toast.error('Failed to place lab order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'sample_collected': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'sample_collected': return <FlaskConical className="h-4 w-4" />;
      case 'ordered': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading lab orders...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lab Tests</h1>
          <p className="text-muted-foreground">Order lab tests with home sample collection</p>
        </div>
        
        <Dialog open={isOrdering} onOpenChange={setIsOrdering}>
          <DialogTrigger asChild>
            <Button>
              <FlaskConical className="h-4 w-4 mr-2" />
              Order Lab Tests
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Lab Tests</DialogTitle>
              <DialogDescription>
                Select tests and schedule sample collection
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Test Selection */}
              <div className="space-y-3">
                <Label>Select Tests</Label>
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-2 border rounded">
                  {labTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-accent/5 cursor-pointer"
                      onClick={() => toggleTestSelection(test.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={() => toggleTestSelection(test.id)}
                        />
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">₹{test.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedTests.length > 0 && (
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                    <span className="font-medium">{selectedTests.length} tests selected</span>
                    <span className="text-lg font-bold">Total: ₹{calculateTotal()}</span>
                  </div>
                )}
              </div>

              {/* Lab Partner Selection */}
              <div className="space-y-3">
                <Label>Select Lab Partner</Label>
                <div className="grid grid-cols-1 gap-3">
                  {labPartners.map((partner) => (
                    <div
                      key={partner.name}
                      className={`p-4 border rounded cursor-pointer transition-all ${
                        selectedPartner?.name === partner.name 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedPartner(partner);
                        setValue('lab_partner', partner.name);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{partner.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">⭐ {partner.rating}</Badge>
                            <Badge variant="outline">{partner.turnaround}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {partner.accreditation.map(acc => (
                              <Badge key={acc} variant="secondary" className="text-xs">{acc}</Badge>
                            ))}
                          </div>
                        </div>
                        {partner.home_collection && (
                          <Badge className="bg-green-100 text-green-800">
                            <Home className="h-3 w-3 mr-1" />
                            Home Collection
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Collection Type */}
              <div className="space-y-3">
                <Label>Sample Collection</Label>
                <Select 
                  value={sampleType} 
                  onValueChange={(value) => setValue('sample_type', value as 'home_collection' | 'lab_visit')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home_collection">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        Home Collection
                      </div>
                    </SelectItem>
                    <SelectItem value="lab_visit">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Lab Visit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Date</Label>
                  <Input type="date" {...register('preferred_date')} />
                  {errors.preferred_date && (
                    <p className="text-sm text-destructive mt-1">{errors.preferred_date.message}</p>
                  )}
                </div>
                <div>
                  <Label>Preferred Time</Label>
                  <Select onValueChange={(value) => setValue('preferred_time', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00-08:00">6:00 AM - 8:00 AM</SelectItem>
                      <SelectItem value="08:00-10:00">8:00 AM - 10:00 AM</SelectItem>
                      <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                      <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                      <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferred_time && (
                    <p className="text-sm text-destructive mt-1">{errors.preferred_time.message}</p>
                  )}
                </div>
              </div>

              {/* Address (only for home collection) */}
              {sampleType === 'home_collection' && (
                <div>
                  <Label>Collection Address</Label>
                  <Textarea 
                    {...register('address')} 
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <Label>Special Instructions (Optional)</Label>
                <Textarea 
                  {...register('special_instructions')} 
                  placeholder="Any special instructions for sample collection"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full" disabled={selectedTests.length === 0 || !selectedPartner}>
                Place Order - ₹{calculateTotal()}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No lab orders yet</p>
                <p className="text-sm text-muted-foreground mt-2">Order your first lab test to get started</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FlaskConical className="h-5 w-5" />
                        <span>{order.lab_partner}</span>
                      </CardTitle>
                      <CardDescription>
                        Order Date: {new Date(order.order_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{order.status.replace('_', ' ')}</span>
                        </span>
                      </Badge>
                      <span className="text-lg font-bold">₹{order.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tests Ordered</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.test_types.map((testId, idx) => {
                          const test = labTests.find(t => t.id === testId);
                          return (
                            <Badge key={idx} variant="outline">
                              {test?.name || testId}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {order.results_expected_date && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Expected Results: {new Date(order.results_expected_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {order.status === 'completed' && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        {order.ai_interpretation && (
                          <Button variant="outline" size="sm">
                            <Brain className="h-4 w-4 mr-2" />
                            AI Interpretation
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {orders.filter(o => o.status === 'completed').length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No test results available yet</p>
              </CardContent>
            </Card>
          ) : (
            orders
              .filter(o => o.status === 'completed')
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle>Test Results - {new Date(order.order_date).toLocaleDateString()}</CardTitle>
                    <CardDescription>{order.lab_partner}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.critical_values && order.critical_values.length > 0 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">Critical Values Detected</p>
                            <p className="text-sm text-red-600">Please consult your doctor immediately</p>
                          </div>
                        </div>
                      )}

                      {order.ai_interpretation && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium">AI Interpretation</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            AI-powered analysis of your test results
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
