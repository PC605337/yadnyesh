import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Stethoscope, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && profile) {
      navigate(`/${profile.role}`);
    }
  }, [user, profile, navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Healthcare Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive healthcare management for patients, providers, and healthcare organizations. 
            Experience the future of medical care with AI-powered insights and seamless connectivity.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="text-lg px-8 py-6 group"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>For Patients</CardTitle>
              <CardDescription>
                Comprehensive health management, telemedicine consultations, and AI-powered health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Digital health records</li>
                <li>• Video consultations</li>
                <li>• AI health assistant</li>
                <li>• Prescription management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit mb-4">
                <Stethoscope className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>For Providers</CardTitle>
              <CardDescription>
                Advanced practice management, patient engagement tools, and clinical decision support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Patient management</li>
                <li>• Appointment scheduling</li>
                <li>• Clinical workflows</li>
                <li>• Revenue tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>For Organizations</CardTitle>
              <CardDescription>
                Enterprise healthcare solutions with analytics, compliance, and integration capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Admin dashboards</li>
                <li>• Compliance management</li>
                <li>• Analytics & reporting</li>
                <li>• Integration APIs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Transform Healthcare?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of healthcare professionals and patients already using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="text-lg px-8 py-6"
              >
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
