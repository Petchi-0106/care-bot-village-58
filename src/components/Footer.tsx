import { Heart, MessageCircle, Phone, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "About Project", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Health News", href: "#news" },
    { name: "Emergency Help", href: "#emergency" },
    { name: "Privacy Policy", href: "#" }
  ];

  const contactInfo = [
    { icon: Phone, text: "Emergency: 108", href: "tel:108" },
    { icon: Mail, text: "support@aihealthbot.gov.in", href: "mailto:support@aihealthbot.gov.in" },
    { icon: MapPin, text: "All India Institute of Medical Sciences", href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">AI Health Chatbot</h3>
                <p className="text-sm text-muted-foreground">SIH 2025 Innovation</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering rural and semi-urban communities with AI-driven healthcare support, 
              multilingual assistance, and emergency services integration.
            </p>
            <div className="flex gap-3">
              <Button className="bg-secondary hover:bg-secondary-light">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Phone className="mr-2 h-4 w-4" />
                Emergency
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index}>
                  <a 
                    href={contact.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <contact.icon className="h-4 w-4" />
                    <span className="text-sm">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social links */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-foreground mb-3">Follow Us</h5>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Government compliance section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; 2025 AI Health Chatbot - SIH 2025. A Government of India Initiative.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Developed under Smart India Hackathon 2025 | Ministry of Health & Family Welfare
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="py-4 bg-health-emergency/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-health-emergency/20">
          <div className="flex items-center justify-center gap-2 text-health-emergency">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">
              Emergency Services: Call 108 | Women Helpline: 1091 | Child Helpline: 1098
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;