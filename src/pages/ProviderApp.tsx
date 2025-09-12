import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { ProviderDashboard } from "@/components/dashboard/ProviderDashboard";
import { CommunityForum } from "@/components/community/CommunityForum";

const ProviderApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<ProviderDashboard />} />
        <Route path="patients" element={<div>Patients Coming Soon</div>} />
        <Route path="schedule" element={<div>Schedule Coming Soon</div>} />
        <Route path="consultations" element={<div>Consultations Coming Soon</div>} />
        <Route path="earnings" element={<div>Earnings Coming Soon</div>} />
        <Route path="community" element={<CommunityForum />} />
        <Route path="settings" element={<div>Settings Coming Soon</div>} />
      </Routes>
    </HealthcareLayout>
  );
};

export default ProviderApp;