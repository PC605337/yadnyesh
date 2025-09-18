import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, AlertTriangle, Search, User, FileText, Clock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorProfile {
  nmrId: string;
  firstName: string;
  lastName: string;
  specialties: string[];
  qualifications: string[];
  registrationNumber: string;
  registrationDate: string;
  registrationStatus: 'active' | 'suspended' | 'cancelled';
  hospitalAffiliations: string[];
  yearsOfExperience: number;
  profileImage?: string;
  verificationLevel: 'verified' | 'pending' | 'unverified';
  trustScore: number;
  patientReviews: number;
  averageRating: number;
}

interface TrustBadge {
  type: 'nmr_verified' | 'experience' | 'hospital_affiliated' | 'highly_rated' | 'board_certified';
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

export const DoctorVerification = () => {
  const [nmrId, setNmrId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const trustBadges: TrustBadge[] = [
    {
      type: 'nmr_verified',
      label: 'NMR Verified',
      description: 'Verified with National Medical Register',
      color: 'bg-green-100 text-green-800',
      icon: <Shield className="h-4 w-4" />
    },
    {
      type: 'experience',
      label: 'Experienced',
      description: '10+ years of medical practice',
      color: 'bg-blue-100 text-blue-800',
      icon: <Clock className="h-4 w-4" />
    },
    {
      type: 'hospital_affiliated',
      label: 'Hospital Affiliated',
      description: 'Associated with reputed hospitals',
      color: 'bg-purple-100 text-purple-800',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'highly_rated',
      label: 'Highly Rated',
      description: '4.5+ stars from 100+ patients',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Star className="h-4 w-4" />
    }
  ];

  const verifyDoctor = async () => {
    if (!nmrId.trim()) {
      toast({
        title: "Please enter NMR ID",
        description: "NMR ID is required for verification",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('idle');

    // Simulate API call to NMR database
    setTimeout(() => {
      if (nmrId.toLowerCase().includes('invalid')) {
        setVerificationStatus('error');
        setDoctorProfile(null);
        toast({
          title: "Verification Failed",
          description: "Doctor not found in NMR database",
          variant: "destructive"
        });
      } else {
        // Mock successful verification
        const mockProfile: DoctorProfile = {
          nmrId: nmrId,
          firstName: 'Dr. Rajesh',
          lastName: 'Sharma',
          specialties: ['Cardiology', 'Internal Medicine'],
          qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
          registrationNumber: 'MH12345678',
          registrationDate: '2010-03-15',
          registrationStatus: 'active',
          hospitalAffiliations: [
            'Apollo Hospital Mumbai',
            'Fortis Hospital Mulund',
            'Lilavati Hospital'
          ],
          yearsOfExperience: 15,
          verificationLevel: 'verified',
          trustScore: 95,
          patientReviews: 1247,
          averageRating: 4.8
        };

        setDoctorProfile(mockProfile);
        setVerificationStatus('success');
        toast({
          title: "Verification Successful",
          description: "Doctor credentials verified with NMR database",
        });
      }
      setIsVerifying(false);
    }, 2000);
  };

  const getDoctorTrustBadges = (profile: DoctorProfile): TrustBadge[] => {
    const badges: TrustBadge[] = [];
    
    if (profile.verificationLevel === 'verified') {
      badges.push(trustBadges[0]); // NMR Verified
    }
    
    if (profile.yearsOfExperience >= 10) {
      badges.push(trustBadges[1]); // Experienced
    }
    
    if (profile.hospitalAffiliations.length > 0) {
      badges.push(trustBadges[2]); // Hospital Affiliated
    }
    
    if (profile.averageRating >= 4.5 && profile.patientReviews >= 100) {
      badges.push(trustBadges[3]); // Highly Rated
    }
    
    return badges;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Doctor Verification Portal
          </CardTitle>
          <CardDescription>
            Verify doctor credentials using National Medical Register (NMR) ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="nmr-id">NMR ID / Registration Number</Label>
              <Input
                id="nmr-id"
                placeholder="Enter NMR ID (e.g., NMR12345678)"
                value={nmrId}
                onChange={(e) => setNmrId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={verifyDoctor} 
                disabled={isVerifying}
                className="flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Search className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          {verificationStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">Doctor not found in NMR database. Please check the ID.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {doctorProfile && verificationStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verification Successful
            </CardTitle>
            <CardDescription>
              Doctor credentials verified with National Medical Register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="trust">Trust Score</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {doctorProfile.firstName} {doctorProfile.lastName}
                      </h3>
                      <p className="text-muted-foreground">
                        {doctorProfile.specialties.join(', ')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{doctorProfile.averageRating}</span>
                        <span className="text-muted-foreground">
                          ({doctorProfile.patientReviews} reviews)
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Verified
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Experience
                      </Label>
                      <p className="text-lg font-semibold">
                        {doctorProfile.yearsOfExperience} years
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Registration Status
                      </Label>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        {doctorProfile.registrationStatus}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Trust Badges
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {getDoctorTrustBadges(doctorProfile).map((badge) => (
                        <Badge
                          key={badge.type}
                          className={`${badge.color} flex items-center gap-1`}
                        >
                          {badge.icon}
                          {badge.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Registration Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">NMR ID</Label>
                          <p className="font-medium">{doctorProfile.nmrId}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Registration Number</Label>
                          <p className="font-medium">{doctorProfile.registrationNumber}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Registration Date</Label>
                          <p className="font-medium">
                            {new Date(doctorProfile.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Status</Label>
                          <Badge className="bg-green-100 text-green-800 mt-1">
                            {doctorProfile.registrationStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Qualifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctorProfile.qualifications.map((qualification) => (
                          <Badge key={qualification} variant="secondary">
                            {qualification}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Hospital Affiliations</h4>
                      <div className="space-y-2">
                        {doctorProfile.hospitalAffiliations.map((hospital) => (
                          <div key={hospital} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>{hospital}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trust" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {doctorProfile.trustScore}/100
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Trust Score</h3>
                      <p className="text-muted-foreground">
                        Based on verification status, experience, and patient feedback
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          Verification Status
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>NMR Verification</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>Medical License</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex justify-between">
                            <span>Hospital Affiliation</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Patient Feedback
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Average Rating</span>
                            <span>{doctorProfile.averageRating}/5.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Reviews</span>
                            <span>{doctorProfile.patientReviews}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recommendation Rate</span>
                            <span>96%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Patient Assurance</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        This doctor has been thoroughly verified and meets all our quality standards. 
                        You can book an appointment with confidence.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};