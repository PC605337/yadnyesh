import React from "react";
import { Routes, Route } from "react-router-dom";
import ChildrenDashboard from "@/components/children/ChildrenDashboard";
import SymptomTracker from "@/components/children/SymptomTracker";
import RehabGames from "@/components/children/RehabGames";
import CaregiverHub from "@/components/children/CaregiverHub";
import SchoolPortal from "@/components/children/SchoolPortal";
import PeerSupport from "@/components/children/PeerSupport";
import ChildrenLayout from "@/components/layout/ChildrenLayout";

export default function ChildrenApp() {
  return (
    <ChildrenLayout>
      <Routes>
        <Route index element={<ChildrenDashboard />} />
        <Route path="symptoms" element={<SymptomTracker />} />
        <Route path="games" element={<RehabGames />} />
        <Route path="caregiver" element={<CaregiverHub />} />
        <Route path="school" element={<SchoolPortal />} />
        <Route path="friends" element={<PeerSupport />} />
      </Routes>
    </ChildrenLayout>
  );
}
