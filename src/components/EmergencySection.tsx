import { Phone, MapPin, Clock, AlertTriangle, Heart, Ambulance } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const emergencyContacts = [
  {
    name: "National Emergency Helpline",
    number: "108",
    description: "24/7 Emergency medical services",
    type: "ambulance"
  },
  {
    name: "Women Helpline",
    number: "1091",
    description: "Emergency assistance for women",
    type: "emergency"
  },
  {
    name: "Child Helpline",
    number: "1098",
    description: "Support for children in distress",
    type: "emergency"
  },
  {
    name: "Mental Health Helpline",
    number: "1056",
    description: "Crisis intervention and counseling",
    type: "mental"
  }
];

const nearbyServices = [
  {
    name: "Primary Health Center",
    distance: "2.3 km",
    address: "Main Road, Village Center",
    status: "Open 24/7",
    specialty: "General Medicine"
  },
  {
    name: "District Hospital",
    distance: "15.7 km",
    address: "Hospital Road, District HQ",
    status: "Open 24/7",
    specialty: "Emergency & Surgery"
  },
  {
    name: "Community Health Center",
    distance: "8.2 km",
    address: "Block Office Road",
    status: "Open 8 AM - 8 PM",
    specialty: "Maternal & Child Health"
  }
];

const EmergencySection = () => {
  return (
    <section className="py-20 bg-health-emergency/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-health-emergency" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Emergency Help
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quick access to emergency services, nearby hospitals, and healthcare providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Emergency Contacts */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Phone className="h-6 w-6 text-health-emergency" />
              Emergency Contacts
            </h3>
            
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-l-4 border-l-health-emergency">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {contact.type === 'ambulance' && <Ambulance className="h-5 w-5 text-health-emergency" />}
                        {contact.type === 'emergency' && <AlertTriangle className="h-5 w-5 text-health-emergency" />}
                        {contact.type === 'mental' && <Heart className="h-5 w-5 text-health-emergency" />}
                        {contact.name}
                      </CardTitle>
                      <Button 
                        size="sm"
                        className="bg-health-emergency hover:bg-health-emergency/80"
                        onClick={() => window.open(`tel:${contact.number}`)}
                      >
                        Call {contact.number}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{contact.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nearby Healthcare Services */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Nearby Healthcare Services
            </h3>
            
            <div className="space-y-4">
              {nearbyServices.map((service, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <MapPin className="h-4 w-4" />
                        {service.distance}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span>{service.address}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {service.status}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Specialty: {service.specialty}
                      </span>
                      <Button variant="outline" size="sm">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-health-info/10 rounded-lg border border-health-info/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-health-info" />
                <span className="font-semibold text-health-info">Location Services</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable location access to find the nearest healthcare facilities and get accurate directions.
              </p>
              <Button variant="outline" className="mt-3 text-health-info border-health-info">
                Enable Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;