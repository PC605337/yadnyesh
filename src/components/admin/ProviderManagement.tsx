import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star, MapPin, Clock, Users, DollarSign, CheckCircle, XCircle, Search } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  totalConsultations: number;
  verificationStatus: "verified" | "pending" | "rejected";
  joinedDate: string;
  location: string;
  consultationFee: number;
  avatar?: string;
  licenseNumber: string;
  experience: number;
}

export function ProviderManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  
  const [providers] = useState<Provider[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@healthcare.com",
      specialties: ["Cardiology", "Internal Medicine"],
      rating: 4.8,
      totalConsultations: 1250,
      verificationStatus: "verified",
      joinedDate: "2023-01-15",
      location: "Mumbai, Maharashtra",
      consultationFee: 800,
      licenseNumber: "MH12345678",
      experience: 15
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      email: "priya.sharma@healthcare.com",
      specialties: ["Pediatrics", "Neonatology"],
      rating: 4.9,
      totalConsultations: 980,
      verificationStatus: "verified",
      joinedDate: "2023-03-20",
      location: "Delhi, Delhi",
      consultationFee: 700,
      licenseNumber: "DL87654321",
      experience: 10
    },
    {
      id: "3",
      name: "Dr. Amit Patel",
      email: "amit.patel@healthcare.com",
      specialties: ["Orthopedics"],
      rating: 4.6,
      totalConsultations: 650,
      verificationStatus: "pending",
      joinedDate: "2024-01-10",
      location: "Bangalore, Karnataka",
      consultationFee: 900,
      licenseNumber: "KA11223344",
      experience: 8
    },
    {
      id: "4",
      name: "Dr. Sneha Reddy",
      email: "sneha.reddy@healthcare.com",
      specialties: ["Dermatology", "Cosmetology"],
      rating: 4.7,
      totalConsultations: 875,
      verificationStatus: "verified",
      joinedDate: "2023-06-05",
      location: "Hyderabad, Telangana",
      consultationFee: 650,
      licenseNumber: "TS55667788",
      experience: 12
    },
    {
      id: "5",
      name: "Dr. Vikram Singh",
      email: "vikram.singh@healthcare.com",
      specialties: ["Neurology"],
      rating: 4.5,
      totalConsultations: 320,
      verificationStatus: "rejected",
      joinedDate: "2024-02-28",
      location: "Pune, Maharashtra",
      consultationFee: 1200,
      licenseNumber: "MH99887766",
      experience: 6
    }
  ]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    provider.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerificationAction = (providerId: string, action: "approve" | "reject") => {
    toast({
      title: `Provider ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `Provider verification status has been updated.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const verifiedProviders = providers.filter(p => p.verificationStatus === "verified");
  const pendingProviders = providers.filter(p => p.verificationStatus === "pending");
  const rejectedProviders = providers.filter(p => p.verificationStatus === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Provider Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Send Invitations</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Providers</p>
                <p className="text-2xl font-bold">{providers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{verifiedProviders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingProviders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Fee</p>
                <p className="text-2xl font-bold">₹{Math.round(providers.reduce((sum, p) => sum + p.consultationFee, 0) / providers.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers by name, specialty, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Providers ({providers.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedProviders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingProviders.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedProviders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={provider.avatar} />
                          <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{provider.name}</h3>
                            {getStatusBadge(provider.verificationStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">{provider.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {provider.location}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {provider.rating} ({provider.totalConsultations} consultations)
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ₹{provider.consultationFee}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {provider.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProvider(provider)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Provider Details</DialogTitle>
                            </DialogHeader>
                            {selectedProvider && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p className="font-medium">{selectedProvider.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="font-medium">{selectedProvider.email}</p>
                                  </div>
                                  <div>
                                    <Label>License Number</Label>
                                    <p className="font-medium">{selectedProvider.licenseNumber}</p>
                                  </div>
                                  <div>
                                    <Label>Experience</Label>
                                    <p className="font-medium">{selectedProvider.experience} years</p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <p className="font-medium">{selectedProvider.location}</p>
                                  </div>
                                  <div>
                                    <Label>Consultation Fee</Label>
                                    <p className="font-medium">₹{selectedProvider.consultationFee}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Specialties</Label>
                                  <div className="flex gap-2 mt-1">
                                    {selectedProvider.specialties.map((specialty) => (
                                      <Badge key={specialty} variant="secondary">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleVerificationAction(selectedProvider.id, "approve")}
                                    disabled={selectedProvider.verificationStatus === "verified"}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleVerificationAction(selectedProvider.id, "reject")}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4">
                {verifiedProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.specialties.join(", ")}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4">
                {pendingProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.specialties.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleVerificationAction(provider.id, "approve")}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleVerificationAction(provider.id, "reject")}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4">
                {rejectedProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.specialties.join(", ")}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}