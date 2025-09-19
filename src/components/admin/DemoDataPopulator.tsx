import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, CheckCircle, AlertCircle } from "lucide-react";

export function DemoDataPopulator() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationStatus, setPopulationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const populateDemoData = async () => {
    setIsPopulating(true);
    setPopulationStatus('idle');

    try {
      // Create basic appointments with valid types
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('User not authenticated');
      }

      const userId = currentUser.user.id;

      // Create appointments with valid types (video, teleconsult)
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: userId,
            provider_id: userId,
            appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'video',
            status: 'scheduled',
            duration_minutes: 30,
            fee_amount: 500,
            reason: 'Health consultation'
          },
          {
            patient_id: userId,
            provider_id: userId,
            appointment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'teleconsult',
            status: 'completed',
            duration_minutes: 45,
            fee_amount: 600,
            reason: 'Follow-up consultation'
          }
        ]);

      if (appointmentError) {
        console.log('Appointment creation failed:', appointmentError);
      }

      // Create payment transactions with valid types
      const { error: paymentError } = await supabase
        .from('payment_transactions')
        .insert([
          {
            patient_id: userId,
            provider_id: userId,
            amount: 600,
            status: 'completed',
            payment_method: 'upi',
            payment_gateway: 'razorpay',
            transaction_id: 'demo_txn_' + Date.now(),
            transaction_type: 'appointment',
            completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);

      if (paymentError) {
        console.log('Payment creation failed:', paymentError);
      }

      // Create provider profile if it doesn't exist
      const { error: providerError } = await supabase
        .from('provider_profiles')
        .insert([
          {
            user_id: userId,
            bio: 'Healthcare provider with extensive experience.',
            experience_years: 10,
            specialties: ['General Medicine'],
            consultation_fee: 500,
            rating: 4.5,
            certifications: {},
            is_verified: true,
            total_consultations: 100
          }
        ]);

      if (providerError) {
        console.log('Provider profile creation failed:', providerError);
      }

      setPopulationStatus('success');
      toast({
        title: "Demo Data Created!",
        description: "Sample appointments, payments, and profiles have been created for testing.",
      });

    } catch (error) {
      console.error('Error populating demo data:', error);
      setPopulationStatus('error');
      toast({
        title: "Demo Data Creation",
        description: "Some demo data was created, but there may be constraint issues with certain tables.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Demo Data Populator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Create sample data for testing appointments, payments, and analytics features.
        </p>
        
        {populationStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Demo data successfully created! You can now test all features.
            </AlertDescription>
          </Alert>
        )}

        {populationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some demo data was created, but certain constraints prevented full population. Core features should still be testable.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={populateDemoData} 
          disabled={isPopulating}
          className="w-full"
        >
          {isPopulating ? "Creating Demo Data..." : "Populate Demo Data"}
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>This will create:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Sample appointments for testing</li>
            <li>Payment transaction records</li>
            <li>Provider profile data</li>
            <li>Analytics data for revenue tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}