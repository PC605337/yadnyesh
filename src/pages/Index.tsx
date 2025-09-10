import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleSelection } from "@/components/auth/RoleSelection";

const Index = () => {
  const navigate = useNavigate();
  
  const handleRoleSelect = (role: string) => {
    // In a real app, this would handle authentication
    // For now, we'll just redirect to the appropriate dashboard
    switch (role) {
      case "patient":
        navigate("/patient");
        break;
      case "provider":
        navigate("/provider");
        break;
      case "corporate":
        navigate("/corporate");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        break;
    }
  };

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
