import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Stethoscope, Building2, Shield } from "lucide-react";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  badge?: string;
}

const roles: Role[] = [
  {
    id: "patient",
    title: "Patient / User",
    description: "Access healthcare services, book consultations, manage prescriptions",
    icon: UserCheck,
    features: ["Book consultations", "Manage health records", "Insurance claims", "Medicine delivery"],
  },
  {
    id: "provider",
    title: "Healthcare Provider", 
    description: "Deliver consultations, manage patients, track earnings",
    icon: Stethoscope,
    features: ["Video consultations", "Patient management", "Prescription tools", "Revenue tracking"],
    badge: "Verify License"
  },
  {
    id: "corporate",
    title: "Corporate HR",
    description: "Manage employee wellness programs and health benefits",
    icon: Building2,
    features: ["Employee wellness", "Program analytics", "Bulk enrollment", "Cost management"],
  },
  {
    id: "admin",
    title: "System Admin",
    description: "Platform management and system oversight",
    icon: Shield,
    features: ["User management", "System analytics", "Platform configuration", "Support tools"],
    badge: "Restricted Access"
  }
];

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to HealthCare+
          </h1>
          <p className="text-muted-foreground text-lg">
            Your complete healthcare ecosystem in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? "ring-2 ring-primary shadow-medical scale-[1.02]" 
                    : "hover:shadow-card hover:scale-[1.01]"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{role.title}</CardTitle>
                        {role.badge && (
                          <Badge variant="outline" className="mt-1">
                            {role.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Key Features:</p>
                    <ul className="grid grid-cols-2 gap-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <div className="h-1 w-1 bg-accent rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-8 py-3 text-lg"
            size="lg"
          >
            Continue with {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "Selection"}
          </Button>
        </div>
      </div>
    </div>
  );
}