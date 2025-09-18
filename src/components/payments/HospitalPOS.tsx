import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, CreditCard, Banknote, MapPin, Clock, Phone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentCounter {
  id: string;
  name: string;
  location: string;
  floor: string;
  openTime: string;
  closeTime: string;
  queueNumber?: number;
  waitTime?: string;
  acceptedMethods: string[];
  processingFee: number;
}

interface HospitalPOSProps {
  amount: number;
  onSuccess: () => void;
}

export const HospitalPOS = ({ amount, onSuccess }: HospitalPOSProps) => {
  const [selectedCounter, setSelectedCounter] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'qr'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentCounters: PaymentCounter[] = [
    {
      id: 'main-billing',
      name: 'Main Billing Counter',
      location: 'Ground Floor, Near Reception',
      floor: 'Ground Floor',
      openTime: '24/7',
      closeTime: '24/7',
      queueNumber: 12,
      waitTime: '15-20 mins',
      acceptedMethods: ['Credit Card', 'Debit Card', 'Cash', 'UPI QR'],
      processingFee: 2
    },
    {
      id: 'express-counter',
      name: 'Express Payment Counter',
      location: 'First Floor, Wing A',
      floor: '1st Floor',
      openTime: '08:00 AM',
      closeTime: '08:00 PM',
      queueNumber: 5,
      waitTime: '5-10 mins',
      acceptedMethods: ['Credit Card', 'Debit Card', 'UPI QR'],
      processingFee: 1.5
    },
    {
      id: 'emergency-billing',
      name: 'Emergency Billing',
      location: 'Emergency Ward',
      floor: 'Ground Floor',
      openTime: '24/7',
      closeTime: '24/7',
      queueNumber: 3,
      waitTime: '2-5 mins',
      acceptedMethods: ['Credit Card', 'Debit Card', 'Cash'],
      processingFee: 0
    },
    {
      id: 'pharmacy-counter',
      name: 'Pharmacy Payment',
      location: 'Hospital Pharmacy',
      floor: 'Ground Floor',
      openTime: '06:00 AM',
      closeTime: '11:00 PM',
      queueNumber: 8,
      waitTime: '10-15 mins',
      acceptedMethods: ['Credit Card', 'Debit Card', 'Cash', 'UPI QR'],
      processingFee: 1
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Pay using your card at POS terminal',
      fee: 'Processing fee applies'
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: <Banknote className="h-5 w-5" />,
      description: 'Pay in cash at the counter',
      fee: 'No additional charges'
    },
    {
      id: 'qr',
      name: 'Hospital QR Code',
      icon: <QrCode className="h-5 w-5" />,
      description: 'Scan hospital QR with UPI app',
      fee: 'No additional charges'
    }
  ];

  const handleProceedToCounter = () => {
    if (!selectedCounter) {
      toast({
        title: "Please select a counter",
        description: "Choose a payment counter to proceed",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const counter = paymentCounters.find(c => c.id === selectedCounter);
    
    toast({
      title: "Counter Booked",
      description: `Your queue number is ${counter?.queueNumber}. Please visit ${counter?.name}`,
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `₹${amount.toLocaleString('en-IN')} paid successfully at ${counter?.name}`,
      });
      onSuccess();
    }, 3000);
  };

  const calculateTotalAmount = () => {
    if (!selectedCounter) return amount;
    const counter = paymentCounters.find(c => c.id === selectedCounter);
    const processingFee = paymentMethod === 'card' ? (amount * (counter?.processingFee || 0) / 100) : 0;
    return amount + processingFee;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Hospital POS Payment
          </CardTitle>
          <CardDescription>
            Pay at hospital counters using card, cash, or QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Select Payment Counter</h3>
              <div className="grid gap-3">
                {paymentCounters.map((counter) => (
                  <Card 
                    key={counter.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCounter === counter.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCounter(counter.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{counter.name}</h4>
                            <Badge variant="outline">
                              Queue: {counter.queueNumber}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {counter.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {counter.openTime} - {counter.closeTime}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {counter.acceptedMethods.map((method) => (
                              <Badge key={method} variant="secondary" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-green-600">
                            Wait: {counter.waitTime}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Fee: {counter.processingFee}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      paymentMethod === method.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setPaymentMethod(method.id as 'card' | 'cash' | 'qr')}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-primary mb-2">{method.icon}</div>
                      <h4 className="font-semibold text-sm mb-1">{method.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {method.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {method.fee}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCounter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service Amount:</span>
                <span>₹{amount.toLocaleString('en-IN')}</span>
              </div>
              {paymentMethod === 'card' && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fee ({paymentCounters.find(c => c.id === selectedCounter)?.processingFee}%):</span>
                  <span>₹{((amount * (paymentCounters.find(c => c.id === selectedCounter)?.processingFee || 0)) / 100).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{calculateTotalAmount().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === 'qr' && selectedCounter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hospital QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {/* Mock QR Code */}
            <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 ${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan this QR code with any UPI app to pay ₹{calculateTotalAmount().toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button 
          onClick={handleProceedToCounter} 
          disabled={!selectedCounter || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : 'Proceed to Counter'}
        </Button>
        <Button variant="outline" className="flex-1">
          <Phone className="h-4 w-4 mr-2" />
          Call Support
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Please carry a valid ID for verification</p>
            <p>• Queue numbers are approximate wait times</p>
            <p>• Emergency payments get priority processing</p>
            <p>• Receipt will be provided after successful payment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};