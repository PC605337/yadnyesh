import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building, Users, Bell, Shield, Settings, Mail, Phone, MapPin, Globe } from "lucide-react";

export function CorporateSettings() {
  const { toast } = useToast();
  const [companySettings, setCompanySettings] = useState({
    companyName: "TechCorp Ltd",
    industry: "Technology",
    employeeCount: 200,
    address: "123 Business Park, Bangalore, Karnataka 560001",
    phone: "+91 80 1234 5678",
    email: "hr@techcorp.com",
    website: "https://techcorp.com",
    timezone: "Asia/Kolkata",
    workingHours: "09:00-18:00",
    currency: "INR"
  });

  const [healthSettings, setHealthSettings] = useState({
    enableHealthScreenings: true,
    mandatoryAnnualCheckup: true,
    allowFamilyMembers: false,
    maxFamilyMembers: 4,
    enableMentalHealthSupport: true,
    enableFitnessPrograms: true,
    healthBudgetPerEmployee: 5000,
    emergencyContactRequired: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    alertOnLowEngagement: true,
    alertOnHighRiskEmployees: true,
    reminderFrequency: "weekly"
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionPeriod: 36,
    allowDataExport: true,
    requireConsentForPrograms: true,
    anonymizeReports: true,
    shareAggregatedData: false,
    enableAuditLogs: true
  });

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Corporate Settings</h1>
        <Badge variant="outline">Settings last updated: {new Date().toLocaleDateString()}</Badge>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="health">Health & Wellness</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={companySettings.industry} onValueChange={(value) => setCompanySettings({...companySettings, industry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employee-count">Number of Employees</Label>
                  <Input
                    id="employee-count"
                    type="number"
                    value={companySettings.employeeCount}
                    onChange={(e) => setCompanySettings({...companySettings, employeeCount: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={companySettings.timezone} onValueChange={(value) => setCompanySettings({...companySettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="working-hours">Working Hours</Label>
                  <Input
                    id="working-hours"
                    value={companySettings.workingHours}
                    onChange={(e) => setCompanySettings({...companySettings, workingHours: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={companySettings.currency} onValueChange={(value) => setCompanySettings({...companySettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Company")}>Save Company Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Health & Wellness Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Health Screenings</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to book health screenings</p>
                  </div>
                  <Switch
                    checked={healthSettings.enableHealthScreenings}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, enableHealthScreenings: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mandatory Annual Checkup</Label>
                    <p className="text-sm text-muted-foreground">Require employees to complete annual health checkup</p>
                  </div>
                  <Switch
                    checked={healthSettings.mandatoryAnnualCheckup}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, mandatoryAnnualCheckup: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Family Members</Label>
                    <p className="text-sm text-muted-foreground">Extend health benefits to employee family members</p>
                  </div>
                  <Switch
                    checked={healthSettings.allowFamilyMembers}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, allowFamilyMembers: checked})}
                  />
                </div>
                {healthSettings.allowFamilyMembers && (
                  <div>
                    <Label htmlFor="max-family">Maximum Family Members</Label>
                    <Input
                      id="max-family"
                      type="number"
                      value={healthSettings.maxFamilyMembers}
                      onChange={(e) => setHealthSettings({...healthSettings, maxFamilyMembers: parseInt(e.target.value)})}
                      className="w-32"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Mental Health Support</Label>
                    <p className="text-sm text-muted-foreground">Provide access to mental health resources</p>
                  </div>
                  <Switch
                    checked={healthSettings.enableMentalHealthSupport}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, enableMentalHealthSupport: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Fitness Programs</Label>
                    <p className="text-sm text-muted-foreground">Offer fitness and wellness programs</p>
                  </div>
                  <Switch
                    checked={healthSettings.enableFitnessPrograms}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, enableFitnessPrograms: checked})}
                  />
                </div>
                <div>
                  <Label htmlFor="health-budget">Health Budget per Employee (Annual)</Label>
                  <Input
                    id="health-budget"
                    type="number"
                    value={healthSettings.healthBudgetPerEmployee}
                    onChange={(e) => setHealthSettings({...healthSettings, healthBudgetPerEmployee: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Emergency Contact Required</Label>
                    <p className="text-sm text-muted-foreground">Require employees to provide emergency contact</p>
                  </div>
                  <Switch
                    checked={healthSettings.emergencyContactRequired}
                    onCheckedChange={(checked) => setHealthSettings({...healthSettings, emergencyContactRequired: checked})}
                  />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Health & Wellness")}>Save Health Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to mobile app</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly wellness reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive monthly wellness reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, monthlyReports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alert on Low Engagement</Label>
                    <p className="text-sm text-muted-foreground">Get notified when employee engagement drops</p>
                  </div>
                  <Switch
                    checked={notificationSettings.alertOnLowEngagement}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, alertOnLowEngagement: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alert on High Risk Employees</Label>
                    <p className="text-sm text-muted-foreground">Get notified about employees with high health risks</p>
                  </div>
                  <Switch
                    checked={notificationSettings.alertOnHighRiskEmployees}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, alertOnHighRiskEmployees: checked})}
                  />
                </div>
                <div>
                  <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                  <Select value={notificationSettings.reminderFrequency} onValueChange={(value) => setNotificationSettings({...notificationSettings, reminderFrequency: value})}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Notifications")}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="retention-period">Data Retention Period (months)</Label>
                  <Input
                    id="retention-period"
                    type="number"
                    value={privacySettings.dataRetentionPeriod}
                    onChange={(e) => setPrivacySettings({...privacySettings, dataRetentionPeriod: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Data Export</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to export their health data</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDataExport}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowDataExport: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Consent for Programs</Label>
                    <p className="text-sm text-muted-foreground">Require explicit consent before enrolling in programs</p>
                  </div>
                  <Switch
                    checked={privacySettings.requireConsentForPrograms}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, requireConsentForPrograms: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymize Reports</Label>
                    <p className="text-sm text-muted-foreground">Remove personal identifiers from wellness reports</p>
                  </div>
                  <Switch
                    checked={privacySettings.anonymizeReports}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, anonymizeReports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Aggregated Data</Label>
                    <p className="text-sm text-muted-foreground">Share anonymized aggregated data for research</p>
                  </div>
                  <Switch
                    checked={privacySettings.shareAggregatedData}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, shareAggregatedData: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Maintain detailed logs of all system access</p>
                  </div>
                  <Switch
                    checked={privacySettings.enableAuditLogs}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, enableAuditLogs: checked})}
                  />
                </div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Changes to privacy settings may require employee notification and consent under applicable data protection laws.
                </p>
              </div>
              <Button onClick={() => handleSaveSettings("Privacy & Security")}>Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}