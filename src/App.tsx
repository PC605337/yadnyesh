import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import PatientApp from "./pages/PatientApp";
import ProviderApp from "./pages/ProviderApp";
import CorporateApp from "./pages/CorporateApp";
import AdminApp from "./pages/AdminApp";
import ConsultationBooking from "./pages/ConsultationBooking";
import PrescriptionManagement from "./pages/PrescriptionManagement";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AccessibilityProvider } from "./components/accessibility/AccessibilityProvider";
import { Loader2 } from "lucide-react";
import { InsuranceOnboarding } from "./components/patient/InsuranceOnboarding";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }
  
  // For role-specific routes, check if user has access to ANY allowed role
  // This allows users with multiple roles to access different sections
  if (allowedRoles) {
    // Allow admin to access all routes
    if (profile.role === 'admin') {
      return <>{children}</>;
    }
    
    // For non-admin users, check if their current role is in allowed roles
    if (!allowedRoles.includes(profile.role)) {
      return <Navigate to={`/${profile.role}`} replace />;
    }
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If no user, show auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<InsuranceOnboarding />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // If user exists but no profile yet, stay on current route but show loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={<Navigate to={`/${profile.role}`} replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={`/${profile.role}`} replace />} 
      />
      <Route 
        path="/patient/*" 
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/provider/*" 
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/corporate/*" 
        element={
          <ProtectedRoute allowedRoles={["corporate", "admin"]}>
            <CorporateApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/consultation" 
        element={
          <ProtectedRoute>
            <ConsultationBooking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/prescriptions" 
        element={
          <ProtectedRoute>
            <PrescriptionManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <InsuranceOnboarding />
          </ProtectedRoute>
        } 
      />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AccessibilityProvider>
        <ErrorBoundary>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ErrorBoundary>
      </AccessibilityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
