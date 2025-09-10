import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { PatientDashboard } from "@/components/dashboard/PatientDashboard";

const PatientApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<PatientDashboard />} />
        <Route path="consultation" element={<div>Consultation Booking Coming Soon</div>} />
        <Route path="appointments" element={<div>Appointments Coming Soon</div>} />
        <Route path="prescriptions" element={<div>Prescriptions Coming Soon</div>} />
        <Route path="records" element={<div>Health Records Coming Soon</div>} />
        <Route path="insurance" element={<div>Insurance Coming Soon</div>} />
        <Route path="wellness" element={<div>Wellness Coming Soon</div>} />
      </Routes>
    </HealthcareLayout>
  );
};

export default PatientApp;