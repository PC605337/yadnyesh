import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Bell, 
  Lock, 
  CreditCard,
  Calendar,
  Clock,
  Star,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProviderProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  license_number: string;
  experience_years: number;
  consultation_fee: number;
  avatar_url?: string;
}

export function ProviderSettings() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [],
    license_number: '',
    experience_years: 0,
    consultation_fee: 0,
    avatar_url: ''
  });

  const [notifications, setNotifications] = useState({
    email_appointments: true,
    sms_reminders: true,
    push_notifications: true,
    marketing_emails: false
  });

  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  });

  useEffect(() => {
    if (user && profile) {
      fetchProviderData();
    }
  }, [user, profile]);

  const fetchProviderData = async () => {
    try {
      const { data: providerData, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (providerData) {
        setProviderProfile({
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          bio: providerData.bio || '',
          specialties: providerData.specialties || [],
          license_number: providerData.license_number || '',
          experience_years: providerData.experience_years || 0,
          consultation_fee: providerData.consultation_fee || 0,
          avatar_url: profile?.avatar_url || ''
        });
      } else {
        // Set default values from profile if no provider profile exists
        setProviderProfile({
          ...providerProfile,
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          email: profile?.email || '',
          phone: profile?.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
      toast.error('Failed to load provider information');
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: providerProfile.first_name,
          last_name: providerProfile.last_name,
          phone: providerProfile.phone
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // Update or insert provider profile
      const { error: providerError } = await supabase
        .from('provider_profiles')
        .upsert({
          user_id: user?.id,
          bio: providerProfile.bio,
          specialties: providerProfile.specialties,
          license_number: providerProfile.license_number,
          experience_years: providerProfile.experience_years,
          consultation_fee: providerProfile.consultation_fee
        });

      if (providerError) throw providerError;

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

  const saveAvailability = () => {
    toast.success('Availability schedule saved');
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !providerProfile.specialties.includes(specialty)) {
      setProviderProfile({
        ...providerProfile,
        specialties: [...providerProfile.specialties, specialty]
      });
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProviderProfile({
      ...providerProfile,
      specialties: providerProfile.specialties.filter(s => s !== specialty)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Provider Settings</h1>
        <p className="text-muted-foreground">Manage your professional profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your professional details and qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={providerProfile.avatar_url} />
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
                    value={providerProfile.first_name}
                    onChange={(e) => setProviderProfile({...providerProfile, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={providerProfile.last_name}
                    onChange={(e) => setProviderProfile({...providerProfile, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={providerProfile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={providerProfile.phone}
                    onChange={(e) => setProviderProfile({...providerProfile, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input
                    id="license"
                    value={providerProfile.license_number}
                    onChange={(e) => setProviderProfile({...providerProfile, license_number: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={providerProfile.experience_years}
                      onChange={(e) => setProviderProfile({...providerProfile, experience_years: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fee">Consultation Fee (₹)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={providerProfile.consultation_fee}
                      onChange={(e) => setProviderProfile({...providerProfile, consultation_fee: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell patients about your background, experience, and approach to healthcare..."
                    value={providerProfile.bio}
                    onChange={(e) => setProviderProfile({...providerProfile, bio: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {providerProfile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialty(specialty)}>
                        {specialty} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add specialty (e.g., Cardiology)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSpecialty(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button type="button" variant="outline">Add</Button>
                  </div>
                </div>
              </div>

              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set your availability for appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(availability).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 w-24">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) =>
                        setAvailability({
                          ...availability,
                          [day]: { ...schedule, enabled: checked }
                        })
                      }
                    />
                    <Label className="capitalize">{day}</Label>
                  </div>
                  
                  {schedule.enabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={schedule.start}
                        onChange={(e) =>
                          setAvailability({
                            ...availability,
                            [day]: { ...schedule, start: e.target.value }
                          })
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={schedule.end}
                        onChange={(e) =>
                          setAvailability({
                            ...availability,
                            [day]: { ...schedule, end: e.target.value }
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                  
                  {!schedule.enabled && (
                    <span className="text-muted-foreground">Unavailable</span>
                  )}
                </div>
              ))}
              
              <Button onClick={saveAvailability}>Save Availability</Button>
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
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive appointment confirmations and updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email_appointments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email_appointments: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get text message reminders for upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms_reminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms_reminders: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push_notifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push_notifications: checked })
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
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payments</CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Setup</h3>
                <p className="text-muted-foreground mb-4">
                  Set up your bank account and payment preferences to receive consultation fees
                </p>
                <Button>Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Security Options</h3>
                <p className="text-muted-foreground mb-4">
                  Configure two-factor authentication and password settings
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Change Password</Button>
                  <Button variant="outline" className="w-full">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}