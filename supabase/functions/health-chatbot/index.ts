import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId, language = 'english' } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Received chat request:', { message, sessionId, userId, language });

    // Get or create chat session
    let session;
    if (sessionId) {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    } else {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_type: 'web',
          language
        })
        .select()
        .single();
      
      if (error) throw error;
      session = data;
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(10);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user's health records for context
    const { data: healthRecords } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId);

    // Get active health alerts
    const { data: healthAlerts } = await supabase
      .from('health_alerts')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    // Build context for AI
    const systemPrompt = `You are MedAdvisor, an AI-powered public health chatbot designed to provide healthcare guidance and disease awareness. Your responses should be:

1. ACCURATE and based on medical knowledge
2. CULTURALLY SENSITIVE and appropriate for rural/semi-urban communities
3. SUPPORTIVE and empathetic
4. CLEAR and easy to understand
5. MULTILINGUAL when requested (currently in ${language})

USER CONTEXT:
- User Profile: ${profile ? `Name: ${profile.full_name}, Gender: ${profile.gender}, Blood Group: ${profile.blood_group}` : 'No profile data'}
- Health Conditions: ${healthRecords?.map(r => r.condition_name).join(', ') || 'None recorded'}
- Allergies: ${healthRecords?.flatMap(r => r.allergies || []).join(', ') || 'None recorded'}

CURRENT HEALTH ALERTS:
${healthAlerts?.map(alert => `- ${alert.title}: ${alert.content}`).join('\n') || 'No active alerts'}

IMPORTANT GUIDELINES:
- Always recommend consulting healthcare professionals for serious symptoms
- Provide preventive care advice
- Suggest vaccination schedules when appropriate
- Be supportive about mental health
- If asked about emergency situations, provide emergency contacts
- Never diagnose conditions - only provide general health guidance
- Encourage users to maintain their health records

Remember: You are NOT a replacement for professional medical care. Always encourage users to consult healthcare professionals for serious concerns.`;

    // Prepare conversation for OpenAI
    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Generated response:', assistantMessage);

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        role: 'user',
        content: message,
        message_type: 'text'
      });

    // Save assistant response
    await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        role: 'assistant',
        content: assistantMessage,
        message_type: 'text'
      });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in health-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});