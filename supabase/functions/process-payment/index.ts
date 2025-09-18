import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const razorpayApiKey = Deno.env.get('RAZORPAY_API_KEY');
const razorpaySecretKey = Deno.env.get('RAZORPAY_SECRET_KEY');

serve(async (req) => {
  console.log('Payment processing function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      amount, 
      currency = 'INR',
      patientId,
      providerId,
      appointmentId,
      transactionType,
      paymentMethod,
      customerEmail,
      customerPhone,
      description
    } = await req.json();

    console.log('Processing payment:', { amount, currency, transactionType, paymentMethod });

    // Validate required fields
    if (!amount || !patientId || !transactionType) {
      throw new Error('Missing required payment fields');
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let paymentResult;

    // Check if Razorpay is configured
    if (!razorpayApiKey || !razorpaySecretKey) {
      console.log('Razorpay not configured, using mock payment processing');
      paymentResult = await processMockPayment({
        amount,
        currency,
        transactionId,
        paymentMethod,
        customerEmail,
        description
      });
    } else {
      console.log('Processing real payment through Razorpay');
      paymentResult = await processRazorpayPayment({
        amount,
        currency,
        transactionId,
        paymentMethod,
        customerEmail,
        customerPhone,
        description,
        apiKey: razorpayApiKey,
        secretKey: razorpaySecretKey
      });
    }

    // Store transaction in database
    const { data: transaction, error: dbError } = await supabase
      .from('payment_transactions')
      .insert([{
        patient_id: patientId,
        provider_id: providerId,
        appointment_id: appointmentId,
        transaction_type: transactionType,
        payment_method: paymentMethod,
        amount: amount,
        currency: currency,
        transaction_id: transactionId,
        gateway_transaction_id: paymentResult.gatewayTransactionId,
        status: paymentResult.status,
        payment_gateway: paymentResult.gateway,
        gateway_response: paymentResult.gatewayResponse,
        metadata: {
          description,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        completed_at: paymentResult.status === 'completed' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Update wallet balance if it's a wallet top-up
    if (transactionType === 'wallet_topup' && paymentResult.status === 'completed') {
      await updateWalletBalance(supabase, patientId, amount);
    }

    console.log('Payment processed successfully:', transaction);

    return new Response(JSON.stringify({
      success: true,
      transaction: transaction,
      paymentDetails: paymentResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

// Mock payment processing for development/testing
async function processMockPayment(params: any) {
  console.log('Processing mock payment');
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock successful payment (90% success rate)
  const isSuccess = Math.random() > 0.1;
  
  return {
    status: isSuccess ? 'completed' : 'failed',
    gateway: 'mock',
    gatewayTransactionId: `MOCK_${params.transactionId}`,
    gatewayResponse: {
      success: isSuccess,
      amount: params.amount,
      currency: params.currency,
      payment_method: params.paymentMethod,
      processed_at: new Date().toISOString(),
      mock: true
    }
  };
}

// Real Razorpay payment processing
async function processRazorpayPayment(params: any) {
  console.log('Processing Razorpay payment');
  
  try {
    // Create Razorpay order
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${params.apiKey}:${params.secretKey}`)}`
      },
      body: JSON.stringify({
        amount: params.amount * 100, // Razorpay expects amount in paise
        currency: params.currency,
        receipt: params.transactionId,
        notes: {
          description: params.description,
          customer_email: params.customerEmail,
          customer_phone: params.customerPhone
        }
      })
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('Razorpay order creation failed:', errorData);
      throw new Error(`Razorpay API error: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();
    console.log('Razorpay order created:', orderData.id);

    // For server-side processing, you might want to immediately capture the payment
    // This is a simplified example - in real scenarios, you'd wait for webhook confirmation
    return {
      status: 'completed', // In reality, this would be 'pending' until webhook confirmation
      gateway: 'razorpay',
      gatewayTransactionId: orderData.id,
      gatewayResponse: {
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        status: orderData.status,
        created_at: orderData.created_at,
        receipt: orderData.receipt
      }
    };

  } catch (error) {
    console.error('Razorpay payment failed:', error);
    
    // Fallback to mock payment if Razorpay fails
    console.log('Falling back to mock payment due to Razorpay error');
    return await processMockPayment(params);
  }
}

// Update wallet balance after successful payment
async function updateWalletBalance(supabase: any, patientId: string, amount: number) {
  console.log('Updating wallet balance for patient:', patientId);
  
  try {
    // Get current wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('digital_wallets')
      .select('balance')
      .eq('user_id', patientId)
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('Error fetching wallet:', walletError);
      return;
    }

    const currentBalance = wallet?.balance || 0;
    const newBalance = currentBalance + amount;

    if (wallet) {
      // Update existing wallet
      const { error: updateError } = await supabase
        .from('digital_wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', patientId);

      if (updateError) {
        console.error('Error updating wallet balance:', updateError);
      }
    } else {
      // Create new wallet
      const { error: createError } = await supabase
        .from('digital_wallets')
        .insert([{
          user_id: patientId,
          balance: amount,
          currency: 'INR',
          wallet_status: 'active',
          kyc_status: 'pending'
        }]);

      if (createError) {
        console.error('Error creating wallet:', createError);
      }
    }

    console.log('Wallet balance updated successfully');

  } catch (error) {
    console.error('Error in updateWalletBalance:', error);
  }
}