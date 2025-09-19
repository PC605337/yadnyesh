import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  UserCheck, 
  Shield, 
  Building2, 
  Heart, 
  Users, 
  CreditCard,
  Briefcase 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserRole {
  role: string;
  is_active: boolean;
}

const roleConfig = {
  admin: { 
    label: "Admin", 
    icon: Shield, 
    path: "/admin",
    color: "bg-red-500 text-red-50",
    description: "System administration and management"
  },
  provider: { 
    label: "Healthcare Provider", 
    icon: Heart, 
    path: "/provider",
    color: "bg-blue-500 text-blue-50",
    description: "Doctor, nurse, or medical professional"
  },
  corporate: { 
    label: "Corporate", 
    icon: Building2, 
    path: "/corporate",
    color: "bg-purple-500 text-purple-50",
    description: "Corporate healthcare management"
  },
  patient: { 
    label: "Patient", 
    icon: Users, 
    path: "/patient",
    color: "bg-green-500 text-green-50",
    description: "Patient healthcare services"
  },
  // Future roles can be added here
  insurance: { 
    label: "Insurance", 
    icon: CreditCard, 
    path: "/insurance",
    color: "bg-orange-500 text-orange-50",
    description: "Insurance management and claims"
  },
  pharmacy: { 
    label: "Pharmacy", 
    icon: Briefcase, 
    path: "/pharmacy",
    color: "bg-teal-500 text-teal-50",
    description: "Pharmacy operations and prescriptions"
  },
};

export const RoleSwitcher = () => {
  const { user, profile, switchRole: authSwitchRole } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [currentRole, setCurrentRole] = useState(profile?.role || 'patient');
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchUserRoles();
    }
  }, [user?.id]);

  useEffect(() => {
    setCurrentRole(profile?.role || 'patient');
  }, [profile?.role]);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      
      // Filter roles to only include those that have valid configurations
      const validRoles = (data || []).filter(role => 
        roleConfig[role.role as keyof typeof roleConfig]
      );
      
      setAvailableRoles(validRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const switchRole = async (newRole: string) => {
    if (newRole === currentRole || switching) return;

    setSwitching(true);
    
    // Update role in auth context immediately
    authSwitchRole(newRole);
    setCurrentRole(newRole);
    
    // Navigate to new role path
    const rolePath = roleConfig[newRole as keyof typeof roleConfig]?.path;
    if (rolePath) {
      navigate(rolePath);
      toast.success(`Switched to ${roleConfig[newRole as keyof typeof roleConfig].label} role`);
    }
    
    // Small delay to allow navigation to complete
    setTimeout(() => setSwitching(false), 300);
  };

  // If user only has one role, don't show switcher
  if (availableRoles.length <= 1) {
    const CurrentIcon = roleConfig[currentRole as keyof typeof roleConfig]?.icon || UserCheck;
    return (
      <Badge className={roleConfig[currentRole as keyof typeof roleConfig]?.color || "bg-primary text-primary-foreground"}>
        <CurrentIcon className="h-3 w-3 mr-1" />
        {roleConfig[currentRole as keyof typeof roleConfig]?.label || currentRole}
      </Badge>
    );
  }

  const CurrentIcon = roleConfig[currentRole as keyof typeof roleConfig]?.icon || UserCheck;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={switching}
          className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border-border/50"
        >
          <CurrentIcon className={cn("h-4 w-4", switching && "animate-spin")} />
          <span className="font-medium">
            {switching ? "Switching..." : roleConfig[currentRole as keyof typeof roleConfig]?.label || currentRole}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-background/95 backdrop-blur-sm border-border/50 shadow-lg"
      >
        {availableRoles.map((userRole) => {
          const config = roleConfig[userRole.role as keyof typeof roleConfig];
          const Icon = config?.icon || UserCheck;
          const isActive = userRole.role === currentRole;
          
          return (
            <DropdownMenuItem
              key={userRole.role}
              onClick={() => switchRole(userRole.role)}
              className={cn(
                "flex items-start gap-3 cursor-pointer p-3",
                isActive && "bg-muted font-medium"
              )}
            >
              <Icon className="h-4 w-4 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{config?.label || userRole.role}</span>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                {config?.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {config.description}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};