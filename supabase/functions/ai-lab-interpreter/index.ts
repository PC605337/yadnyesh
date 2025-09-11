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
    const { labResults, patientDemographics, language = 'en' } = await req.json();

    if (!labResults) {
      throw new Error('Lab results are required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error('Invalid user token');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Multilingual system prompts for lab interpretation
    const systemPrompts = {
      en: `You are Dr. Mirai, an AI lab result interpreter for Mirai Health in Mumbai, India.
      Analyze lab results and provide:
      1. Overview of results (normal/abnormal findings)
      2. Key concerns or notable values
      3. Potential health implications
      4. Recommended follow-up actions
      5. Questions to ask your doctor
      6. Lifestyle recommendations
      
      Consider Indian reference ranges and common health conditions in Mumbai.
      Always emphasize consulting with healthcare providers for proper medical interpretation.`,
      
      hi: `आप डॉ. मिराई हैं, मुंबई, भारत में मिराई हेल्थ के लिए एक AI लैब परिणाम व्याख्याकार हैं।
      लैब परिणामों का विश्लेषण करें और प्रदान करें:
      1. परिणामों का अवलोकन (सामान्य/असामान्य निष्कर्ष)
      2. मुख्य चिंताएं या उल्लेखनीय मूल्य
      3. संभावित स्वास्थ्य निहितार्थ
      4. अनुशंसित अनुवर्ती कार्य
      5. अपने डॉक्टर से पूछने के लिए प्रश्न
      6. जीवनशैली की सिफारिशें`,
      
      mr: `आपण डॉ. मिराई आहात, मुंबई, भारतातील मिराई हेल्थसाठी AI लॅब रिपोर्ट व्याख्याकार आहात।
      लॅब परिणामांचे विश्लेषण करा आणि प्रदान करा:
      1. परिणामांचे अवलोकन (सामान्य/असामान्य निष्कर्ष)
      2. मुख्य चिंता किंवा लक्षणीय मूल्ये
      3. संभाव्य आरोग्य परिणाम
      4. शिफारस केलेल्या पुढील कृती
      5. आपल्या डॉक्टरांना विचारण्यासाठी प्रश्न
      6. जीवनशैली शिफारसी`
    };

    const userMessage = `
    Patient Demographics: ${JSON.stringify(patientDemographics || {})}
    Lab Results: ${JSON.stringify(labResults)}
    
    Please provide a comprehensive interpretation of these lab results in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
    Include normal/reference ranges and explain what abnormal values might indicate.
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
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content;

    // Identify critical values and recommendations
    const criticalKeywords = ['high', 'low', 'abnormal', 'elevated', 'decreased', 'ऊंचा', 'कम', 'असामान्य', 'वाढलेले', 'कमी झालेले'];
    const hasCriticalFindings = criticalKeywords.some(keyword => 
      interpretation.toLowerCase().includes(keyword.toLowerCase())
    );

    // Generate actionable recommendations
    const recommendations = [
      'Discuss these results with your healthcare provider',
      'Follow up on any abnormal values',
      'Ask about retesting intervals if needed',
      'Inquire about lifestyle modifications'
    ];

    const result = {
      interpretation,
      critical_findings: hasCriticalFindings,
      recommendations,
      language_used: language,
      confidence_level: 0.85,
      requires_physician_review: hasCriticalFindings
    };

    // Save interpretation session
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    await supabaseService.from('ai_triage_sessions').insert({
      patient_id: user.id,
      session_type: 'lab_interpretation',
      input_data: { labResults, patientDemographics },
      ai_response: result,
      confidence_score: 0.85,
      language_used: language,
      provider_review_required: hasCriticalFindings
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in lab interpretation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});