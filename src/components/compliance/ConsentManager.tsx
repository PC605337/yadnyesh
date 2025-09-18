import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Users, Bell, Eye, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsentItem {
  id: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  title: string;
  description: string;
  required: boolean;
  granted: boolean;
  grantedAt?: string;
  purposes: string[];
  dataTypes: string[];
  thirdParties?: string[];
}

interface ConsentHistory {
  id: string;
  action: 'granted' | 'revoked' | 'updated';
  consentId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export const ConsentManager = () => {
  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: 'essential-services',
      category: 'essential',
      title: 'Essential Healthcare Services',
      description: 'Required for basic platform functionality, authentication, and healthcare delivery',
      required: true,
      granted: true,
      grantedAt: new Date().toISOString(),
      purposes: ['Authentication', 'Healthcare delivery', 'Security', 'Legal compliance'],
      dataTypes: ['Personal information', 'Health records', 'Authentication data', 'Transaction data']
    },
    {
      id: 'provider-sharing',
      category: 'functional',
      title: 'Healthcare Provider Data Sharing',
      description: 'Share your health information with selected healthcare providers for consultations',
      required: false,
      granted: true,
      grantedAt: new Date().toISOString(),
      purposes: ['Medical consultations', 'Treatment coordination', 'Prescription management'],
      dataTypes: ['Health records', 'Medical history', 'Prescription data', 'Lab results'],
      thirdParties: ['Verified healthcare providers', 'Pharmacy partners', 'Lab partners']
    },
    {
      id: 'family-access',
      category: 'functional',
      title: 'Family Member Access',
      description: 'Allow designated family members to access your health information in emergencies',
      required: false,
      granted: false,
      purposes: ['Emergency access', 'Care coordination', 'Family notifications'],
      dataTypes: ['Emergency contact info', 'Basic health status', 'Appointment information']
    },
    {
      id: 'analytics-improvement',
      category: 'analytics',
      title: 'Platform Analytics & Improvement',
      description: 'Help us improve our services through anonymized usage analytics',
      required: false,
      granted: true,
      grantedAt: new Date().toISOString(),
      purposes: ['Service improvement', 'Quality assurance', 'Research & development'],
      dataTypes: ['Usage patterns', 'Performance metrics', 'Anonymized health trends']
    },
    {
      id: 'marketing-communications',
      category: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive personalized health tips, wellness programs, and service updates',
      required: false,
      granted: false,
      purposes: ['Health education', 'Wellness programs', 'Service announcements'],
      dataTypes: ['Contact information', 'Health interests', 'Communication preferences']
    }
  ]);

  const [consentHistory, setConsentHistory] = useState<ConsentHistory[]>([
    {
      id: 'hist_001',
      action: 'granted',
      consentId: 'essential-services',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]);

  const { toast } = useToast();

  const updateConsent = (consentId: string, granted: boolean) => {
    setConsents(prev => prev.map(consent => {
      if (consent.id === consentId) {
        const updated = {
          ...consent,
          granted,
          grantedAt: granted ? new Date().toISOString() : undefined
        };
        
        // Add to history
        const historyEntry: ConsentHistory = {
          id: `hist_${Date.now()}`,
          action: granted ? 'granted' : 'revoked',
          consentId,
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.100', // Mock IP
          userAgent: navigator.userAgent
        };
        
        setConsentHistory(prev => [historyEntry, ...prev]);
        
        toast({
          title: granted ? "Consent Granted" : "Consent Revoked",
          description: `${consent.title} has been ${granted ? 'enabled' : 'disabled'}`,
        });
        
        return updated;
      }
      return consent;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-red-100 text-red-800';
      case 'functional': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportConsentData = () => {
    const data = {
      consents,
      consentHistory,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Consent Data Exported",
      description: "Your consent preferences have been downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Consent Management
          </CardTitle>
          <CardDescription>
            Control how your personal and health information is used across our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm" onClick={exportConsentData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="consents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="consents">Consent Preferences</TabsTrigger>
          <TabsTrigger value="history">Consent History</TabsTrigger>
        </TabsList>

        <TabsContent value="consents" className="space-y-4">
          {consents.map((consent) => (
            <Card key={consent.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{consent.title}</h3>
                      <Badge className={getCategoryColor(consent.category)}>
                        {consent.category}
                      </Badge>
                      {consent.required && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{consent.description}</p>
                    
                    {consent.required && (
                      <div className="flex items-center gap-2 mb-3 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">This consent is required for basic platform functionality</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Checkbox
                      id={consent.id}
                      checked={consent.granted}
                      onCheckedChange={(checked) => 
                        !consent.required && updateConsent(consent.id, checked as boolean)
                      }
                      disabled={consent.required}
                    />
                    <label
                      htmlFor={consent.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        consent.granted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {consent.granted ? 'Granted' : 'Not Granted'}
                    </label>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-1">Purposes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {consent.purposes.map((purpose) => (
                        <Badge key={purpose} variant="outline" className="text-xs">
                          {purpose}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-muted-foreground mb-1">Data Types:</h4>
                    <div className="flex flex-wrap gap-1">
                      {consent.dataTypes.map((dataType) => (
                        <Badge key={dataType} variant="outline" className="text-xs">
                          {dataType}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {consent.thirdParties && (
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Shared With:</h4>
                      <div className="flex flex-wrap gap-1">
                        {consent.thirdParties.map((party) => (
                          <Badge key={party} variant="outline" className="text-xs bg-blue-50">
                            {party}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {consent.grantedAt && (
                    <div className="text-xs text-muted-foreground">
                      Granted on: {new Date(consent.grantedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consent Activity Log</CardTitle>
              <CardDescription>
                Complete history of your consent preferences and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consentHistory.map((entry) => {
                  const consent = consents.find(c => c.id === entry.consentId);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.action === 'granted' ? 'bg-green-500' :
                          entry.action === 'revoked' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium">
                            {consent?.title || 'Unknown Consent'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.action === 'granted' ? 'Consent granted' :
                             entry.action === 'revoked' ? 'Consent revoked' : 'Consent updated'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Your Rights</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You can withdraw consent at any time (except for essential services)</li>
                <li>• Changes take effect immediately and are logged for compliance</li>
                <li>• You can export your complete consent history</li>
                <li>• Contact our privacy team for any questions or concerns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};