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
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    
    console.log(`SMS from ${from}: ${body}`);
    
    // Clean phone number (remove +1 country code if present)
    const cleanPhone = from.replace(/^\+1/, '');
    
    // Find or create user session
    let session;
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_type', 'sms')
      .eq('user_id', cleanPhone)
      .single();
    
    if (existingSession) {
      session = existingSession;
    } else {
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: cleanPhone,
          session_type: 'sms',
          language: 'english'
        })
        .select()
        .single();
      
      if (error) throw error;
      session = newSession;
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(5); // Fewer messages for SMS to keep context short

    // Generate AI response
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are MedAdvisor, an AI health assistant for SMS. Keep responses VERY short (under 160 characters). Provide essential health guidance only. Always suggest consulting doctors for serious issues. Use simple language suitable for rural communities.`;

    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).slice(-3).map(msg => ({ // Only last 3 messages for SMS
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: body }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        max_tokens: 50, // Very short for SMS
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;
    
    // Ensure message is under 160 characters
    if (assistantMessage.length > 160) {
      assistantMessage = assistantMessage.substring(0, 157) + '...';
    }

    // Save messages to database
    await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: session.id,
          role: 'user',
          content: body,
          message_type: 'text'
        },
        {
          session_id: session.id,
          role: 'assistant',
          content: assistantMessage,
          message_type: 'text'
        }
      ]);

    // Return TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${assistantMessage}</Message>
</Response>`;

    return new Response(twimlResponse, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('SMS webhook error:', error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>Sorry, I'm having trouble right now. Please try again later or call emergency services if urgent.</Message>
</Response>`;

    return new Response(errorResponse, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});