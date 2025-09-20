import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { CorporateDashboard } from "@/components/dashboard/CorporateDashboard";
import { EmployeeManagement } from "@/components/corporate/EmployeeManagement";
import { ProgramsManagement } from "@/components/corporate/ProgramsManagement";
import { CorporateAnalytics } from "@/components/corporate/CorporateAnalytics";
import { CorporateBilling } from "@/components/corporate/CorporateBilling";
import { CorporateSettings } from "@/components/corporate/CorporateSettings";

const CorporateApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<CorporateDashboard />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="programs" element={<ProgramsManagement />} />
        <Route path="analytics" element={<CorporateAnalytics />} />
        <Route path="billing" element={<CorporateBilling />} />
        <Route path="settings" element={<CorporateSettings />} />
      </Routes>
    </HealthcareLayout>
  );
};

export default CorporateApp;