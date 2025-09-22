import { useState } from "react";
import { Send, Bot, User, MessageCircle, Mic, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      
      if (inputText.toLowerCase().includes("vaccination")) {
        botResponse = "I can help you with vaccination information! Here's your upcoming schedule:\n\n• COVID-19 Booster: Due in 2 weeks\n• Flu Shot: Annual (Due in 3 months)\n• Hepatitis B: Complete ✓\n\nWould you like me to set reminders for these?";
      } else if (inputText.toLowerCase().includes("emergency")) {
        botResponse = "Here are the emergency contacts for your area:\n\n🚨 Emergency Services: 108\n🏥 Nearest Hospital: District Hospital (15.7 km)\n👩‍⚕️ Doctor on Call: Dr. Priya Sharma\n\nWould you like me to help you contact any of these?";
      } else if (inputText.toLowerCase().includes("symptoms") || inputText.toLowerCase().includes("fever")) {
        botResponse = "I understand you're asking about symptoms. Please note I can provide general information only.\n\nFor fever:\n• Monitor temperature regularly\n• Stay hydrated\n• Rest adequately\n• Seek medical help if fever >101°F or persists >3 days\n\n⚠️ For serious symptoms, please contact emergency services immediately.";
      } else {
        botResponse = "Thank you for your question! I'm here to help with health information, vaccination schedules, emergency contacts, and general health guidance. Could you please specify what you'd like to know more about?";
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
                    disabled={!inputText.trim()}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemo;