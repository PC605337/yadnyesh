import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, CreditCard, Building, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EMIOption {
  months: number;
  interestRate: number;
  monthlyAmount: number;
  totalAmount: number;
  provider: string;
  logo: string;
}

interface FinancingProvider {
  name: string;
  logo: string;
  minAmount: number;
  maxTenure: number;
  rateRange: string;
  features: string[];
}

export const EMIFinancing = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const [selectedTenure, setSelectedTenure] = useState<number>(6);
  const [selectedProvider, setSelectedProvider] = useState<string>('bajaj');
  const { toast } = useToast();

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const getEMIOptions = (): EMIOption[] => {
    const options = [3, 6, 9, 12, 18, 24];
    return options.map(months => {
      const rate = months <= 6 ? 0 : months <= 12 ? 12 : 18;
      const monthlyAmount = calculateEMI(amount, rate, months);
      const totalAmount = monthlyAmount * months;
      
      return {
        months,
        interestRate: rate,
        monthlyAmount,
        totalAmount,
        provider: selectedProvider,
        logo: '💳'
      };
    });
  };

  const financingProviders: FinancingProvider[] = [
    {
      name: 'Bajaj Finserv Health EMI',
      logo: '🏦',
      minAmount: 1000,
      maxTenure: 24,
      rateRange: '0% - 18%',
      features: ['Instant approval', 'No documentation', 'Flexible tenure']
    },
    {
      name: 'Zest Money Healthcare',
      logo: '💎',
      minAmount: 500,
      maxTenure: 18,
      rateRange: '0% - 15%',
      features: ['Digital KYC', 'Quick disbursement', 'Cashless treatment']
    },
    {
      name: 'Paymi Health Finance',
      logo: '🔷',
      minAmount: 2000,
      maxTenure: 36,
      rateRange: '8% - 20%',
      features: ['Lower interest rates', 'Higher loan amounts', 'Insurance coverage']
    },
    {
      name: 'MediBuddy EMI',
      logo: '🏥',
      minAmount: 1500,
      maxTenure: 12,
      rateRange: '0% - 12%',
      features: ['Healthcare focused', 'Provider partnerships', 'Easy processing']
    }
  ];

  const emiOptions = getEMIOptions();
  const selectedOption = emiOptions.find(opt => opt.months === selectedTenure);

  const handleProceedWithEMI = () => {
    toast({
      title: "EMI Application Submitted",
      description: `Your application for ${selectedTenure} months EMI has been submitted for approval`,
    });
    
    // Simulate approval process
    setTimeout(() => {
      toast({
        title: "EMI Approved!",
        description: `Your EMI of ₹${selectedOption?.monthlyAmount.toLocaleString('en-IN')}/month has been approved`,
      });
      onSuccess();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            EMI Calculator
          </CardTitle>
          <CardDescription>
            Convert your payment of ₹{amount.toLocaleString('en-IN')} into easy monthly installments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Financing Provider</label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {financingProviders.map((provider) => (
                  <SelectItem key={provider.name} value={provider.name.toLowerCase().replace(/\s+/g, '')}>
                    <div className="flex items-center gap-2">
                      <span>{provider.logo}</span>
                      <span>{provider.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select EMI Tenure</label>
            <div className="grid grid-cols-3 gap-2">
              {emiOptions.map((option) => (
                <Card 
                  key={option.months}
                  className={`cursor-pointer transition-colors ${
                    selectedTenure === option.months ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTenure(option.months)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="font-semibold">{option.months} months</div>
                    <div className="text-sm text-muted-foreground">
                      ₹{option.monthlyAmount.toLocaleString('en-IN')}/mo
                    </div>
                    <div className="text-xs">
                      {option.interestRate === 0 ? (
                        <Badge variant="secondary">0% Interest</Badge>
                      ) : (
                        <span className="text-muted-foreground">{option.interestRate}% APR</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedOption && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">EMI Breakdown</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Principal Amount:</span>
                    <div className="font-semibold">₹{amount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <div className="font-semibold">{selectedOption.interestRate}% per annum</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly EMI:</span>
                    <div className="font-semibold text-primary">₹{selectedOption.monthlyAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <div className="font-semibold">₹{selectedOption.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Processing Fee:</span>
                    <div className="font-semibold">₹0 (Waived)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">First EMI Date:</span>
                    <div className="font-semibold">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const provider = financingProviders.find(p => 
              p.name.toLowerCase().replace(/\s+/g, '') === selectedProvider
            );
            return provider ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Interest Rate: {provider.rateRange} • Min Amount: ₹{provider.minAmount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature) => (
                    <Badge key={feature} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleProceedWithEMI} className="flex-1">
          <CreditCard className="h-4 w-4 mr-2" />
          Apply for EMI
        </Button>
        <Button variant="outline" className="flex-1">
          <Calculator className="h-4 w-4 mr-2" />
          More Details
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• EMI approval is subject to credit check and eligibility criteria</p>
            <p>• Interest rates may vary based on your credit profile</p>
            <p>• Processing fee may apply for certain providers</p>
            <p>• Early repayment allowed with no prepayment charges</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};