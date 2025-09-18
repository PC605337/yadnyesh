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
import { InsuranceManager } from "@/components/insurance/InsuranceManager";
import { PatientSettings } from "@/components/settings/PatientSettings";
import IndianPaymentGateway from "@/components/payments/IndianPaymentGateway";
import { TransparentPaymentGateway } from "@/components/payments/TransparentPaymentGateway";
import { PaymentLinks } from "@/components/payments/PaymentLinks";
import { DigitalWallet } from "@/components/payments/DigitalWallet";
import { MedicalDocumentUpload } from "@/components/uploads/MedicalDocumentUpload";
import { ConsentManager } from "@/components/compliance/ConsentManager";
import HelpSupport from "@/components/support/HelpSupport";

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
        <Route path="payments" element={<TransparentPaymentGateway amount={2500} serviceType="teleconsult" onPaymentSuccess={(id, method) => console.log('Payment completed:', id, method)} />} />
        <Route path="wallet" element={<DigitalWallet />} />
        <Route path="upload-documents" element={<MedicalDocumentUpload />} />
        <Route path="consent-manager" element={<ConsentManager />} />
        <Route path="help-support" element={<HelpSupport />} />
        <Route path="settings" element={<PatientSettings />} />
      </Routes>
    </HealthcareLayout>
  );
};

export default PatientApp;