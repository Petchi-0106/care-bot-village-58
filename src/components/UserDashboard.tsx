import { useState } from "react";
import { 
  User, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Activity,
  Heart,
  Pill,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const healthHistory = [
  {
    id: 1,
    date: "2024-01-15",
    type: "Vaccination",
    description: "COVID-19 Booster Shot",
    provider: "Primary Health Center",
    status: "completed"
  },
  {
    id: 2,
    date: "2024-01-10",
    type: "Consultation",
    description: "General Health Checkup",
    provider: "Dr. Priya Sharma",
    status: "completed"
  },
  {
    id: 3,
    date: "2023-12-20",
    type: "Prescription",
    description: "Antibiotics for Respiratory Infection",
    provider: "District Hospital",
    status: "completed"
  }
];

const upcomingReminders = [
  {
    id: 1,
    title: "Annual Health Checkup",
    date: "2024-02-15",
    time: "10:00 AM",
    type: "appointment",
    priority: "medium"
  },
  {
    id: 2,
    title: "Flu Vaccination",
    date: "2024-03-01",
    time: "All Day",
    type: "vaccination",
    priority: "high"
  },
  {
    id: 3,
    title: "Blood Pressure Medication",
    date: "2024-01-25",
    time: "8:00 AM & 8:00 PM",
    type: "medication",
    priority: "high"
  },
  {
    id: 4,
    title: "Diabetes Follow-up",
    date: "2024-02-28",
    time: "2:00 PM",
    type: "appointment",
    priority: "medium"
  }
];

const healthMetrics = [
  {
    name: "Vaccination Coverage",
    value: 85,
    status: "good",
    lastUpdated: "2 days ago"
  },
  {
    name: "Health Score",
    value: 78,
    status: "good",
    lastUpdated: "1 week ago"
  },
  {
    name: "Medication Adherence",
    value: 92,
    status: "excellent",
    lastUpdated: "3 days ago"
  }
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("history");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-health-success text-white';
      case 'pending': return 'bg-health-warning text-white';
      case 'cancelled': return 'bg-health-emergency text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-health-emergency text-health-emergency';
      case 'medium': return 'border-health-warning text-health-warning';
      default: return 'border-health-info text-health-info';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-success';
      case 'good': return 'text-health-info';
      case 'fair': return 'text-health-warning';
      default: return 'text-health-emergency';
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Your Health Dashboard
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your health history, manage reminders, and access emergency help
          </p>
        </div>

        {/* Health Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {metric.name}
                  <Activity className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl font-bold">{metric.value}%</div>
                  <Badge className={getMetricColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <Progress value={metric.value} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Last updated: {metric.lastUpdated}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Health History
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency Help
            </TabsTrigger>
          </TabsList>

          {/* Health History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {healthHistory.map((record) => (
                <Card key={record.id} className="border-0 shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {record.type === 'Vaccination' && <Pill className="h-5 w-5 text-secondary" />}
                        {record.type === 'Consultation' && <Heart className="h-5 w-5 text-primary" />}
                        {record.type === 'Prescription' && <FileText className="h-5 w-5 text-accent" />}
                        <div>
                          <CardTitle className="text-lg">{record.description}</CardTitle>
                          <CardDescription>{record.provider}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{record.date}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View Complete History
              </Button>
            </div>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <div className="grid gap-4">
              {upcomingReminders.map((reminder) => (
                <Card key={reminder.id} className={`border-l-4 ${getPriorityColor(reminder.priority)} border-l-current`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {reminder.type === 'vaccination' && <Pill className="h-5 w-5 text-secondary" />}
                        {reminder.type === 'appointment' && <Calendar className="h-5 w-5 text-primary" />}
                        {reminder.type === 'medication' && <Clock className="h-5 w-5 text-accent" />}
                        <div>
                          <CardTitle className="text-lg">{reminder.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {reminder.date} at {reminder.time}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                        <Button size="sm" variant="ghost">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button className="bg-primary hover:bg-primary-dark">
                <Bell className="mr-2 h-4 w-4" />
                Set New Reminder
              </Button>
            </div>
          </TabsContent>

          {/* Emergency Help Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-health-emergency">
                <CardHeader>
                  <CardTitle className="text-xl text-health-emergency flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Emergency Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-health-emergency hover:bg-health-emergency/80 text-white"
                    onClick={() => window.open('tel:108')}
                  >
                    Call Emergency Services (108)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-health-emergency text-health-emergency hover:bg-health-emergency hover:text-white"
                    onClick={() => window.open('tel:1091')}
                  >
                    Women Helpline (1091)
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <Heart className="h-6 w-6" />
                    Health Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Contact Family Doctor
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Find Nearest Hospital
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Pill className="h-6 w-6" />
                    <span className="text-sm">Medications</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Appointments</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Reports</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">Health Tips</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UserDashboard;