import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  Star, 
  Video, 
  MessageCircle, 
  Phone,
  Clock,
  MapPin,
  Shield,
  Calendar,
  Navigation,
  User
} from "lucide-react";

interface Provider {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  experience_years: number;
  consultation_fee: number;
  bio: string;
  certifications: any;
  is_verified: boolean;
  available_slots: any;
  user_id: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  healthcare_provider?: {
    name: string;
    city: string;
    state: string;
    address: any;
    services: any;
    insurance_accepted: any;
    pricing_info: any;
    location_coords: any;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  providerId: string;
  date: string;
  time: string;
  type: 'video' | 'audio' | 'in-person';
}

const ConsultationBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const specialties = [
    "General Medicine", 
    "Cardiology", 
    "Mental Health", 
    "Dermatology", 
    "Pediatrics", 
    "Gynecology",
    "Orthopedics",
    "Neurology",
    "Gastroenterology",
    "Oncology"
  ];

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  useEffect(() => {
    fetchProviders();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      generateTimeSlots();
    }
  }, [selectedProvider, selectedDate]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied or error:", error);
        }
      );
    }
  };

  const fetchProviders = async () => {
    try {
      // First, get all provider profiles
      const { data: providerProfiles, error: providerError } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('is_verified', true);

      if (providerError) throw providerError;

      if (!providerProfiles || providerProfiles.length === 0) {
        setProviders([]);
        return;
      }

      // Get user IDs from provider profiles
      const userIds = providerProfiles.map(p => p.user_id);

      // Fetch corresponding user profiles
      const { data: userProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
      }

      // Fetch healthcare providers separately
      const { data: healthcareProviders } = await supabase
        .from('healthcare_providers')
        .select('*');

      const formattedProviders = providerProfiles.map(provider => {
        const profile = userProfiles?.find(p => p.user_id === provider.user_id);
        const healthcareProvider = healthcareProviders?.find(hp => 
          hp.name.toLowerCase().includes(profile?.first_name?.toLowerCase() || '') ||
          hp.name.toLowerCase().includes(profile?.last_name?.toLowerCase() || '')
        );

        return {
          id: provider.id,
          name: `Dr. ${profile?.first_name || 'Unknown'} ${profile?.last_name || 'Doctor'}`,
          specialties: provider.specialties || [],
          rating: provider.rating || 4.5,
          experience_years: provider.experience_years || 0,
          consultation_fee: provider.consultation_fee || 500,
          bio: provider.bio || '',
          certifications: provider.certifications,
          is_verified: provider.is_verified,
          available_slots: provider.available_slots,
          user_id: provider.user_id,
          profile: profile ? {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            avatar_url: profile.avatar_url || undefined
          } : {
            first_name: 'Unknown',
            last_name: 'Doctor',
            email: '',
            avatar_url: undefined
          },
          healthcare_provider: healthcareProvider
        };
      });

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load healthcare providers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      ['00', '30'].forEach(minute => {
        const time12 = hour > 12 ? `${hour - 12}:${minute} PM` : `${hour}:${minute} AM`;
        slots.push({
          time: time12,
          available: Math.random() > 0.3 // Random availability for demo
        });
      });
    }
    
    setAvailableSlots(slots);
  };

  const calculateDistance = (providerCoords: any) => {
    if (!userLocation || !providerCoords) return null;
    
    // Simple distance calculation (in a real app, use proper geolocation APIs)
    const R = 6371; // Earth's radius in km
    const dLat = (userLocation.lat - providerCoords.lat) * Math.PI / 180;
    const dLon = (userLocation.lng - providerCoords.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(providerCoords.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  const handleBookAppointment = async (bookingData: BookingData) => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please login to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentData = {
        patient_id: user.id,
        provider_id: bookingData.providerId,
        appointment_date: new Date(`${bookingData.date} ${bookingData.time}`).toISOString(),
        type: bookingData.type,
        status: 'scheduled',
        duration_minutes: 30,
        fee_amount: selectedProvider?.consultation_fee || 500,
        reason: 'General consultation'
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${selectedProvider?.name} has been scheduled.`,
      });

      setBookingDialog(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = searchQuery === "" || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === "all" || 
      provider.specialties.includes(selectedSpecialty);
    
    const matchesCity = selectedCity === "all" || 
      provider.healthcare_provider?.city === selectedCity;
    
    return matchesSearch && matchesSpecialty && matchesCity;
  });

  // Sort by distance if user location is available
  const sortedProviders = userLocation ? 
    filteredProviders.sort((a, b) => {
      const distanceA = calculateDistance(a.healthcare_provider?.location_coords);
      const distanceB = calculateDistance(b.healthcare_provider?.location_coords);
      if (!distanceA) return 1;
      if (!distanceB) return -1;
      return parseFloat(distanceA) - parseFloat(distanceB);
    }) : filteredProviders;

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "audio": return <Phone className="h-4 w-4" />;
      case "chat": return <MessageCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Book a Consultation
          </h1>
          <p className="text-muted-foreground">
            Find and connect with verified healthcare professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors, specialties, symptoms..."
              className="pl-10 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="py-3">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="py-3">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Shield className="h-3 w-3 mr-1" />
            Insurance Accepted
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Video className="h-3 w-3 mr-1" />
            Video Consultation
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Available Today
          </Badge>
          {userLocation && (
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              <Navigation className="h-3 w-3 mr-1" />
              Near Me
            </Badge>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${sortedProviders.length} doctors found`}
            {userLocation && " (sorted by distance)"}
          </p>
        </div>

        {/* Providers List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedProviders.map((provider) => {
              const distance = userLocation && provider.healthcare_provider?.location_coords 
                ? calculateDistance(provider.healthcare_provider.location_coords)
                : null;
              
              return (
                <Card key={provider.id} className="hover:shadow-medical transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          {provider.profile?.avatar_url ? (
                            <img 
                              src={provider.profile.avatar_url} 
                              alt={provider.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <CardTitle className="text-xl">{provider.name}</CardTitle>
                          <CardDescription className="text-base text-primary font-medium">
                            {provider.specialties.join(', ') || 'General Medicine'}
                          </CardDescription>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-warning text-warning" />
                              <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{provider.experience_years} years exp.</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {provider.healthcare_provider?.city || 'Mumbai'}
                              {distance && ` • ${distance} km away`}
                            </span>
                            {provider.healthcare_provider?.insurance_accepted?.length > 0 && (
                              <Badge variant="outline" className="ml-2 bg-healing-green/10 text-healing-green">
                                <Shield className="h-3 w-3 mr-1" />
                                Insurance
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{provider.consultation_fee}</p>
                        <p className="text-sm text-muted-foreground">Consultation</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Bio */}
                    {provider.bio && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{provider.bio}</p>
                      </div>
                    )}

                    {/* Services */}
                    {provider.healthcare_provider?.services && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Services</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.healthcare_provider.services.slice(0, 3).map((service: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Consultation Types */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Available Consultations</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Audio
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          In-Person
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Dialog open={bookingDialog && selectedProvider?.id === provider.id} onOpenChange={setBookingDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1"
                            onClick={() => setSelectedProvider(provider)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Book Appointment with {provider.name}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium">Select Date</label>
                              <Input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">Select Time</label>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {availableSlots.filter(slot => slot.available).slice(0, 9).map((slot) => (
                                  <Button
                                    key={slot.time}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      handleBookAppointment({
                                        providerId: provider.user_id,
                                        date: selectedDate,
                                        time: slot.time,
                                        type: 'video'
                                      });
                                    }}
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="flex justify-between text-sm">
                                <span>Consultation Fee:</span>
                                <span className="font-semibold">₹{provider.consultation_fee}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && sortedProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Doctors
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationBooking;