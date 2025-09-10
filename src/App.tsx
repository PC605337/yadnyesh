import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PatientApp from "./pages/PatientApp";
import ProviderApp from "./pages/ProviderApp";
import CorporateApp from "./pages/CorporateApp";
import ConsultationBooking from "./pages/ConsultationBooking";
import PrescriptionManagement from "./pages/PrescriptionManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patient/*" element={<PatientApp />} />
          <Route path="/provider/*" element={<ProviderApp />} />
          <Route path="/corporate/*" element={<CorporateApp />} />
          <Route path="/consultation" element={<ConsultationBooking />} />
          <Route path="/prescriptions" element={<PrescriptionManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
