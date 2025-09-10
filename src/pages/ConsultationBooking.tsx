import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Calendar
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: number;
  fee: number;
  availableSlots: string[];
  consultationTypes: ("video" | "audio" | "chat")[];
  location: string;
  insuranceAccepted: boolean;
  image?: string;
}

const ConsultationBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      rating: 4.8,
      reviews: 324,
      experience: 12,
      fee: 500,
      availableSlots: ["2:30 PM", "3:00 PM", "4:30 PM"],
      consultationTypes: ["video", "audio", "chat"],
      location: "Mumbai",
      insuranceAccepted: true
    },
    {
      id: "2", 
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      rating: 4.9,
      reviews: 156,
      experience: 15,
      fee: 800,
      availableSlots: ["10:00 AM", "11:30 AM", "2:00 PM"],
      consultationTypes: ["video", "audio"],
      location: "Delhi",
      insuranceAccepted: true
    },
    {
      id: "3",
      name: "Dr. Anita Mehta",
      specialty: "Mental Health",
      rating: 4.7,
      reviews: 89,
      experience: 8,
      fee: 600,
      availableSlots: ["9:00 AM", "1:00 PM", "5:00 PM"],
      consultationTypes: ["video", "chat"],
      location: "Bangalore",
      insuranceAccepted: false
    }
  ];

  const specialties = [
    "General Medicine", 
    "Cardiology", 
    "Mental Health", 
    "Dermatology", 
    "Pediatrics", 
    "Gynecology"
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors, specialties, symptoms..."
              className="pl-10 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <select 
              className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
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
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-medical transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-base text-primary font-medium">
                        {doctor.specialty}
                      </CardDescription>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-semibold">{doctor.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({doctor.reviews} reviews)
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doctor.experience} years exp.</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{doctor.location}</span>
                        {doctor.insuranceAccepted && (
                          <Badge variant="outline" className="ml-2 bg-healing-green/10 text-healing-green">
                            <Shield className="h-3 w-3 mr-1" />
                            Insurance
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{doctor.fee}</p>
                    <p className="text-sm text-muted-foreground">Consultation</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Available Slots */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Available Today</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availableSlots.map((slot) => (
                      <Badge key={slot} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Consultation Types</p>
                  <div className="flex gap-2">
                    {doctor.consultationTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {getConsultationIcon(type)}
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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