import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, User, Shield, Heart, FileText, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

interface UserProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Emergency Contacts
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>;
  
  // Medical Information
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    bloodType: string;
    height: string;
    weight: string;
  };
  
  // Insurance Information
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    membershipType: string;
  };
  
  // Consent and Legal
  consents: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    dataSharing: boolean;
    marketing: boolean;
  };
}

export const UserOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    emergencyContacts: [{ name: '', relationship: '', phone: '', email: '' }],
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
      bloodType: '',
      height: '',
      weight: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      membershipType: ''
    },
    consents: {
      termsOfService: false,
      privacyPolicy: false,
      dataSharing: false,
      marketing: false
    }
  });

  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic information to create your profile',
      icon: <User className="h-6 w-6" />,
      required: true
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      description: 'People to contact in case of emergency',
      icon: <Phone className="h-6 w-6" />,
      required: true
    },
    {
      id: 'medical',
      title: 'Medical History',
      description: 'Your health information for better care',
      icon: <Heart className="h-6 w-6" />,
      required: false
    },
    {
      id: 'insurance',
      title: 'Insurance Details',
      description: 'Insurance information for billing',
      icon: <Shield className="h-6 w-6" />,
      required: false
    },
    {
      id: 'consent',
      title: 'Privacy & Consent',
      description: 'Review and accept our terms',
      icon: <FileText className="h-6 w-6" />,
      required: true
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    
    switch (step.id) {
      case 'personal':
        return !!(profile.firstName && profile.lastName && profile.dateOfBirth && 
                 profile.gender && profile.phone);
      
      case 'emergency':
        return profile.emergencyContacts.some(contact => 
          contact.name && contact.relationship && contact.phone
        );
      
      case 'consent':
        return profile.consents.termsOfService && profile.consents.privacyPolicy;
      
      default:
        return true; // Optional steps
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (steps[currentStep].required && !validateStep(currentStep)) {
        toast({
          title: "Required Information Missing",
          description: "Please fill in all required fields before continuing",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Required Information Missing",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Welcome to HealthCare+!",
      description: "Your profile has been created successfully",
    });
    
    onComplete();
  };

  const addEmergencyContact = () => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: '', relationship: '', phone: '', email: '' }
      ]
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={profile.gender} onValueChange={(value) => 
            setProfile(prev => ({ ...prev, gender: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+91 9876543210"
        />
      </div>

      <div className="space-y-3">
        <Label>Address</Label>
        <div className="grid grid-cols-1 gap-3">
          <Input
            placeholder="Street Address"
            value={profile.address.street}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              address: { ...prev.address, street: e.target.value }
            }))}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              placeholder="City"
              value={profile.address.city}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                address: { ...prev.address, city: e.target.value }
              }))}
            />
            <Input
              placeholder="State"
              value={profile.address.state}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                address: { ...prev.address, state: e.target.value }
              }))}
            />
            <Input
              placeholder="ZIP Code"
              value={profile.address.zipCode}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                address: { ...prev.address, zipCode: e.target.value }
              }))}
            />
            <Select 
              value={profile.address.country} 
              onValueChange={(value) => setProfile(prev => ({
                ...prev,
                address: { ...prev.address, country: value }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add at least one emergency contact who can be reached in case of a medical emergency.
      </p>
      
      {profile.emergencyContacts.map((contact, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Emergency Contact {index + 1}</h4>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
                  }))}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Full Name *"
                value={contact.name}
                onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
              />
              <Select 
                value={contact.relationship} 
                onValueChange={(value) => updateEmergencyContact(index, 'relationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Relationship *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Phone Number *"
                value={contact.phone}
                onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
              />
              <Input
                placeholder="Email (Optional)"
                type="email"
                value={contact.email}
                onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}
      
      <Button variant="outline" onClick={addEmergencyContact} className="w-full">
        Add Another Contact
      </Button>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This information helps healthcare providers give you better care. All information is kept confidential.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            placeholder="e.g., 170 cm"
            value={profile.medicalHistory.height}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, height: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            placeholder="e.g., 70 kg"
            value={profile.medicalHistory.weight}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, weight: e.target.value }
            }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bloodType">Blood Type</Label>
        <Select 
          value={profile.medicalHistory.bloodType} 
          onValueChange={(value) => setProfile(prev => ({
            ...prev,
            medicalHistory: { ...prev.medicalHistory, bloodType: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select blood type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="conditions">Current Medical Conditions</Label>
        <Textarea
          id="conditions"
          placeholder="List any ongoing medical conditions (diabetes, hypertension, etc.)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          placeholder="List any known allergies (medications, food, environmental)"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="medications">Current Medications</Label>
        <Textarea
          id="medications"
          placeholder="List current medications and dosages"
          rows={3}
        />
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Insurance information helps us process your claims faster. You can skip this step and add it later.
      </p>
      
      <div>
        <Label htmlFor="insProvider">Insurance Provider</Label>
        <Input
          id="insProvider"
          placeholder="e.g., Star Health, ICICI Lombard"
          value={profile.insurance.provider}
          onChange={(e) => setProfile(prev => ({
            ...prev,
            insurance: { ...prev.insurance, provider: e.target.value }
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="policyNumber">Policy Number</Label>
          <Input
            id="policyNumber"
            placeholder="Policy/Member ID"
            value={profile.insurance.policyNumber}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              insurance: { ...prev.insurance, policyNumber: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label htmlFor="groupNumber">Group Number</Label>
          <Input
            id="groupNumber"
            placeholder="Group/Plan ID"
            value={profile.insurance.groupNumber}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              insurance: { ...prev.insurance, groupNumber: e.target.value }
            }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="membershipType">Plan Type</Label>
        <Select 
          value={profile.insurance.membershipType} 
          onValueChange={(value) => setProfile(prev => ({
            ...prev,
            insurance: { ...prev.insurance, membershipType: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="senior-citizen">Senior Citizen</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Please review and accept our terms to complete your registration.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={profile.consents.termsOfService}
            onCheckedChange={(checked) => setProfile(prev => ({
              ...prev,
              consents: { ...prev.consents, termsOfService: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the <Link to="/terms-of-service" className="text-primary hover:underline" target="_blank">Terms of Service</Link> *
            </label>
            <p className="text-xs text-muted-foreground">
              Required to use HealthCare+ services
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={profile.consents.privacyPolicy}
            onCheckedChange={(checked) => setProfile(prev => ({
              ...prev,
              consents: { ...prev.consents, privacyPolicy: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the <Link to="/privacy-policy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link> *
            </label>
            <p className="text-xs text-muted-foreground">
              Required for data processing and healthcare services
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="sharing"
            checked={profile.consents.dataSharing}
            onCheckedChange={(checked) => setProfile(prev => ({
              ...prev,
              consents: { ...prev.consents, dataSharing: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="sharing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Allow sharing health data with selected healthcare providers
            </label>
            <p className="text-xs text-muted-foreground">
              Enables consultations and care coordination (recommended)
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketing"
            checked={profile.consents.marketing}
            onCheckedChange={(checked) => setProfile(prev => ({
              ...prev,
              consents: { ...prev.consents, marketing: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Receive health tips and wellness program updates
            </label>
            <p className="text-xs text-muted-foreground">
              Optional - you can change this anytime in settings
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800">Your Privacy is Protected</h4>
            <p className="text-sm text-blue-700 mt-1">
              All your health information is encrypted and stored securely. We never share your data without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal': return renderPersonalInfo();
      case 'emergency': return renderEmergencyContacts();
      case 'medical': return renderMedicalHistory();
      case 'insurance': return renderInsurance();
      case 'consent': return renderConsent();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to HealthCare+</h1>
          </div>
          <p className="text-muted-foreground">
            Let's set up your profile to provide you with personalized healthcare services
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                index < currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : index === currentStep
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {steps[currentStep].icon}
              {steps[currentStep].title}
              {steps[currentStep].required && (
                <span className="text-red-500 text-sm">*</span>
              )}
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {steps[currentStep].required ? 'Required step' : 'Optional step'}
          </div>
          
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};