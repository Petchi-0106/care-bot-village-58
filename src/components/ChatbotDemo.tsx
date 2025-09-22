import { useState, useEffect } from "react";
import { Send, Bot, User, MessageCircle, Mic, Image as ImageIcon, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your AI Health Assistant. I can help you with health information, vaccination schedules, emergency contacts, and more. How can I assist you today?",
    sender: 'bot',
    timestamp: '10:30 AM'
  }
];

const quickReplies = [
  "Vaccination schedule",
  "Emergency contacts",
  "Disease symptoms",
  "Nearby hospitals",
  "Health tips"
];

const ChatbotDemo = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the AI health assistant.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    const currentMessage = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('health-chatbot', {
        body: {
          message: currentMessage,
          sessionId,
          userId: user.id,
          language: 'english'
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setSessionId(data.sessionId);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      
      // Fallback response
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team for assistance.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Interactive Chatbot Demo
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our AI health assistant - try asking about vaccinations, symptoms, or emergency help
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-healthcare border-0">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Bot className="h-6 w-6" />
                AI Health Assistant
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Online</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Chat messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'bot' ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-6 py-3 border-t bg-muted/50">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="p-6 border-t bg-white">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your health question here..."
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button variant="ghost" size="sm" className="p-1">
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Sign in to chat with our AI health assistant</p>
                    <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary-dark">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to Chat
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemo;