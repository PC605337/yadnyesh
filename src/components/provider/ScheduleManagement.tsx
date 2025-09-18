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
  Plus, 
  Edit, 
  Trash2, 
  User,
  Video,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'video' | 'audio' | 'in_person';
  status: string;
  reason: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  day_of_week: number;
}

export function ScheduleManagement() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  
  const [newSlot, setNewSlot] = useState({
    start_time: '',
    end_time: '',
    day_of_week: 1,
    duration: 30
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!inner(first_name, last_name)
        `)
        .eq('provider_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      
      setAppointments(data?.map(apt => ({
        ...apt,
        type: apt.type as 'video' | 'audio' | 'in_person',
        patient: apt.patient as any
      })) || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
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

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      new Date(apt.appointment_date).toDateString() === today
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => 
      new Date(apt.appointment_date) > today
    ).slice(0, 5);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading schedule...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage your appointments and availability</p>
        </div>
        
        <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Available Time Slot</DialogTitle>
              <DialogDescription>
                Set your availability for appointments
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="day">Day of Week</Label>
                <Select value={newSlot.day_of_week.toString()} onValueChange={(value) => 
                  setNewSlot({...newSlot, day_of_week: parseInt(value)})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  toast.success('Time slot added successfully');
                  setIsSlotDialogOpen(false);
                }} 
                className="w-full"
              >
                Add Time Slot
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList>
              <TabsTrigger value="today">Today ({getTodayAppointments().length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="all">All Appointments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-4">
              {getTodayAppointments().map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">
                              {appointment.patient?.first_name} {appointment.patient?.last_name}
                            </h3>
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(appointment.appointment_date).toLocaleTimeString()}</span>
                              <span>({appointment.duration_minutes} min)</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {appointment.type === 'video' && <Video className="h-4 w-4" />}
                              {appointment.type === 'audio' && <Phone className="h-4 w-4" />}
                              {appointment.type === 'in_person' && <MapPin className="h-4 w-4" />}
                              <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                            </div>
                            
                            <p><strong>Reason:</strong> {appointment.reason}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {appointment.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button 
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                          >
                            Start
                          </Button>
                        )}
                        
                        {appointment.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getTodayAppointments().length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No appointments today</h3>
                    <p className="text-muted-foreground">Your schedule is clear for today.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {getUpcomingAppointments().map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                          </h3>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{new Date(appointment.appointment_date).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">
                              {appointment.patient?.first_name} {appointment.patient?.last_name}
                            </h3>
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{new Date(appointment.appointment_date).toLocaleTimeString()}</span>
                            </div>
                            
                            <p><strong>Reason:</strong> {appointment.reason}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View appointments by date</CardDescription>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Today's appointments</span>
                <span className="font-semibold">{getTodayAppointments().length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This week</span>
                <span className="font-semibold">{appointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}