import { 
  MessageSquare, 
  Database, 
  Globe, 
  GraduationCap, 
  Calendar, 
  Phone, 
  Shield,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp & SMS Integration",
    description: "Seamless chatbot interaction through popular messaging platforms accessible to all communities.",
    category: "MVP"
  },
  {
    icon: Database,
    title: "Government Health Database",
    description: "Real-time integration with official health databases for accurate disease alerts and updates.",
    category: "MVP"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Communication in English and vernacular languages to break language barriers in healthcare.",
    category: "MVP"
  },
  {
    icon: GraduationCap,
    title: "Preventive Healthcare Education",
    description: "Interactive educational content on disease prevention, hygiene practices, and healthy living.",
    category: "MVP"
  },
  {
    icon: Calendar,
    title: "Vaccination Schedules & Reminders",
    description: "Automated vaccination tracking and timely reminders for children and adults.",
    category: "MVP"
  },
  {
    icon: Phone,
    title: "Emergency Contacts & Doctor Suggestions",
    description: "Instant access to emergency services and nearby healthcare providers based on location.",
    category: "MVP"
  },
  {
    icon: Shield,
    title: "Privacy & Consent Management",
    description: "Secure data handling with user consent and privacy protection compliance.",
    category: "MVP"
  },
  {
    icon: Zap,
    title: "AI-Powered Health Insights",
    description: "Smart health analysis and personalized recommendations based on user interactions.",
    category: "Novelty"
  }
];

const FeaturesSection = () => {
  const mvpFeatures = features.filter(f => f.category === "MVP");
  const noveltyFeatures = features.filter(f => f.category === "Novelty");

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Core Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed for rural and semi-urban communities
          </p>
        </div>

        {/* MVP Features */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
              MVP
            </div>
            <h3 className="text-2xl font-bold text-foreground">Essential Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mvpFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-healthcare transition-smooth hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Novelty Features */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
              NOVELTY
            </div>
            <h3 className="text-2xl font-bold text-foreground">Advanced Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noveltyFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-healthcare transition-smooth hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-secondary rounded-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;