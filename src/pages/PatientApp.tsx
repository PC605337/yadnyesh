import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { ComprehensivePatientDashboard } from "@/components/patient/ComprehensivePatientDashboard";
import { CommunityForum } from "@/components/community/CommunityForum";
import { PharmacyIntegration } from "@/components/pharmacy/PharmacyIntegration";
import { WellnessPrograms } from "@/components/wellness/WellnessPrograms";
import { CostPrediction } from "@/components/prediction/CostPrediction";
import { VideoConsultation } from "@/components/telemedicine/VideoConsultation";
import { AppointmentManagement } from "@/components/appointments/AppointmentManagement";
import { PrescriptionTracker } from "@/components/prescriptions/PrescriptionTracker";
import { HealthRecordsManager } from "@/components/records/HealthRecordsManager";
import { PatientSettings } from "@/components/settings/PatientSettings";

const PatientApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<ComprehensivePatientDashboard />} />
        <Route path="consultation" element={<VideoConsultation />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="prescriptions" element={<PrescriptionTracker />} />
        <Route path="records" element={<HealthRecordsManager />} />
        <Route path="insurance" element={<InsuranceManager />} />
        <Route path="wellness" element={<WellnessPrograms />} />
        <Route path="community" element={<CommunityForum />} />
        <Route path="pharmacy" element={<PharmacyIntegration />} />
        <Route path="cost-prediction" element={<CostPrediction />} />
        <Route path="settings" element={<PatientSettings />} />
      </Routes>
    </HealthcareLayout>
  );
};

export default PatientApp;