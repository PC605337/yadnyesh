import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Bell, 
  Lock, 
  Shield,
  Heart,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PatientProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatar_url?: string;
}

export function PatientSettings() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipcode: ''
    },
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    },
    avatar_url: ''
  });

  const [notifications, setNotifications] = useState({
    appointment_reminders: true,
    medication_reminders: true,
    health_tips: true,
    marketing_emails: false
  });

  const [privacy, setPrivacy] = useState({
    share_data_with_providers: true,
    allow_research_participation: false,
    receive_health_insights: true
  });

  useEffect(() => {
    if (user && profile) {
      loadPatientData();
    }
  }, [user, profile]);

  const loadPatientData = () => {
    setPatientProfile({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      date_of_birth: (profile as any)?.date_of_birth || '',
      gender: (profile as any)?.gender || '',
      address: (profile as any)?.address || {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipcode: ''
      },
      emergency_contact: (profile as any)?.emergency_contact || {
        name: '',
        relationship: '',
        phone: ''
      },
      avatar_url: profile?.avatar_url || ''
    });
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: patientProfile.first_name,
          last_name: patientProfile.last_name,
          phone: patientProfile.phone,
          date_of_birth: patientProfile.date_of_birth,
          gender: patientProfile.gender,
          address: patientProfile.address,
          emergency_contact: patientProfile.emergency_contact
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const savePrivacy = () => {
    toast.success('Privacy settings saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={patientProfile.avatar_url} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={patientProfile.first_name}
                    onChange={(e) => setPatientProfile({...patientProfile, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={patientProfile.last_name}
                    onChange={(e) => setPatientProfile({...patientProfile, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientProfile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={patientProfile.phone}
                    onChange={(e) => setPatientProfile({...patientProfile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={patientProfile.date_of_birth}
                    onChange={(e) => setPatientProfile({...patientProfile, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={patientProfile.gender}
                    onChange={(e) => setPatientProfile({...patientProfile, gender: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={patientProfile.address.street}
                      onChange={(e) => setPatientProfile({
                        ...patientProfile,
                        address: { ...patientProfile.address, street: e.target.value }
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={patientProfile.address.city}
                        onChange={(e) => setPatientProfile({
                          ...patientProfile,
                          address: { ...patientProfile.address, city: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={patientProfile.address.state}
                        onChange={(e) => setPatientProfile({
                          ...patientProfile,
                          address: { ...patientProfile.address, state: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={patientProfile.address.country}
                        onChange={(e) => setPatientProfile({
                          ...patientProfile,
                          address: { ...patientProfile.address, country: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipcode">ZIP Code</Label>
                      <Input
                        id="zipcode"
                        value={patientProfile.address.zipcode}
                        onChange={(e) => setPatientProfile({
                          ...patientProfile,
                          address: { ...patientProfile.address, zipcode: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergency_name">Name</Label>
                    <Input
                      id="emergency_name"
                      value={patientProfile.emergency_contact.name}
                      onChange={(e) => setPatientProfile({
                        ...patientProfile,
                        emergency_contact: { ...patientProfile.emergency_contact, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_relationship">Relationship</Label>
                    <Input
                      id="emergency_relationship"
                      value={patientProfile.emergency_contact.relationship}
                      onChange={(e) => setPatientProfile({
                        ...patientProfile,
                        emergency_contact: { ...patientProfile.emergency_contact, relationship: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_phone">Phone</Label>
                    <Input
                      id="emergency_phone"
                      value={patientProfile.emergency_contact.phone}
                      onChange={(e) => setPatientProfile({
                        ...patientProfile,
                        emergency_contact: { ...patientProfile.emergency_contact, phone: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.appointment_reminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, appointment_reminders: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders to take your medications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.medication_reminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, medication_reminders: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Tips</Label>
                    <p className="text-sm text-muted-foreground">
                      Get personalized health tips and insights
                    </p>
                  </div>
                  <Switch
                    checked={notifications.health_tips}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, health_tips: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing_emails}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, marketing_emails: checked })
                    }
                  />
                </div>
              </div>
              
              <Button onClick={saveNotifications}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data sharing and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Data with Healthcare Providers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your healthcare providers to access your health data
                    </p>
                  </div>
                  <Switch
                    checked={privacy.share_data_with_providers}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, share_data_with_providers: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Research Participation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymized data to be used for medical research
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allow_research_participation}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allow_research_participation: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive AI-powered health insights based on your data
                    </p>
                  </div>
                  <Switch
                    checked={privacy.receive_health_insights}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, receive_health_insights: checked })
                    }
                  />
                </div>
              </div>
              
              <Button onClick={savePrivacy}>Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Security Options</h3>
                <p className="text-muted-foreground mb-4">
                  Keep your account secure with these options
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Change Password</Button>
                  <Button variant="outline" className="w-full">Enable Two-Factor Authentication</Button>
                  <Button variant="outline" className="w-full">Download Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}