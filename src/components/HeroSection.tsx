import { MessageCircle, Smartphone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/healthcare-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Healthcare professionals and patients using AI chatbot technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-primary font-medium mb-6">
            <Shield className="h-4 w-4" />
            SIH 2025 Innovation
          </div>

          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            AI-Driven Public Health Chatbot for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Disease Awareness
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering rural and semi-urban communities with multilingual AI healthcare support, 
            vaccination reminders, emergency assistance, and real-time health education through 
            WhatsApp and SMS integration.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary-light text-white px-8 py-4 text-lg font-semibold shadow-healthcare transition-smooth"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Try Chatbot (WhatsApp)
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-smooth"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Try Chatbot (SMS)
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-success rounded-full" />
              Government Integrated
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-info rounded-full" />
              Multilingual Support
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-health-warning rounded-full" />
              24/7 Available
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;