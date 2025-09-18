import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Search, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: any;
  avatar_url?: string;
  last_appointment?: string;
  total_appointments: number;
  upcoming_appointments: number;
}

export function PatientManagement() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          patient:profiles!inner(
            user_id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            avatar_url
          )
        `)
        .eq('provider_id', user?.id);

      if (error) throw error;

      // Group patients and calculate statistics
      const patientMap = new Map();
      
      appointmentData?.forEach(appointment => {
        const patientId = appointment.patient_id;
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            id: patientId,
            first_name: appointment.patient?.first_name || '',
            last_name: appointment.patient?.last_name || '',
            email: appointment.patient?.email || '',
            phone: appointment.patient?.phone || '',
            date_of_birth: appointment.patient?.date_of_birth || '',
            address: appointment.patient?.address || null,
            avatar_url: appointment.patient?.avatar_url || '',
            total_appointments: 0,
            upcoming_appointments: 0,
            last_appointment: null
          });
        }
        
        const patient = patientMap.get(patientId);
        patient.total_appointments++;
      });

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading patients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">Manage your patients and view their information</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Patients ({patients.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Visits</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.avatar_url} />
                        <AvatarFallback>
                          {patient.first_name[0]}{patient.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          {patient.date_of_birth && (
                            <Badge variant="outline">
                              {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                          
                          {patient.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          
                          {patient.address && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {patient.address.city && `${patient.address.city}, `}
                                {patient.address.state}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>{patient.total_appointments} total visits</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span>{patient.upcoming_appointments} upcoming</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View Records
                      </Button>
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPatients.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No patients match your search." : "You haven't seen any patients yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Recent patient visits will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Upcoming patient appointments will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}