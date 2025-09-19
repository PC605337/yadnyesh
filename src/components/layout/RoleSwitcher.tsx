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
import { ChevronDown, UserCheck, Shield, Building2 } from "lucide-react";
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
    color: "bg-red-500 text-red-50"
  },
  provider: { 
    label: "Provider", 
    icon: UserCheck, 
    path: "/provider",
    color: "bg-blue-500 text-blue-50"
  },
  corporate: { 
    label: "Corporate", 
    icon: Building2, 
    path: "/corporate",
    color: "bg-purple-500 text-purple-50"
  },
  patient: { 
    label: "Patient", 
    icon: UserCheck, 
    path: "/patient",
    color: "bg-green-500 text-green-50"
  },
};

export const RoleSwitcher = () => {
  const { user, profile } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [currentRole, setCurrentRole] = useState(profile?.role || 'patient');
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
      setAvailableRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const switchRole = (newRole: string) => {
    if (newRole === currentRole) return;

    setCurrentRole(newRole);
    const rolePath = roleConfig[newRole as keyof typeof roleConfig]?.path;
    if (rolePath) {
      navigate(rolePath);
      toast.success(`Switched to ${roleConfig[newRole as keyof typeof roleConfig].label} role`);
    }
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
          className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border-border/50"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="font-medium">
            {roleConfig[currentRole as keyof typeof roleConfig]?.label || currentRole}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background/95 backdrop-blur-sm border-border/50 shadow-lg"
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
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-muted font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{config?.label || userRole.role}</span>
              {isActive && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};