import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsSection from "@/components/NewsSection";
import EmergencySection from "@/components/EmergencySection";
import ChatbotDemo from "@/components/ChatbotDemo";
import UserDashboard from "@/components/UserDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="news">
          <NewsSection />
        </section>
        <section id="emergency">
          <EmergencySection />
        </section>
        <section id="chatbot">
          <ChatbotDemo />
        </section>
        <section id="dashboard">
          <UserDashboard />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
