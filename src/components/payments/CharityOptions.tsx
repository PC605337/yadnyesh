import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MapPin, Users, Phone, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CharityOrganization {
  id: string;
  name: string;
  type: 'ngo' | 'trust' | 'foundation' | 'government';
  location: string;
  distance: string;
  coverage: number; // percentage of amount they cover
  eligibilityIncome: number; // max annual income
  contactNumber: string;
  description: string;
  documentsRequired: string[];
  processingTime?: string;
  beneficiariesHelped?: number;
}

export const CharityOptions = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [applicationStep, setApplicationStep] = useState<'select' | 'apply' | 'submitted'>('select');
  const [applicationData, setApplicationData] = useState({
    annualIncome: '',
    reason: '',
    documents: [] as string[]
  });
  const { toast } = useToast();

  const charityOrganizations: CharityOrganization[] = [
    {
      id: 'pmcare',
      name: 'PM CARES Healthcare Fund',
      type: 'government',
      location: 'Pan India',
      distance: 'Online',
      coverage: 80,
      eligibilityIncome: 300000,
      contactNumber: '1800-11-1950',
      description: 'Government initiative to provide healthcare support to economically weaker sections',
      documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Medical Reports'],
      processingTime: '7-10 days',
      beneficiariesHelped: 150000
    },
    {
      id: 'rotary',
      name: 'Rotary Club Health Initiative',
      type: 'ngo',
      location: 'Mumbai Central',
      distance: '2.3 km',
      coverage: 60,
      eligibilityIncome: 250000,
      contactNumber: '+91-98765-43210',
      description: 'Supporting healthcare needs of underprivileged families in Mumbai region',
      documentsRequired: ['ID Proof', 'Address Proof', 'Income Certificate'],
      processingTime: '3-5 days',
      beneficiariesHelped: 25000
    },
    {
      id: 'tata-trust',
      name: 'Tata Medical Assistance Fund',
      type: 'trust',
      location: 'Worli, Mumbai',
      distance: '5.7 km',
      coverage: 70,
      eligibilityIncome: 500000,
      contactNumber: '022-6665-7890',
      description: 'Providing medical assistance for critical and emergency healthcare needs',
      documentsRequired: ['Medical Reports', 'Doctor Recommendation', 'Financial Documents'],
      processingTime: '5-7 days',
      beneficiariesHelped: 75000
    },
    {
      id: 'local-ngo',
      name: 'Seva Sangh Healthcare Wing',
      type: 'ngo',
      location: 'Andheri East',
      distance: '1.8 km',
      coverage: 50,
      eligibilityIncome: 200000,
      contactNumber: '+91-87654-32109',
      description: 'Local community organization helping with basic healthcare expenses',
      documentsRequired: ['Community Recommendation', 'Income Proof', 'Medical Bills'],
      processingTime: '2-3 days',
      beneficiariesHelped: 12000
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'trust': return 'bg-green-100 text-green-800';
      case 'ngo': return 'bg-purple-100 text-purple-800';
      case 'foundation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCharitySelection = (charityId: string) => {
    setSelectedCharity(charityId);
    setApplicationStep('apply');
  };

  const handleSubmitApplication = () => {
    const charity = charityOrganizations.find(c => c.id === selectedCharity);
    if (!charity) return;

    setApplicationStep('submitted');
    toast({
      title: "Application Submitted",
      description: `Your application to ${charity.name} has been submitted successfully`,
    });

    // Simulate application processing
    setTimeout(() => {
      const subsidizedAmount = amount * (charity.coverage / 100);
      const remainingAmount = amount - subsidizedAmount;
      
      toast({
        title: "Charity Support Approved!",
        description: `₹${subsidizedAmount.toLocaleString('en-IN')} will be covered. You need to pay ₹${remainingAmount.toLocaleString('en-IN')}`,
      });
      onSuccess();
    }, 3000);
  };

  if (applicationStep === 'submitted') {
    const charity = charityOrganizations.find(c => c.id === selectedCharity);
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            Your application to {charity?.name} is being processed
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Processing Time: {charity?.processingTime}</p>
            <p>Contact: {charity?.contactNumber}</p>
            <p>Application ID: CHAR{Date.now()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applicationStep === 'apply') {
    const charity = charityOrganizations.find(c => c.id === selectedCharity);
    if (!charity) return null;

    const subsidizedAmount = amount * (charity.coverage / 100);
    const remainingAmount = amount - subsidizedAmount;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Apply for Charity Support
            </CardTitle>
            <CardDescription>
              Applying to {charity.name} for medical assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Financial Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Charity Coverage ({charity.coverage}%):</span>
                  <span>-₹{subsidizedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Your Payment:</span>
                  <span>₹{remainingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Annual Household Income (₹)</label>
              <Input
                type="number"
                placeholder="e.g., 150000"
                value={applicationData.annualIncome}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  annualIncome: e.target.value
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum eligible income: ₹{charity.eligibilityIncome.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Reason for Assistance</label>
              <Textarea
                placeholder="Please explain your financial situation and why you need assistance..."
                value={applicationData.reason}
                onChange={(e) => setApplicationData(prev => ({
                  ...prev,
                  reason: e.target.value
                }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Required Documents</label>
              <div className="space-y-2">
                {charity.documentsRequired.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{doc}</span>
                    <Badge variant="outline" className="ml-auto">Required</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Please keep these documents ready for verification
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setApplicationStep('select')} variant="outline" className="flex-1">
                Back to Selection
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                className="flex-1"
                disabled={!applicationData.annualIncome || !applicationData.reason}
              >
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Charity & NGO Support
          </CardTitle>
          <CardDescription>
            Get financial assistance from nearby charitable organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {charityOrganizations.map((charity) => {
              const subsidizedAmount = amount * (charity.coverage / 100);
              const remainingAmount = amount - subsidizedAmount;
              
              return (
                <Card key={charity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{charity.name}</h3>
                            <Badge className={getTypeColor(charity.type)}>
                              {charity.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {charity.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {charity.location} • {charity.distance}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {charity.beneficiariesHelped?.toLocaleString()} helped
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {charity.contactNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-green-600">
                            {charity.coverage}% Coverage
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Save ₹{subsidizedAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pay: ₹{remainingAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Processing: {charity.processingTime} • 
                          Max Income: ₹{charity.eligibilityIncome.toLocaleString('en-IN')}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleCharitySelection(charity.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• All applications are subject to eligibility verification</p>
            <p>• Processing time may vary based on document completeness</p>
            <p>• Charity support is provided based on available funds</p>
            <p>• Contact the organization directly for urgent cases</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};