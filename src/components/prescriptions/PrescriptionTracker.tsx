import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Search,
  Download,
  Upload,
  Bell,
  User
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Prescription {
  id: string;
  provider_id: string;
  patient_id: string;
  appointment_id?: string;
  medications: any[];
  diagnosis?: string;
  instructions?: string;
  issued_date: string;
  expiry_date?: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  provider?: {
    first_name: string;
    last_name: string;
  };
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  refills: number;
}

export function PrescriptionTracker() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          provider:provider_profiles!inner(
            user:profiles!inner(first_name, last_name)
          )
        `)
        .eq('patient_id', user?.id)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setPrescriptions((data || []).map(prescription => ({
        ...prescription,
        medications: Array.isArray(prescription.medications) ? prescription.medications : [],
        status: prescription.status as 'active' | 'completed' | 'expired' | 'cancelled',
        provider: prescription.provider && typeof prescription.provider === 'object' && 'user' in prescription.provider ? {
          first_name: prescription.provider.user?.first_name || '',
          last_name: prescription.provider.user?.last_name || ''
        } : undefined
      })));
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.medications.some((med: Medication) => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || 
    prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.provider?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.provider?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrescriptions = filteredPrescriptions.filter(p => p.status === 'active');
  const completedPrescriptions = filteredPrescriptions.filter(p => p.status === 'completed');
  const expiredPrescriptions = filteredPrescriptions.filter(p => p.status === 'expired');

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Prescriptions</h1>
          <p className="text-muted-foreground">Track your medications and prescriptions</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Prescription
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medications or providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activePrescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedPrescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">{expiredPrescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reminders</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activePrescriptions.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="all">All Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activePrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Dr. {prescription.provider?.first_name} {prescription.provider?.last_name}</span>
                      <Badge variant="outline" className={getStatusColor(prescription.status)}>
                        {getStatusIcon(prescription.status)}
                        <span className="ml-1 capitalize">{prescription.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Issued: {new Date(prescription.issued_date).toLocaleDateString()}
                      {prescription.expiry_date && (
                        <span className="ml-4">
                          Expires: {new Date(prescription.expiry_date).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {prescription.diagnosis && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Diagnosis</h4>
                    <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Medications</h4>
                  {prescription.medications.map((medication: Medication, index: number) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-medium">{medication.name}</span>
                          <Badge variant="secondary">{medication.dosage}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Frequency:</strong> {medication.frequency}</p>
                          <p><strong>Duration:</strong> {medication.duration}</p>
                          {medication.instructions && (
                            <p><strong>Instructions:</strong> {medication.instructions}</p>
                          )}
                          <div className="flex items-center space-x-4">
                            <span><strong>Quantity:</strong> {medication.quantity}</span>
                            <span><strong>Refills:</strong> {medication.refills}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Set Reminder
                        </Button>
                        <Button size="sm">
                          Refill
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {prescription.instructions && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-1">Additional Instructions</h4>
                    <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Dr. {prescription.provider?.first_name} {prescription.provider?.last_name}</span>
                      <Badge variant="outline" className={getStatusColor(prescription.status)}>
                        {getStatusIcon(prescription.status)}
                        <span className="ml-1 capitalize">{prescription.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Completed: {new Date(prescription.issued_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {prescription.medications.map((med: Medication, index: number) => (
                    <span key={index}>
                      {med.name}
                      {index < prescription.medications.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {expiredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-red-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Dr. {prescription.provider?.first_name} {prescription.provider?.last_name}</span>
                      <Badge variant="outline" className={getStatusColor(prescription.status)}>
                        {getStatusIcon(prescription.status)}
                        <span className="ml-1 capitalize">{prescription.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      Expired: {prescription.expiry_date && new Date(prescription.expiry_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    Request Renewal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {prescription.medications.map((med: Medication, index: number) => (
                    <span key={index}>
                      {med.name}
                      {index < prescription.medications.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Dr. {prescription.provider?.first_name} {prescription.provider?.last_name}</span>
                      <Badge variant="outline" className={getStatusColor(prescription.status)}>
                        {getStatusIcon(prescription.status)}
                        <span className="ml-1 capitalize">{prescription.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(prescription.issued_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {prescription.medications.map((med: Medication, index: number) => (
                    <span key={index}>
                      {med.name}
                      {index < prescription.medications.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}