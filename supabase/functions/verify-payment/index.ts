import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  transaction_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_id
    }: PaymentVerificationRequest = await req.json();

    console.log(`Verifying payment: ${razorpay_payment_id} for transaction: ${transaction_id}`);

    // Get Razorpay credentials
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY');
    if (!razorpaySecret) {
      throw new Error('Razorpay secret key not configured');
    }

    // Verify signature
    const crypto = await import('node:crypto');
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      console.error('Invalid payment signature');
      throw new Error('Payment verification failed - invalid signature');
    }

    // Get payment details from Razorpay
    const razorpayKey = Deno.env.get('RAZORPAY_API_KEY');
    const authHeader = `Basic ${btoa(`${razorpayKey}:${razorpaySecret}`)}`;

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!paymentResponse.ok) {
      throw new Error(`Failed to fetch payment details: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment verification successful:', paymentData.status);

    // Update transaction in database
    const { data: updatedTransaction, error: dbError } = await supabaseClient
      .from('payment_transactions')
      .update({
        status: paymentData.status === 'captured' ? 'completed' : 'failed',
        gateway_response: {
          ...paymentData,
          verified_at: new Date().toISOString()
        },
        completed_at: paymentData.status === 'captured' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', transaction_id)
      .select()
      .single();

    if (dbError) {
      console.error('Database update error:', dbError);
      throw new Error('Failed to update transaction status');
    }

    // If payment is successful and it's a wallet top-up, update wallet balance
    if (paymentData.status === 'captured' && updatedTransaction.transaction_type === 'wallet_topup') {
      const { error: walletError } = await supabaseClient.rpc('update_wallet_balance', {
        user_id: updatedTransaction.patient_id,
        amount: updatedTransaction.amount
      });

      if (walletError) {
        console.error('Wallet update error:', walletError);
        // Don't fail the transaction, but log the error
      }
    }

    console.log(`Transaction ${transaction_id} updated to status: ${updatedTransaction.status}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: paymentData.status,
        transaction_id: transaction_id,
        transaction_status: updatedTransaction.status,
        amount: updatedTransaction.amount,
        payment_method: paymentData.method
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in verify-payment function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Payment verification failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});