import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from "@/utils/passwordValidation";

export function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));
  const { toast } = useToast();

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordValidation(validatePassword(newPassword));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        title: "Password Too Weak",
        description: passwordValidation.feedback[0] || "Please use a stronger password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Account created! Please check your email for verification.",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden flex items-center justify-center p-4 md:p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-healing-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-primary p-4 rounded-2xl shadow-glow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Welcome to HealthCare+</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your complete healthcare ecosystem awaits
          </p>
        </div>

        {/* Auth Card */}
        <Card className="glass-card border-2 border-primary/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription className="text-base">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/50 rounded-lg h-12">
                <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-semibold">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-semibold">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="medical"
                    className="w-full h-12 text-base font-semibold shadow-glow" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Sign In to Your Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm font-semibold">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm font-semibold">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-semibold">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-semibold">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className={`h-11 border-2 shadow-sm transition-all duration-300 ${!passwordValidation.isValid && password ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                    />
                    {password && (
                      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Password strength:</span>
                          <span className={`font-semibold ${passwordValidation.score < 60 ? 'text-destructive' : passwordValidation.score < 80 ? 'text-warning' : 'text-success'}`}>
                            {getPasswordStrengthText(passwordValidation.score)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordValidation.score)}`}
                            style={{ width: `${passwordValidation.score}%` }}
                          />
                        </div>
                        {passwordValidation.feedback.length > 0 && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning" />
                            <span>{passwordValidation.feedback[0]}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-semibold">Your Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="h-11 border-2 focus:border-primary shadow-sm transition-all duration-300">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="border-2">
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="provider">Healthcare Provider</SelectItem>
                        <SelectItem value="corporate">Corporate HR</SelectItem>
                        <SelectItem value="admin">System Administrator</SelectItem>
                        <SelectItem value="children">Child (TBI Recovery)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    variant="medical"
                    className="w-full h-12 text-base font-semibold shadow-glow" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Create Your Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-in fade-in duration-700 delay-300">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}