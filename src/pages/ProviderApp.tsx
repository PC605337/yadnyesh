import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { ProviderDashboard } from "@/components/dashboard/ProviderDashboard";
import { CommunityForum } from "@/components/community/CommunityForum";
import { PatientManagement } from "@/components/provider/PatientManagement";
import { ScheduleManagement } from "@/components/provider/ScheduleManagement";
import { ConsultationManagement } from "@/components/provider/ConsultationManagement";
import { EarningsDashboard } from "@/components/provider/EarningsDashboard";
import { ProviderSettings } from "@/components/settings/ProviderSettings";

const ProviderApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<ProviderDashboard />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="schedule" element={<ScheduleManagement />} />
        <Route path="consultations" element={<ConsultationManagement />} />
        <Route path="earnings" element={<EarningsDashboard />} />
        <Route path="community" element={<CommunityForum />} />
        <Route path="settings" element={<ProviderSettings />} />
      </Routes>
    </HealthcareLayout>
  );
};

export default ProviderApp;