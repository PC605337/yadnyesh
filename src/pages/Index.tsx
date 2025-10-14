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
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-healing-green/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-primary p-6 rounded-3xl shadow-glow">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="gradient-text">Healthcare Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Experience the future of medical care with AI-powered insights, seamless connectivity, 
            and comprehensive healthcare management designed for the modern world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button 
              onClick={handleGetStarted}
              variant="medical"
              size="hero" 
              className="group shadow-glow"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button 
              variant="glass"
              size="hero"
              className="group"
            >
              Watch Demo
              <Shield className="ml-2 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="text-center group hover-lift border-0 hover:border-gradient animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <CardHeader>
              <div className="mx-auto relative mb-6">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-primary-light p-5 rounded-2xl w-fit mx-auto shadow-md group-hover:shadow-xl transition-all duration-300">
                  <Users className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">For Patients</CardTitle>
              <CardDescription className="text-base">
                Comprehensive health management, telemedicine consultations, and AI-powered health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left text-muted-foreground space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Digital health records</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Video consultations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>AI health assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Prescription management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center group hover-lift border-0 hover:border-gradient animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader>
              <div className="mx-auto relative mb-6">
                <div className="absolute inset-0 bg-gradient-healing rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-success-light p-5 rounded-2xl w-fit mx-auto shadow-md group-hover:shadow-xl transition-all duration-300">
                  <Stethoscope className="h-10 w-10 text-success" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">For Providers</CardTitle>
              <CardDescription className="text-base">
                Advanced practice management, patient engagement tools, and clinical decision support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left text-muted-foreground space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Patient management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Appointment scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Clinical workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Revenue tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center group hover-lift border-0 hover:border-gradient animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <CardHeader>
              <div className="mx-auto relative mb-6">
                <div className="absolute inset-0 bg-gradient-trust rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-accent-light p-5 rounded-2xl w-fit mx-auto shadow-md group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-10 w-10 text-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">For Organizations</CardTitle>
              <CardDescription className="text-base">
                Enterprise healthcare solutions with analytics, compliance, and integration capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left text-muted-foreground space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Admin dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Compliance management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Analytics & reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Integration APIs</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <Card className="max-w-3xl mx-auto glass-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 shadow-2xl hover:shadow-glow">
            <CardHeader className="space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Ready to Transform Healthcare?
              </CardTitle>
              <CardDescription className="text-lg md:text-xl">
                Join thousands of healthcare professionals and patients already using our platform to revolutionize medical care
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <Button 
                onClick={handleGetStarted}
                variant="medical"
                size="hero"
                className="shadow-glow"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free 30-day trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
