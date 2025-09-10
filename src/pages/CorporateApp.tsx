import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { CorporateDashboard } from "@/components/dashboard/CorporateDashboard";

const CorporateApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<CorporateDashboard />} />
        <Route path="employees" element={<div>Employees Coming Soon</div>} />
        <Route path="programs" element={<div>Programs Coming Soon</div>} />
        <Route path="analytics" element={<div>Analytics Coming Soon</div>} />
        <Route path="billing" element={<div>Billing Coming Soon</div>} />
        <Route path="settings" element={<div>Settings Coming Soon</div>} />
      </Routes>
    </HealthcareLayout>
  );
};

export default CorporateApp;