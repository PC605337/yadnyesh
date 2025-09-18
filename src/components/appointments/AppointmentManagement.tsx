import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  User, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Appointment {
  id: string;
  provider_id: string;
  patient_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'video' | 'audio' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  meeting_link?: string;
  fee_amount?: number;
  provider?: {
    first_name: string;
    last_name: string;
    specialties?: string[];
  };
}

export function AppointmentManagement() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);

  const [newAppointment, setNewAppointment] = useState({
    provider_id: '',
    appointment_date: '',
    type: 'video' as const,
    reason: '',
    duration_minutes: 30
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchProviders();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          provider:provider_profiles!inner(
            user:profiles!inner(first_name, last_name),
            specialties
          )
        `)
        .eq('patient_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments((data || []).map(apt => {
        let provider: { first_name: string; last_name: string; specialties?: string[]; } | undefined;
        
        if (apt.provider && typeof apt.provider === 'object') {
          const providerObj = apt.provider as any;
          if ('user' in providerObj && providerObj.user) {
            provider = {
              first_name: providerObj.user.first_name || '',
              last_name: providerObj.user.last_name || '',
              specialties: providerObj.specialties || []
            };
          }
        }
        
        return {
          ...apt,
          type: apt.type as 'video' | 'audio' | 'in_person',
          status: apt.status as 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
          provider
        };
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          user:profiles!inner(first_name, last_name, email)
        `)
        .eq('is_verified', true);

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const bookAppointment = async () => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          ...newAppointment,
          patient_id: user?.id,
          status: 'scheduled'
        });

      if (error) throw error;

      toast.success('Appointment booked successfully!');
      setIsBookingOpen(false);
      setNewAppointment({
        provider_id: '',
        appointment_date: '',
        type: 'video',
        reason: '',
        duration_minutes: 30
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">Manage your healthcare appointments</p>
        </div>
        
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Schedule an appointment with a healthcare provider
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider">Healthcare Provider</Label>
                <Select value={newAppointment.provider_id} onValueChange={(value) => 
                  setNewAppointment({...newAppointment, provider_id: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.user_id}>
                        Dr. {provider.user.first_name} {provider.user.last_name}
                        {provider.specialties && ` - ${provider.specialties.join(', ')}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={newAppointment.appointment_date}
                  onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Appointment Type</Label>
                <Select value={newAppointment.type} onValueChange={(value: any) => 
                  setNewAppointment({...newAppointment, type: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="audio">Audio Call</SelectItem>
                    <SelectItem value="in_person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  placeholder="Describe your symptoms or reason for the appointment..."
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                />
              </div>
              
              <Button onClick={bookAppointment} className="w-full">
                Book Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {appointments
            .filter(apt => new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled')
            .map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">
                          Dr. {appointment.provider?.first_name} {appointment.provider?.last_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                          <Clock className="h-4 w-4 ml-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {appointment.type === 'video' && <Video className="h-4 w-4" />}
                          {appointment.type === 'audio' && <Phone className="h-4 w-4" />}
                          {appointment.type === 'in_person' && <MapPin className="h-4 w-4" />}
                          <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                          <span className="ml-4">{appointment.duration_minutes} minutes</span>
                        </div>
                        
                        <p className="mt-2"><strong>Reason:</strong> {appointment.reason}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && appointment.meeting_link && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Call
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {appointments
            .filter(apt => new Date(apt.appointment_date) < new Date() || apt.status === 'completed')
            .map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">
                          Dr. {appointment.provider?.first_name} {appointment.provider?.last_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                        {appointment.notes && (
                          <p><strong>Notes:</strong> {appointment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Calendar</CardTitle>
              <CardDescription>View your appointments in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}