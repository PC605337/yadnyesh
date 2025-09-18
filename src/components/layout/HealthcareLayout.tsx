import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RealTimeNotifications } from "@/components/notifications/RealTimeNotifications";
import { 
  Bell, 
  Menu, 
  Search, 
  Home,
  Calendar,
  Users,
  Pill,
  FileText,
  Shield,
  Settings,
  LogOut,
  Video,
  Activity,
  Building2,
  Heart,
  CreditCard,
  Wallet,
  TrendingUp,
  Link as LinkIcon,
  Upload,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface HealthcareLayoutProps {
  children: React.ReactNode;
}

const navigationByRole = {
  patient: [
    { name: "Dashboard", href: "/patient", icon: Home },
    { name: "Book Consultation", href: "/patient/consultation", icon: Video },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar, badge: "2" },
    { name: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
    { name: "Health Records", href: "/patient/records", icon: FileText },
    { name: "Upload Documents", href: "/patient/upload-documents", icon: Upload },
    { name: "Insurance", href: "/patient/insurance", icon: Shield },
    { name: "Wellness", href: "/patient/wellness", icon: Heart },
    { name: "Analytics", href: "/patient/analytics", icon: TrendingUp },
    { name: "Security", href: "/patient/security", icon: Shield },
    { name: "Payments", href: "/patient/payments", icon: CreditCard },
    { name: "Wallet", href: "/patient/wallet", icon: Wallet },
    { name: "Privacy & Consent", href: "/patient/consent-manager", icon: Shield },
    { name: "Help & Support", href: "/patient/help-support", icon: HelpCircle },
  ],
  provider: [
    { name: "Dashboard", href: "/provider", icon: Home },
    { name: "Patients", href: "/provider/patients", icon: Users },
    { name: "Schedule", href: "/provider/schedule", icon: Calendar, badge: "12" },
    { name: "Consultations", href: "/provider/consultations", icon: Video },
    { name: "Earnings", href: "/provider/earnings", icon: Activity },
    { name: "Payment Links", href: "/provider/payment-links", icon: LinkIcon },
    { name: "Verification", href: "/provider/verification", icon: Shield },
    { name: "Settings", href: "/provider/settings", icon: Settings },
  ],
  corporate: [
    { name: "Dashboard", href: "/corporate", icon: Home },
    { name: "Employees", href: "/corporate/employees", icon: Users },
    { name: "Programs", href: "/corporate/programs", icon: Heart },
    { name: "Analytics", href: "/corporate/analytics", icon: Activity },
    { name: "Billing", href: "/corporate/billing", icon: FileText },
    { name: "Settings", href: "/corporate/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Providers", href: "/admin/providers", icon: Building2 },
    { name: "Doctor Verification", href: "/admin/doctor-verification", icon: Shield },
    { name: "System", href: "/admin/system", icon: Settings },
    { name: "Analytics", href: "/admin/analytics", icon: Activity },
  ],
};

export function HealthcareLayout({ children }: HealthcareLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  if (!profile) return null;
  
  const userRole = profile.role as "patient" | "provider" | "corporate" | "admin";
  const navigation = navigationByRole[userRole];
  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'User';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-primary">HealthCare+</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-medical"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="ml-3">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search patients, appointments..."
                  className="pl-10 pr-4 py-2 bg-muted/50 rounded-lg border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-colors w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <RealTimeNotifications />
              
              {userRole === "provider" && (
                <Badge variant="outline" className="bg-healing-green/10 text-healing-green border-healing-green">
                  <div className="w-2 h-2 bg-healing-green rounded-full mr-1" />
                  Online
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}