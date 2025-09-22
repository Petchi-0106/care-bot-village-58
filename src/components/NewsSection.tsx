import { useState, useEffect } from "react";
import { Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const newsArticles = [
  {
    id: 1,
    title: "New Vaccination Drive Launched for Rural Areas",
    excerpt: "Government announces comprehensive vaccination program targeting remote communities with mobile health units.",
    category: "Vaccination",
    date: "2 hours ago",
    priority: "high"
  },
  {
    id: 2,
    title: "Seasonal Flu Prevention: What You Need to Know",
    excerpt: "Expert recommendations for preventing seasonal influenza, including vaccination schedules and hygiene practices.",
    category: "Prevention",
    date: "6 hours ago",
    priority: "medium"
  },
  {
    id: 3,
    title: "Dengue Alert: Increased Cases in Monsoon Season",
    excerpt: "Health officials report surge in dengue cases. Learn about symptoms, prevention, and when to seek medical help.",
    category: "Disease Alert",
    date: "1 day ago",
    priority: "high"
  },
  {
    id: 4,
    title: "Mental Health Awareness in Rural Communities",
    excerpt: "Breaking the stigma around mental health and providing accessible resources for rural populations.",
    category: "Mental Health",
    date: "2 days ago",
    priority: "medium"
  },
  {
    id: 5,
    title: "Nutrition Guidelines for Children Under 5",
    excerpt: "Updated nutritional recommendations to combat malnutrition and support healthy development in young children.",
    category: "Nutrition",
    date: "3 days ago",
    priority: "low"
  }
];

const NewsSection = () => {
  const [healthAlerts, setHealthAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthAlerts();
  }, []);

  const fetchHealthAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('health_alerts')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setHealthAlerts(data || []);
    } catch (error) {
      console.error('Error fetching health alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-health-emergency text-white';
      case 'high': return 'bg-health-emergency text-white';
      case 'medium': return 'bg-health-warning text-white';
      default: return 'bg-health-info text-white';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'epidemic': return 'bg-red-500 text-white';
      case 'vaccination_drive': return 'bg-blue-500 text-white';
      case 'health_advisory': return 'bg-green-500 text-white';
      case 'emergency': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading health news...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Health News & Awareness
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest health alerts, medical updates, and disease awareness information
          </p>
        </div>

        {/* Featured article */}
        {healthAlerts.length > 0 && (
          <div className="mb-12">
            <Card className="border-0 shadow-healthcare bg-gradient-hero">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getAlertTypeColor(healthAlerts[0].alert_type)}>
                      {healthAlerts[0].alert_type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(healthAlerts[0].severity)}>
                      {healthAlerts[0].severity}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatTimeAgo(healthAlerts[0].published_at)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    Latest Alert
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{healthAlerts[0].title}</CardTitle>
                <CardDescription className="text-lg">
                  {healthAlerts[0].content}
                </CardDescription>
                {healthAlerts[0].location_specific && healthAlerts[0].location_specific.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium">Locations:</span>
                    <div className="flex gap-1 flex-wrap">
                      {healthAlerts[0].location_specific.map((location: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button className="bg-primary hover:bg-primary-dark">
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {healthAlerts.length > 1 ? (
            healthAlerts.slice(1).map((alert) => (
              <Card key={alert.id} className="border-0 shadow-card hover:shadow-healthcare transition-smooth hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getAlertTypeColor(alert.alert_type)}>
                      {alert.alert_type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatTimeAgo(alert.published_at)}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{alert.title}</CardTitle>
                  <CardDescription>
                    {alert.content.length > 150 ? `${alert.content.substring(0, 150)}...` : alert.content}
                  </CardDescription>
                  {alert.location_specific && alert.location_specific.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {alert.location_specific.slice(0, 3).map((location: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                      {alert.location_specific.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{alert.location_specific.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-primary hover:text-primary-dark p-0">
                    Read more
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-card col-span-full">
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Health Alerts</h3>
                <p className="text-muted-foreground">Check back later for the latest health news and alerts.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white px-8"
          >
            View All Health News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
