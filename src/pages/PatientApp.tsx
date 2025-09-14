import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { ComprehensivePatientDashboard } from "@/components/patient/ComprehensivePatientDashboard";
import { CommunityForum } from "@/components/community/CommunityForum";
import { PharmacyIntegration } from "@/components/pharmacy/PharmacyIntegration";
import { WellnessPrograms } from "@/components/wellness/WellnessPrograms";
import { CostPrediction } from "@/components/prediction/CostPrediction";

const PatientApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<ComprehensivePatientDashboard />} />
        <Route path="consultation" element={<div>Consultation Booking Coming Soon</div>} />
        <Route path="appointments" element={<div>Appointments Coming Soon</div>} />
        <Route path="prescriptions" element={<div>Prescriptions Coming Soon</div>} />
        <Route path="records" element={<div>Health Records Coming Soon</div>} />
        <Route path="insurance" element={<div>Insurance Coming Soon</div>} />
        <Route path="wellness" element={<WellnessPrograms />} />
        <Route path="community" element={<CommunityForum />} />
        <Route path="pharmacy" element={<PharmacyIntegration />} />
        <Route path="cost-prediction" element={<CostPrediction />} />
        <Route path="settings" element={<div>Settings Coming Soon</div>} />
      </Routes>
    </HealthcareLayout>
  );
};

export default PatientApp;