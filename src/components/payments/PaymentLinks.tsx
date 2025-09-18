import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Link, Copy, Share2, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentLink {
  id: string;
  serviceType: 'teleconsult' | 'lab_test' | 'hospital_visit' | 'prescription';
  amount: number;
  doctorName?: string;
  appointmentDate?: string;
  testName?: string;
  url: string;
  qrCode: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
}

interface PaymentLinksProps {
  serviceType: 'teleconsult' | 'lab_test' | 'hospital_visit' | 'prescription';
  amount: number;
  metadata?: {
    doctorName?: string;
    appointmentDate?: string;
    testName?: string;
    prescriptionId?: string;
  };
}

export const PaymentLinks = ({ serviceType, amount, metadata }: PaymentLinksProps) => {
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePaymentLink = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate payment link
    setTimeout(() => {
      const linkId = `PAY_${Date.now()}`;
      const baseUrl = window.location.origin;
      const paymentUrl = `${baseUrl}/pay/${linkId}`;
      
      const newLink: PaymentLink = {
        id: linkId,
        serviceType,
        amount,
        doctorName: metadata?.doctorName,
        appointmentDate: metadata?.appointmentDate,
        testName: metadata?.testName,
        url: paymentUrl,
        qrCode: `upi://pay?pa=healthcare@paytm&pn=Healthcare App&tr=${linkId}&am=${amount}&cu=INR`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        status: 'active'
      };
      
      setPaymentLink(newLink);
      setIsGenerating(false);
      
      toast({
        title: "Payment link generated!",
        description: "Share this link with the patient for quick payment",
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Payment link has been copied to your clipboard",
    });
  };

  const shareLink = () => {
    if (navigator.share && paymentLink) {
      navigator.share({
        title: 'Healthcare Payment',
        text: `Pay for your ${getServiceName()} - ₹${amount}`,
        url: paymentLink.url,
      });
    } else {
      copyToClipboard(paymentLink?.url || '');
    }
  };

  const getServiceName = () => {
    switch (serviceType) {
      case 'teleconsult': return 'Teleconsultation';
      case 'lab_test': return 'Lab Test';
      case 'hospital_visit': return 'Hospital Visit';
      case 'prescription': return 'Prescription';
      default: return 'Healthcare Service';
    }
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case 'teleconsult': return '💻';
      case 'lab_test': return '🧪';
      case 'hospital_visit': return '🏥';
      case 'prescription': return '💊';
      default: return '💳';
    }
  };

  if (!paymentLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            One-Tap Payment Link
          </CardTitle>
          <CardDescription>
            Generate instant payment link for {getServiceName()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getServiceIcon()}</span>
              <div>
                <h3 className="font-semibold">{getServiceName()}</h3>
                <p className="text-sm text-muted-foreground">
                  Amount: ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            
            {metadata && (
              <div className="space-y-1 text-sm">
                {metadata.doctorName && (
                  <p><span className="text-muted-foreground">Doctor:</span> {metadata.doctorName}</p>
                )}
                {metadata.appointmentDate && (
                  <p><span className="text-muted-foreground">Date:</span> {metadata.appointmentDate}</p>
                )}
                {metadata.testName && (
                  <p><span className="text-muted-foreground">Test:</span> {metadata.testName}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Features:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>One-tap payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>QR code included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24hr validity</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Auto receipt</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={generatePaymentLink} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate Payment Link'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Payment Link Ready
          </CardTitle>
          <CardDescription>
            Share this link with patient for instant payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getServiceIcon()}</span>
                <div>
                  <h3 className="font-semibold">{getServiceName()}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{amount.toLocaleString('en-IN')} • ID: {paymentLink.id}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>

            <div className="bg-white p-3 rounded border break-all text-sm font-mono">
              {paymentLink.url}
            </div>

            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(paymentLink.url)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareLink}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(paymentLink.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* Mock QR Code */}
                <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan with any UPI app
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Link Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {paymentLink.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{new Date(paymentLink.expiresAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-xs">{paymentLink.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded">
            <p>💡 Patient can pay using UPI, cards, wallets, or net banking</p>
            <p>🔔 You'll receive instant notification when payment is completed</p>
            <p>📱 Digital receipt will be automatically generated</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};