import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsSection from "@/components/NewsSection";
import EmergencySection from "@/components/EmergencySection";
import ChatbotDemo from "@/components/ChatbotDemo";
import UserDashboard from "@/components/UserDashboard";
import Footer from "@/components/Footer";

const Index = () => {
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
