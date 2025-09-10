import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  Search, 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  ShoppingCart,
  ArrowLeftRight,
  Truck,
  Shield,
  Camera
} from "lucide-react";

interface Prescription {
  id: string;
  doctor: string;
  date: string;
  status: "new" | "processing" | "ready" | "delivered";
  medicines: Medicine[];
  totalAmount: number;
  insuranceCovered: boolean;
}

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  price: number;
  genericAvailable: boolean;
}

const PrescriptionManagement = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");
  
  const prescriptions: Prescription[] = [
    {
      id: "RX001",
      doctor: "Dr. Priya Sharma",
      date: "2024-01-15",
      status: "ready",
      medicines: [
        {
          name: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "5 days",
          price: 45,
          genericAvailable: true
        },
        {
          name: "Amoxicillin 250mg",
          dosage: "250mg", 
          frequency: "Three times daily",
          duration: "7 days",
          price: 120,
          genericAvailable: true
        }
      ],
      totalAmount: 165,
      insuranceCovered: true
    },
    {
      id: "RX002",
      doctor: "Dr. Rajesh Kumar",
      date: "2024-01-10",
      status: "delivered",
      medicines: [
        {
          name: "Atorvastatin 20mg",
          dosage: "20mg",
          frequency: "Once daily",
          duration: "30 days",
          price: 280,
          genericAvailable: true
        }
      ],
      totalAmount: 280,
      insuranceCovered: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="h-4 w-4 text-warning" />;
      case "processing": return <AlertCircle className="h-4 w-4 text-primary" />;
      case "ready": return <CheckCircle className="h-4 w-4 text-healing-green" />;
      case "delivered": return <Truck className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-warning/10 text-warning border-warning";
      case "processing": return "bg-primary/10 text-primary border-primary";
      case "ready": return "bg-healing-green/10 text-healing-green border-healing-green";
      case "delivered": return "bg-muted text-muted-foreground border-muted";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Prescription Management
          </h1>
          <p className="text-muted-foreground">
            Upload, manage, and order your medicines with insurance coverage
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          <button
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload Prescription
          </button>
          <button
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "manage"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Prescriptions
          </button>
        </div>

        {activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Methods */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Prescription
                  </CardTitle>
                  <CardDescription>
                    Upload your prescription image for AI-powered medicine detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg font-medium mb-2">Drag & drop your prescription</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports JPG, PNG, PDF files up to 5MB
                    </p>
                    <Button className="mb-3">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                      <span>or</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo with Camera
                  </Button>
                </CardContent>
              </Card>

              {/* AI Features */}
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Smart Medicine Detection</p>
                        <p className="text-sm text-muted-foreground">AI reads handwritten prescriptions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-healing-green/10 rounded-lg flex items-center justify-center">
                        <ArrowLeftRight className="h-4 w-4 text-healing-green" />
                      </div>
                      <div>
                        <p className="font-medium">Price Comparison</p>
                        <p className="text-sm text-muted-foreground">Compare across multiple pharmacies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Insurance Coverage</p>
                        <p className="text-sm text-muted-foreground">Automatic insurance verification</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Order */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Medicine Search</CardTitle>
                  <CardDescription>
                    Can't find your prescription? Search medicines directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search medicine by name..."
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Popular Medicines</p>
                    <div className="flex flex-wrap gap-2">
                      {["Paracetamol", "Crocin", "Dolo 650", "Azithromycin", "Cetirizine"].map((medicine) => (
                        <Badge key={medicine} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {medicine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Paracetamol 500mg</p>
                        <p className="text-sm text-muted-foreground">Dr. Priya Sharma</p>
                      </div>
                      <Button size="sm" variant="outline">Reorder</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Atorvastatin 20mg</p>
                        <p className="text-sm text-muted-foreground">Dr. Rajesh Kumar</p>
                      </div>
                      <Button size="sm" variant="outline">Reorder</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter
              </Button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">Prescription #{prescription.id}</CardTitle>
                          <Badge variant="outline" className={getStatusColor(prescription.status)}>
                            {getStatusIcon(prescription.status)}
                            {prescription.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">
                          {prescription.doctor} • {prescription.date}
                        </CardDescription>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{prescription.totalAmount}</p>
                        {prescription.insuranceCovered && (
                          <Badge variant="outline" className="bg-healing-green/10 text-healing-green">
                            <Shield className="h-3 w-3 mr-1" />
                            Covered
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Medicines */}
                    <div className="space-y-3 mb-4">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Pill className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {medicine.frequency} • {medicine.duration}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">₹{medicine.price}</p>
                            {medicine.genericAvailable && (
                              <Badge variant="outline">Generic Available</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <ArrowLeftRight className="h-4 w-4 mr-1" />
                          Compare Prices
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {prescription.status === "ready" && (
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Order Now
                          </Button>
                        )}
                        {prescription.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionManagement;