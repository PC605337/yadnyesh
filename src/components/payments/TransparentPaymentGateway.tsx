import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, CreditCard, Wallet, Building2, Calculator, Shield, Clock, Zap } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  processingFee: number;
  processingTime: string;
  maxAmount?: number;
  features: string[];
  priority: number;
}

interface TransparentPaymentProps {
  amount: number;
  serviceType: 'teleconsult' | 'lab_test' | 'hospital_visit' | 'prescription';
  onPaymentSuccess: (paymentId: string, method: string) => void;
}

export const TransparentPaymentGateway = ({ amount, serviceType, onPaymentSuccess }: TransparentPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI (Recommended)',
      icon: <Zap className="h-5 w-5" />,
      processingFee: 0,
      processingTime: 'Instant',
      features: ['Zero fees', 'Instant confirmation', 'Most popular'],
      priority: 1
    },
    {
      id: 'cards',
      name: 'Credit/Debit Cards',
      icon: <CreditCard className="h-5 w-5" />,
      processingFee: 1.8,
      processingTime: '2-3 minutes',
      features: ['Widely accepted', 'EMI available', 'Secure'],
      priority: 2
    },
    {
      id: 'wallets',
      name: 'Digital Wallets',
      icon: <Wallet className="h-5 w-5" />,
      processingFee: 0.5,
      processingTime: 'Instant',
      features: ['Quick payment', 'Rewards available', 'No OTP required'],
      priority: 3
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="h-5 w-5" />,
      processingFee: 2.0,
      processingTime: '3-5 minutes',
      features: ['Bank security', 'Higher limits', 'Detailed records'],
      priority: 4
    },
    {
      id: 'emi',
      name: 'EMI Financing',
      icon: <Calculator className="h-5 w-5" />,
      processingFee: 0,
      processingTime: '5-10 minutes',
      maxAmount: amount >= 1000 ? undefined : 1000,
      features: ['0% interest options', 'Flexible tenure', 'Instant approval'],
      priority: 5
    }
  ].sort((a, b) => a.priority - b.priority);

  const calculateTotal = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    const fee = method ? (amount * method.processingFee) / 100 : 0;
    return amount + fee;
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

  const getServiceName = () => {
    switch (serviceType) {
      case 'teleconsult': return 'Teleconsultation';
      case 'lab_test': return 'Lab Test';
      case 'hospital_visit': return 'Hospital Visit';
      case 'prescription': return 'Prescription';
      default: return 'Healthcare Service';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{getServiceIcon()}</span>
            Transparent Payment Gateway
          </CardTitle>
          <CardDescription>
            Pay for {getServiceName()} • Amount: ₹{amount.toLocaleString('en-IN')} • All fees disclosed upfront
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {paymentMethods.map((method) => {
              const isDisabled = method.maxAmount && amount < method.maxAmount;
              const total = calculateTotal(method.id);
              const fee = total - amount;
              
              return (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedMethod === method.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:shadow-md'
                  } ${isDisabled ? 'opacity-50' : ''}`}
                  onClick={() => !isDisabled && setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`text-primary ${method.id === 'upi' ? 'text-green-600' : ''}`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{method.name}</h3>
                            {method.id === 'upi' && (
                              <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                            )}
                            {method.processingFee === 0 && (
                              <Badge variant="secondary">No Fee</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {method.features.map((feature) => (
                              <span key={feature} className="text-xs bg-muted px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {method.processingTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {method.processingFee === 0 ? 'No fees' : `${method.processingFee}% fee`}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-lg">
                          ₹{total.toLocaleString('en-IN')}
                        </div>
                        {fee > 0 && (
                          <div className="text-xs text-muted-foreground">
                            + ₹{fee.toFixed(2)} fee
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Total amount
                        </div>
                      </div>
                    </div>
                    {isDisabled && (
                      <div className="mt-2 text-xs text-red-600">
                        Minimum amount: ₹{method.maxAmount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{getServiceName()} Amount:</span>
              <span>₹{amount.toLocaleString('en-IN')}</span>
            </div>
            {(() => {
              const method = paymentMethods.find(m => m.id === selectedMethod);
              const fee = method ? (amount * method.processingFee) / 100 : 0;
              return fee > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fee ({method?.processingFee}%):</span>
                  <span>₹{fee.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-green-600">
                  <span>Processing Fee:</span>
                  <span>₹0.00 (Waived)</span>
                </div>
              );
            })()}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Payable:</span>
              <span>₹{calculateTotal(selectedMethod).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          size="lg"
          onClick={() => onPaymentSuccess(`PAY_${Date.now()}`, selectedMethod)}
        >
          Pay ₹{calculateTotal(selectedMethod).toLocaleString('en-IN')}
        </Button>
        <Button variant="outline" size="lg">
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔒 All payments are secured with 256-bit SSL encryption</p>
            <p>💰 No hidden charges - all fees displayed upfront</p>
            <p>📱 Instant confirmation and digital receipt</p>
            <p>🔄 Easy refunds within 24 hours for eligible transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};