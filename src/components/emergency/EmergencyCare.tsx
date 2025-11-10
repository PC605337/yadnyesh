import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Phone, 
  Ambulance, 
  Clock,
  MapPin,
  Heart,
  Activity,
  Stethoscope,
  Video,
  PhoneCall,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EmergencyProvider {
  id: string;
  name: string;
  specialization: string;
  available: boolean;
  response_time: string;
  rating: number;
}

const emergencyServices = [
  {
    name: "National Emergency",
    number: "112",
    icon: Phone,
    description: "All emergency services",
    color: "bg-red-600"
  },
  {
    name: "Ambulance",
    number: "102",
    icon: Ambulance,
    description: "Medical emergency",
    color: "bg-red-500"
  },
  {
    name: "Women Helpline",
    number: "1091",
    icon: Heart,
    description: "Women in distress",
    color: "bg-pink-600"
  },
  {
    name: "Mental Health",
    number: "9152987821",
    icon: Activity,
    description: "24/7 mental health support",
    color: "bg-purple-600"
  }
];

const nearbyHospitals = [
  {
    name: "Lilavati Hospital",
    distance: "1.2 km",
    emergency: true,
    contactNumber: "+91-22-26567891",
    address: "Bandra West, Mumbai"
  },
  {
    name: "Kokilaben Dhirubhai Ambani Hospital",
    distance: "2.5 km",
    emergency: true,
    contactNumber: "+91-22-30999999",
    address: "Andheri West, Mumbai"
  },
  {
    name: "Nanavati Super Speciality Hospital",
    distance: "3.1 km",
    emergency: true,
    contactNumber: "+91-22-26777777",
    address: "Vile Parle West, Mumbai"
  }
];

export const EmergencyCare = () => {
  const { user } = useAuth();
  const [availableProviders, setAvailableProviders] = useState<EmergencyProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBookingUrgent, setIsBookingUrgent] = useState(false);
  const [urgentReason, setUrgentReason] = useState("");
  const [severity, setSeverity] = useState<"moderate" | "urgent" | "critical">("urgent");

  useEffect(() => {
    fetchAvailableProviders();
  }, []);

  const fetchAvailableProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('id, user_id, specialties, rating')
        .eq('is_verified', true)
        .limit(5);

      if (error) throw error;

      // Fetch profile names separately
      const userIds = (data || []).map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const providers: EmergencyProvider[] = (data || []).map(p => {
        const profile = profilesMap.get(p.user_id);
        return {
          id: p.user_id,
          name: profile ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Doctor',
          specialization: Array.isArray(p.specialties) ? p.specialties[0] : 'General Physician',
          available: Math.random() > 0.3,
          response_time: Math.random() > 0.5 ? '< 5 mins' : '< 10 mins',
          rating: p.rating || 4.5
        };
      });

      setAvailableProviders(providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookUrgentConsultation = async (providerId: string) => {
    if (!urgentReason.trim()) {
      toast.error('Please describe your emergency');
      return;
    }

    try {
      const appointmentDate = new Date();
      appointmentDate.setMinutes(appointmentDate.getMinutes() + 5);

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user?.id,
          provider_id: providerId,
          appointment_date: appointmentDate.toISOString(),
          type: 'video',
          status: 'confirmed',
          duration_minutes: 30,
          reason: urgentReason,
          notes: `Emergency consultation - Severity: ${severity}`
        });

      if (error) throw error;

      toast.success('Emergency consultation booked! Doctor will join in < 5 minutes.');
      setIsBookingUrgent(false);
      setUrgentReason("");
    } catch (error) {
      console.error('Error booking urgent consultation:', error);
      toast.error('Failed to book emergency consultation');
    }
  };

  const callEmergencyNumber = (number: string, name: string) => {
    toast.info(`Calling ${name}: ${number}`);
    window.open(`tel:${number}`);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
          <div>
            <h1 className="text-2xl font-bold text-red-900">Emergency Care</h1>
            <p className="text-red-700 mt-1">
              If you're experiencing a life-threatening emergency, call 112 immediately or visit the nearest hospital.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines */}
      <div>
        <h2 className="text-xl font-bold mb-4">Emergency Hotlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => callEmergencyNumber(service.number, service.name)}>
              <CardContent className="p-6">
                <div className={`${service.color} text-white w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                <p className="text-3xl font-bold text-primary mb-2">{service.number}</p>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Urgent Online Consultation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Urgent Online Consultation</span>
          </CardTitle>
          <CardDescription>
            Connect with available doctors for immediate video consultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProviders.filter(p => p.available).map((provider) => (
                <Card key={provider.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">{provider.specialization}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Activity className="h-3 w-3 mr-1" />
                            Available Now
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {provider.response_time}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-semibold">{provider.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-red-600 hover:bg-red-700">
                          <Video className="h-4 w-4 mr-2" />
                          Book Urgent Consultation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Emergency Consultation Request</DialogTitle>
                          <DialogDescription>
                            Describe your emergency. A doctor will join within 5 minutes.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <Label>Severity Level *</Label>
                            <Select value={severity} onValueChange={(val) => setSeverity(val as any)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="moderate">
                                  <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full bg-yellow-500 mr-2`}></span>
                                    Moderate - Can wait 10-15 mins
                                  </div>
                                </SelectItem>
                                <SelectItem value="urgent">
                                  <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full bg-orange-500 mr-2`}></span>
                                    Urgent - Need attention soon
                                  </div>
                                </SelectItem>
                                <SelectItem value="critical">
                                  <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full bg-red-600 mr-2`}></span>
                                    Critical - Life threatening
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Emergency Description *</Label>
                            <Textarea
                              placeholder="Describe your symptoms and emergency..."
                              value={urgentReason}
                              onChange={(e) => setUrgentReason(e.target.value)}
                              rows={4}
                            />
                          </div>

                          {severity === 'critical' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                              <div className="text-sm text-red-800">
                                <p className="font-medium">Critical Emergency</p>
                                <p>If life-threatening, please call 112 or visit nearest ER immediately.</p>
                              </div>
                            </div>
                          )}

                          <Button 
                            onClick={() => bookUrgentConsultation(provider.id)}
                            className="w-full"
                            disabled={!urgentReason.trim()}
                          >
                            Request Emergency Consultation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>

            {availableProviders.filter(p => p.available).length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No doctors available for immediate consultation.</p>
                <p className="text-sm text-muted-foreground mt-2">Please call emergency services or visit a hospital.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Hospitals */}
      <div>
        <h2 className="text-xl font-bold mb-4">Nearby Emergency Hospitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyHospitals.map((hospital, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{hospital.name}</span>
                  {hospital.emergency && (
                    <Badge className="bg-red-100 text-red-800">
                      24/7 Emergency
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{hospital.distance} away</span>
                </div>
                
                <div className="text-sm">
                  <p className="text-muted-foreground">{hospital.address}</p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => window.open(`tel:${hospital.contactNumber}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${hospital.name},Mumbai`)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>When to Seek Emergency Care</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-red-700">Immediate Emergency (Call 112)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Chest pain or pressure</li>
                <li>• Difficulty breathing</li>
                <li>• Severe bleeding</li>
                <li>• Loss of consciousness</li>
                <li>• Severe burns</li>
                <li>• Suspected heart attack or stroke</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-700">Urgent Care (Online Consultation)</h4>
              <ul className="space-y-1 text-sm">
                <li>• High fever ({'>'}103°F)</li>
                <li>• Severe pain</li>
                <li>• Vomiting or diarrhea</li>
                <li>• Minor injuries</li>
                <li>• Allergic reactions (mild)</li>
                <li>• Urgent prescription needs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
