import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { ProviderDashboard } from "@/components/dashboard/ProviderDashboard";

const ProviderApp = () => {
  return (
    <HealthcareLayout userRole="provider" userName="Dr. Priya Sharma">
      <Routes>
        <Route index element={<ProviderDashboard />} />
        <Route path="patients" element={<div>Patients Coming Soon</div>} />
        <Route path="schedule" element={<div>Schedule Coming Soon</div>} />
        <Route path="consultations" element={<div>Consultations Coming Soon</div>} />
        <Route path="earnings" element={<div>Earnings Coming Soon</div>} />
        <Route path="settings" element={<div>Settings Coming Soon</div>} />
      </Routes>
    </HealthcareLayout>
  );
};

export default ProviderApp;