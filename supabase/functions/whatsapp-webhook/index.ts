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
    const body = await req.json();
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));

    // Verify webhook (for initial setup)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
        return new Response(challenge, { status: 200 });
      } else {
        return new Response('Forbidden', { status: 403 });
      }
    }

    // Handle incoming messages
    if (body.entry && body.entry[0] && body.entry[0].changes && body.entry[0].changes[0]) {
      const change = body.entry[0].changes[0];
      
      if (change.value && change.value.messages && change.value.messages[0]) {
        const message = change.value.messages[0];
        const from = message.from;
        const messageText = message.text ? message.text.body : '';
        
        console.log(`Message from ${from}: ${messageText}`);
        
        // Find or create user session
        let session;
        const { data: existingSession } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('session_type', 'whatsapp')
          .eq('user_id', from)
          .single();
        
        if (existingSession) {
          session = existingSession;
        } else {
          const { data: newSession, error } = await supabase
            .from('chat_sessions')
            .insert({
              user_id: from,
              session_type: 'whatsapp',
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
          .limit(10);

        // Generate AI response
        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAIApiKey) {
          throw new Error('OpenAI API key not configured');
        }

        const systemPrompt = `You are MedAdvisor, an AI-powered public health chatbot for WhatsApp. Provide concise, helpful health guidance. Keep responses under 160 characters when possible for SMS compatibility. Always recommend consulting healthcare professionals for serious symptoms.`;

        const conversationMessages = [
          { role: 'system', content: systemPrompt },
          ...(messages || []).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: messageText }
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
            max_tokens: 150,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Save messages to database
        await supabase
          .from('chat_messages')
          .insert([
            {
              session_id: session.id,
              role: 'user',
              content: messageText,
              message_type: 'text'
            },
            {
              session_id: session.id,
              role: 'assistant',
              content: assistantMessage,
              message_type: 'text'
            }
          ]);

        // Send response back via WhatsApp API
        const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
        const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
        
        if (whatsappToken && phoneNumberId) {
          await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: from,
              text: { body: assistantMessage }
            }),
          });
        }
      }
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});