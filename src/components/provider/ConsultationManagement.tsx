import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  FileText, 
  Stethoscope,
  Pill,
  Calendar,
  Search,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Consultation {
  id: string;
  patient_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'video' | 'audio' | 'in_person';
  status: string;
  reason: string;
  notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_date?: string;
  patient?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
}

export function ConsultationManagement() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  
  const [consultationNotes, setConsultationNotes] = useState({
    diagnosis: '',
    treatment_plan: '',
    notes: '',
    follow_up_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchConsultations();
    }
  }, [user]);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!inner(
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .eq('provider_id', user?.id)
        .in('status', ['in_progress', 'completed'])
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      setConsultations(data?.map(consultation => ({
        ...consultation,
        type: consultation.type as 'video' | 'audio' | 'in_person',
        patient: consultation.patient as any
      })) || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'in_progress',
          notes: 'Consultation started'
        })
        .eq('id', consultationId);

      if (error) throw error;

      toast.success('Consultation started');
      fetchConsultations();
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  const completeConsultation = async () => {
    if (!selectedConsultation) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          notes: JSON.stringify({
            diagnosis: consultationNotes.diagnosis,
            treatment_plan: consultationNotes.treatment_plan,
            notes: consultationNotes.notes,
            follow_up_date: consultationNotes.follow_up_date
          })
        })
        .eq('id', selectedConsultation.id);

      if (error) throw error;

      toast.success('Consultation completed');
      setIsNotesDialogOpen(false);
      setSelectedConsultation(null);
      setConsultationNotes({ diagnosis: '', treatment_plan: '', notes: '', follow_up_date: '' });
      fetchConsultations();
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Failed to complete consultation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConsultations = consultations.filter(consultation => 
    `${consultation.patient?.first_name} ${consultation.patient?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading consultations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Consultation Management</h1>
          <p className="text-muted-foreground">Manage patient consultations and medical notes</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search consultations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({consultations.filter(c => c.status === 'in_progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({consultations.filter(c => c.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="all">All Consultations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {filteredConsultations
            .filter(consultation => consultation.status === 'in_progress')
            .map((consultation) => (
            <Card key={consultation.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={consultation.patient?.avatar_url} />
                      <AvatarFallback>
                        {consultation.patient?.first_name?.[0]}{consultation.patient?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {consultation.patient?.first_name} {consultation.patient?.last_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(consultation.status)}>
                          In Progress
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(consultation.appointment_date).toLocaleString()}</span>
                          <Clock className="h-4 w-4 ml-4" />
                          <span>{consultation.duration_minutes} minutes</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {consultation.type === 'video' && <Video className="h-4 w-4" />}
                          {consultation.type === 'audio' && <Phone className="h-4 w-4" />}
                          {consultation.type === 'in_person' && <MapPin className="h-4 w-4" />}
                          <span className="capitalize">{consultation.type.replace('_', ' ')} consultation</span>
                        </div>
                        
                        <p className="mt-2"><strong>Chief Complaint:</strong> {consultation.reason}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {consultation.type === 'video' && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Video
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setIsNotesDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredConsultations.filter(c => c.status === 'in_progress').length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active consultations</h3>
                <p className="text-muted-foreground">All consultations are completed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredConsultations
            .filter(consultation => consultation.status === 'completed')
            .map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={consultation.patient?.avatar_url} />
                      <AvatarFallback>
                        {consultation.patient?.first_name?.[0]}{consultation.patient?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">
                          {consultation.patient?.first_name} {consultation.patient?.last_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(consultation.status)}>
                          Completed
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(consultation.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <p><strong>Reason:</strong> {consultation.reason}</p>
                        {consultation.notes && (
                          <p><strong>Notes:</strong> {typeof consultation.notes === 'string' ? consultation.notes : 'Consultation completed'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={consultation.patient?.avatar_url} />
                      <AvatarFallback>
                        {consultation.patient?.first_name?.[0]}{consultation.patient?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">
                          {consultation.patient?.first_name} {consultation.patient?.last_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(consultation.status)}>
                          {consultation.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(consultation.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <p><strong>Reason:</strong> {consultation.reason}</p>
                      </div>
                    </div>
                  </div>
                  
                  {consultation.status === 'in_progress' && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setIsNotesDialogOpen(true);
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Consultation Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultation Notes</DialogTitle>
            <DialogDescription>
              Complete the consultation for {selectedConsultation?.patient?.first_name} {selectedConsultation?.patient?.last_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis and findings..."
                value={consultationNotes.diagnosis}
                onChange={(e) => setConsultationNotes({...consultationNotes, diagnosis: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea
                id="treatment"
                placeholder="Enter treatment plan and recommendations..."
                value={consultationNotes.treatment_plan}
                onChange={(e) => setConsultationNotes({...consultationNotes, treatment_plan: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional observations or notes..."
                value={consultationNotes.notes}
                onChange={(e) => setConsultationNotes({...consultationNotes, notes: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="follow_up">Follow-up Date (Optional)</Label>
              <Input
                type="date"
                id="follow_up"
                value={consultationNotes.follow_up_date}
                onChange={(e) => setConsultationNotes({...consultationNotes, follow_up_date: e.target.value})}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={completeConsultation} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Complete Consultation
              </Button>
              <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}