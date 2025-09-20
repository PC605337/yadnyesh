import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function SystemSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    enableRegistration: true,
    enablePayments: true,
    maxAppointmentsPerDay: 50,
    appointmentDuration: 30,
    systemTimeZone: "Asia/Kolkata",
    emergencyContactEmail: "admin@healthcare.com",
    maxFileUploadSize: 10,
    enableNotifications: true,
    enableAuditLogs: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    enableTwoFactor: false,
    backupFrequency: "daily",
    dataRetentionPeriod: 90
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings({
      maintenanceMode: false,
      enableRegistration: true,
      enablePayments: true,
      maxAppointmentsPerDay: 50,
      appointmentDuration: 30,
      systemTimeZone: "Asia/Kolkata",
      emergencyContactEmail: "admin@healthcare.com",
      maxFileUploadSize: 10,
      enableNotifications: true,
      enableAuditLogs: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      enableTwoFactor: false,
      backupFrequency: "daily",
      dataRetentionPeriod: 90
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="registration">Enable User Registration</Label>
                <Switch
                  id="registration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, enableRegistration: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="payments">Enable Payment Processing</Label>
                <Switch
                  id="payments"
                  checked={settings.enablePayments}
                  onCheckedChange={(checked) => setSettings({...settings, enablePayments: checked})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-appointments">Max Appointments/Day</Label>
                  <Input
                    id="max-appointments"
                    type="number"
                    value={settings.maxAppointmentsPerDay}
                    onChange={(e) => setSettings({...settings, maxAppointmentsPerDay: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="appointment-duration">Default Duration (min)</Label>
                  <Input
                    id="appointment-duration"
                    type="number"
                    value={settings.appointmentDuration}
                    onChange={(e) => setSettings({...settings, appointmentDuration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone">System Time Zone</Label>
                <Input
                  id="timezone"
                  value={settings.systemTimeZone}
                  onChange={(e) => setSettings({...settings, systemTimeZone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emergency-email">Emergency Contact Email</Label>
                <Input
                  id="emergency-email"
                  type="email"
                  value={settings.emergencyContactEmail}
                  onChange={(e) => setSettings({...settings, emergencyContactEmail: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-logs">Enable Audit Logging</Label>
                <Switch
                  id="audit-logs"
                  checked={settings.enableAuditLogs}
                  onCheckedChange={(checked) => setSettings({...settings, enableAuditLogs: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                <Switch
                  id="two-factor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => setSettings({...settings, enableTwoFactor: checked})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="password-length">Minimum Password Length</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="file-upload">Max File Upload Size (MB)</Label>
                <Input
                  id="file-upload"
                  type="number"
                  value={settings.maxFileUploadSize}
                  onChange={(e) => setSettings({...settings, maxFileUploadSize: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable System Notifications</Label>
                <Switch
                  id="notifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label>Active Notification Channels</Label>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Email</Badge>
                  <Badge variant="secondary">SMS</Badge>
                  <Badge variant="secondary">Push Notifications</Badge>
                  <Badge variant="secondary">In-App</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Input
                  id="backup-frequency"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="retention-period">Data Retention Period (days)</Label>
                <Input
                  id="retention-period"
                  type="number"
                  value={settings.dataRetentionPeriod}
                  onChange={(e) => setSettings({...settings, dataRetentionPeriod: parseInt(e.target.value)})}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>System Status</Label>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Database: Online</Badge>
                  <Badge variant="secondary">Storage: Online</Badge>
                  <Badge variant="secondary">Payment Gateway: Online</Badge>
                  <Badge variant="secondary">Notifications: Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}