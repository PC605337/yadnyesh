import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, CreditCard, Heart, Smartphone, Banknote, Calculator } from 'lucide-react';
import { UPIQRPayment } from './UPIQRPayment';
import { EMIFinancing } from './EMIFinancing';
import { CharityOptions } from './CharityOptions';
import { HospitalPOS } from './HospitalPOS';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingFee: string;
  available: boolean;
}

const IndianPaymentGateway = ({ amount, onPaymentSuccess }: { amount: number; onPaymentSuccess: () => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI QR Code',
      icon: <QrCode className="h-5 w-5" />,
      description: 'Pay using any UPI app - Google Pay, PhonePe, Paytm',
      processingFee: 'Free',
      available: true
    },
    {
      id: 'emi',
      name: 'EMI Financing',
      icon: <Calculator className="h-5 w-5" />,
      description: 'Convert to easy monthly installments',
      processingFee: '0% - 18% APR',
      available: amount >= 1000
    },
    {
      id: 'charity',
      name: 'Charity Support',
      icon: <Heart className="h-5 w-5" />,
      description: 'Subsidized payment through nearby charity organizations',
      processingFee: 'Variable',
      available: true
    },
    {
      id: 'pos',
      name: 'Hospital POS',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Pay at hospital counter with card or cash',
      processingFee: '2% for cards',
      available: true
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Payment Gateway
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method for ₹{amount.toLocaleString('en-IN')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-colors ${
                  selectedMethod === method.id ? 'ring-2 ring-primary' : ''
                } ${!method.available ? 'opacity-50' : ''}`}
                onClick={() => method.available && setSelectedMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-primary">{method.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{method.name}</h3>
                        {!method.available && (
                          <Badge variant="secondary">Not Available</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {method.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Processing fee: {method.processingFee}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upi" disabled={!paymentMethods.find(m => m.id === 'upi')?.available}>
                UPI
              </TabsTrigger>
              <TabsTrigger value="emi" disabled={!paymentMethods.find(m => m.id === 'emi')?.available}>
                EMI
              </TabsTrigger>
              <TabsTrigger value="charity" disabled={!paymentMethods.find(m => m.id === 'charity')?.available}>
                Charity
              </TabsTrigger>
              <TabsTrigger value="pos" disabled={!paymentMethods.find(m => m.id === 'pos')?.available}>
                POS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upi">
              <UPIQRPayment amount={amount} onSuccess={onPaymentSuccess} />
            </TabsContent>

            <TabsContent value="emi">
              <EMIFinancing amount={amount} onSuccess={onPaymentSuccess} />
            </TabsContent>

            <TabsContent value="charity">
              <CharityOptions amount={amount} onSuccess={onPaymentSuccess} />
            </TabsContent>

            <TabsContent value="pos">
              <HospitalPOS amount={amount} onSuccess={onPaymentSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndianPaymentGateway;