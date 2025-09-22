import { Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-health-emergency text-white';
      case 'medium': return 'bg-health-warning text-white';
      default: return 'bg-health-info text-white';
    }
  };

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
        <div className="mb-12">
          <Card className="border-0 shadow-healthcare bg-gradient-hero">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(newsArticles[0].priority)}>
                    {newsArticles[0].category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {newsArticles[0].date}
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Featured
                </Badge>
              </div>
              <CardTitle className="text-2xl">{newsArticles[0].title}</CardTitle>
              <CardDescription className="text-lg">
                {newsArticles[0].excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-primary hover:bg-primary-dark">
                Read Full Article
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Other articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {newsArticles.slice(1).map((article) => (
            <Card key={article.id} className="border-0 shadow-card hover:shadow-healthcare transition-smooth hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getPriorityColor(article.priority)}>
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {article.date}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                <CardDescription>
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-primary hover:text-primary-dark p-0">
                  Read more
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
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
