import { Routes, Route } from "react-router-dom";
import { HealthcareLayout } from "@/components/layout/HealthcareLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { ProviderManagement } from "@/components/admin/ProviderManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

const AdminApp = () => {
  return (
    <HealthcareLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="providers" element={<ProviderManagement />} />
        <Route path="system" element={<SystemSettings />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Routes>
    </HealthcareLayout>
  );
};

export default AdminApp;