import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UPIApp {
  name: string;
  logo: string;
  color: string;
}

export const UPIQRPayment = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { toast } = useToast();

  const upiApps: UPIApp[] = [
    { name: 'Google Pay', logo: '🟢', color: 'bg-green-100' },
    { name: 'PhonePe', logo: '🟣', color: 'bg-purple-100' },
    { name: 'Paytm', logo: '🔵', color: 'bg-blue-100' },
    { name: 'BHIM', logo: '🟠', color: 'bg-orange-100' },
    { name: 'Amazon Pay', logo: '🟡', color: 'bg-yellow-100' }
  ];

  // Generate UPI QR code (mock)
  useEffect(() => {
    const merchantId = 'HEALTHCARE@paytm';
    const transactionRef = `TXN${Date.now()}`;
    const upiString = `upi://pay?pa=${merchantId}&pn=Healthcare App&tr=${transactionRef}&am=${amount}&cu=INR`;
    setQrCode(upiString);
  }, [amount]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, paymentStatus]);

  const handleManualVerification = () => {
    setPaymentStatus('processing');
    // Simulate payment verification
    setTimeout(() => {
      setPaymentStatus('success');
      toast({
        title: "Payment Successful!",
        description: `₹${amount.toLocaleString('en-IN')} paid successfully via UPI`,
      });
      onSuccess();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (paymentStatus === 'success') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground">
            ₹{amount.toLocaleString('en-IN')} has been paid successfully
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            UPI QR Code Payment
          </CardTitle>
          <CardDescription>
            Scan the QR code with any UPI app to pay ₹{amount.toLocaleString('en-IN')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {/* Mock QR Code */}
            <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 ${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">
                Time remaining: {formatTime(timeLeft)}
              </span>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>1. Open any UPI app on your phone</p>
              <p>2. Scan the QR code above</p>
              <p>3. Verify the amount and complete payment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supported UPI Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {upiApps.map((app) => (
              <div key={app.name} className={`p-3 rounded-lg text-center ${app.color}`}>
                <div className="text-2xl mb-1">{app.logo}</div>
                <div className="text-xs font-medium">{app.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleManualVerification}
              disabled={paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                'I have completed the payment'
              )}
            </Button>
            <Button variant="secondary" className="flex-1">
              Need Help?
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Payment will be automatically verified once completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};