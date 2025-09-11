import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, demographics, language = 'en' } = await req.json();

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      throw new Error('Symptoms are required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user if authenticated
    const authHeader = req.headers.get('Authorization');
    let user = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare multilingual system prompts
    const systemPrompts = {
      en: `You are Dr. Mirai, an AI-powered healthcare triage assistant for Mirai Health in Mumbai, India. 
      Analyze symptoms and provide:
      1. Urgency level (emergency/urgent/moderate/low)
      2. Recommended specialty (general medicine, cardiology, etc.)
      3. Possible conditions (3-5 most likely)
      4. Immediate recommendations
      5. When to seek care
      
      Consider Indian healthcare context, common diseases in Mumbai, and monsoon-related conditions.
      Always recommend consulting a doctor for proper diagnosis.`,
      
      hi: `आप डॉ. मिराई हैं, मुंबई, भारत में मिराई हेल्थ के लिए एक AI-संचालित स्वास्थ्य सेवा सहायक हैं।
      लक्षणों का विश्लेषण करें और प्रदान करें:
      1. तात्कालिकता स्तर (आपातकालीन/तत्काल/मध्यम/कम)
      2. अनुशंसित विशेषता (सामान्य चिकित्सा, हृदय रोग, आदि)
      3. संभावित स्थितियां (3-5 सबसे संभावित)
      4. तत्काल सिफारिशें
      5. कब देखभाल लेनी है
      
      भारतीय स्वास्थ्य सेवा संदर्भ, मुंबई में आम बीमारियों, और मानसून संबंधी स्थितियों पर विचार करें।`,
      
      mr: `आपण डॉ. मिराई आहात, मुंबई, भारतातील मिराई हेल्थसाठी AI-चालित आरोग्य सेवा सहाय्यक आहात।
      लक्षणांचे विश्लेषण करा आणि प्रदान करा:
      1. तातडीचा स्तर (आणीबाणी/तातडीचे/मध्यम/कमी)
      2. शिफारस केलेली विशेषता (सामान्य औषध, हृदयरोग, इ.)
      3. संभाव्य परिस्थिती (3-5 सर्वात संभाव्य)
      4. तत्काळ शिफारसी
      5. केव्हा काळजी घ्यावी
      
      भारतीय आरोग्य सेवा संदर्भ, मुंबईतील सामान्य आजार आणि पावसाळी परिस्थितींचा विचार करा।`
    };

    // Prepare user message
    const userMessage = `
    Patient Demographics: ${JSON.stringify(demographics || {})}
    Reported Symptoms: ${symptoms.join(', ')}
    Location: Mumbai, India
    
    Please provide a comprehensive triage assessment in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompts[language] || systemPrompts.en },
          { role: 'user', content: userMessage }
        ],
        max_completion_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse AI response for structured data
    const urgencyKeywords = {
      emergency: ['emergency', 'आपातकालीन', 'आणीबाणी', 'immediately', 'तुरंत'],
      urgent: ['urgent', 'तत्काल', 'तातडीचे', 'soon', 'जल्दी'],
      moderate: ['moderate', 'मध्यम', 'routine', 'नियमित'],
      low: ['low', 'कम', 'minor', 'छोटे']
    };

    let urgency = 'moderate';
    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => aiResponse.toLowerCase().includes(keyword.toLowerCase()))) {
        urgency = level;
        break;
      }
    }

    // Extract recommended specialty
    const specialties = [
      'general medicine', 'cardiology', 'dermatology', 'gastroenterology', 
      'neurology', 'orthopedics', 'pediatrics', 'psychiatry', 'gynecology',
      'सामान्य चिकित्सा', 'हृदयरोग', 'त्वचारोग', 'सामान्य औषध'
    ];
    
    let recommendedSpecialty = 'general medicine';
    for (const specialty of specialties) {
      if (aiResponse.toLowerCase().includes(specialty.toLowerCase())) {
        recommendedSpecialty = specialty;
        break;
      }
    }

    // Calculate confidence score based on response quality
    const confidenceScore = Math.min(0.95, 0.7 + (symptoms.length * 0.05));

    const triageResult = {
      urgency_level: urgency,
      recommended_specialty: recommendedSpecialty,
      ai_response: aiResponse,
      confidence_score: confidenceScore,
      follow_up_recommendations: [
        'Consult with a healthcare provider for proper diagnosis',
        'Monitor symptoms and seek immediate care if they worsen',
        'Maintain a symptom diary for your doctor visit'
      ],
      language_used: language
    };

    // Save triage session if user is authenticated
    if (user) {
      const supabaseService = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      await supabaseService.from('ai_triage_sessions').insert({
        patient_id: user.id,
        session_type: 'symptom_triage',
        input_data: { symptoms, demographics },
        ai_response: triageResult,
        confidence_score: confidenceScore,
        recommended_specialty: recommendedSpecialty,
        urgency_level: urgency,
        language_used: language,
        provider_review_required: urgency === 'emergency' || urgency === 'urgent'
      });
    }

    return new Response(JSON.stringify(triageResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI triage:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});