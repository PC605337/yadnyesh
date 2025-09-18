import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number; // Amount in paise (INR)
  currency: string;
  patient_id: string;
  provider_id?: string;
  appointment_id?: string;
  transaction_type: string;
  payment_method: string;
  description?: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
  };
}

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
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
      amount,
      currency = 'INR',
      patient_id,
      provider_id,
      appointment_id,
      transaction_type,
      payment_method,
      description,
      customer_details
    }: PaymentRequest = await req.json();

    console.log(`Processing payment request: ₹${amount/100} for ${transaction_type}`);

    // Get Razorpay credentials
    const razorpayKey = Deno.env.get('RAZORPAY_API_KEY');
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY');

    if (!razorpayKey || !razorpaySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount), // Amount in paise
      currency: currency,
      receipt: `txn_${Date.now()}_${patient_id.substring(0, 8)}`,
      notes: {
        patient_id,
        provider_id: provider_id || '',
        appointment_id: appointment_id || '',
        transaction_type,
        payment_method
      }
    };

    const authHeader = `Basic ${btoa(`${razorpayKey}:${razorpaySecret}`)}`;

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API Error:', errorData);
      throw new Error(`Razorpay API error: ${razorpayResponse.status}`);
    }

    const razorpayOrder: RazorpayOrderResponse = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder.id);

    // Create transaction record in database
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const { data: transaction, error: dbError } = await supabaseClient
      .from('payment_transactions')
      .insert([{
        patient_id,
        provider_id,
        appointment_id,
        transaction_type,
        payment_method,
        amount: amount / 100, // Convert paise to rupees for storage
        currency,
        transaction_id: transactionId,
        gateway_transaction_id: razorpayOrder.id,
        status: 'pending',
        payment_gateway: 'razorpay',
        gateway_response: {
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          status: razorpayOrder.status,
          created_at: razorpayOrder.created_at
        },
        metadata: {
          customer_details,
          description: description || `${transaction_type} payment`,
          receipt: razorpayOrder.id
        }
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create transaction record');
    }

    console.log(`Transaction created: ${transactionId}`);

    // Return payment details for frontend processing
    return new Response(
      JSON.stringify({
        success: true,
        payment_details: {
          razorpay_order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          transaction_id: transactionId
        },
        razorpay_config: {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'HealthCare+ Platform',
          description: description || `${transaction_type} payment`,
          order_id: razorpayOrder.id,
          prefill: {
            name: customer_details.name,
            email: customer_details.email,
            contact: customer_details.phone
          },
          theme: {
            color: '#3b82f6'
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in process-payment function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Payment processing failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});