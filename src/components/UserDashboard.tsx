import { useState, useEffect } from "react";
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
  XCircle,
  LogIn
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newRecord, setNewRecord] = useState({ condition_name: '', diagnosis_date: '', medications: '', allergies: '', notes: '' });
  const [newVaccination, setNewVaccination] = useState({ vaccine_name: '', scheduled_date: '', location: '' });
  const [newAppointment, setNewAppointment] = useState({ doctor_name: '', hospital_name: '', appointment_date: '', purpose: '' });
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch health records
      const { data: records } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      // Fetch vaccination schedules
      const { data: vaccines } = await supabase
        .from('vaccination_schedules')
        .select('*')
        .eq('user_id', user!.id)
        .order('scheduled_date', { ascending: true });

      // Fetch appointments
      const { data: apps } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user!.id)
        .order('appointment_date', { ascending: true });

      setHealthRecords(records || []);
      setVaccinations(vaccines || []);
      setAppointments(apps || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your health data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHealthRecord = async () => {
    if (!user || !newRecord.condition_name) return;
    
    try {
      const { error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          condition_name: newRecord.condition_name,
          diagnosis_date: newRecord.diagnosis_date || null,
          current_medications: newRecord.medications ? newRecord.medications.split(',').map(m => m.trim()) : [],
          allergies: newRecord.allergies ? newRecord.allergies.split(',').map(a => a.trim()) : [],
          notes: newRecord.notes || null
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Health record added successfully.",
      });
      
      setNewRecord({ condition_name: '', diagnosis_date: '', medications: '', allergies: '', notes: '' });
      setShowAddRecord(false);
      fetchUserData();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Error",
        description: "Failed to add health record.",
        variant: "destructive",
      });
    }
  };

  const addVaccination = async () => {
    if (!user || !newVaccination.vaccine_name || !newVaccination.scheduled_date) return;
    
    try {
      const { error } = await supabase
        .from('vaccination_schedules')
        .insert({
          user_id: user.id,
          vaccine_name: newVaccination.vaccine_name,
          scheduled_date: newVaccination.scheduled_date,
          location: newVaccination.location || null,
          status: 'scheduled'
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Vaccination scheduled successfully.",
      });
      
      setNewVaccination({ vaccine_name: '', scheduled_date: '', location: '' });
      setShowAddVaccination(false);
      fetchUserData();
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast({
        title: "Error",
        description: "Failed to schedule vaccination.",
        variant: "destructive",
      });
    }
  };

  const addAppointment = async () => {
    if (!user || !newAppointment.doctor_name || !newAppointment.hospital_name || !newAppointment.appointment_date) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_name: newAppointment.doctor_name,
          hospital_name: newAppointment.hospital_name,
          appointment_date: newAppointment.appointment_date,
          purpose: newAppointment.purpose || null,
          status: 'scheduled'
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Appointment scheduled successfully.",
      });
      
      setNewAppointment({ doctor_name: '', hospital_name: '', appointment_date: '', purpose: '' });
      setShowAddAppointment(false);
      fetchUserData();
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment.",
        variant: "destructive",
      });
    }
  };

  const markVaccinationComplete = async (vaccinationId: string) => {
    try {
      const { error } = await supabase
        .from('vaccination_schedules')
        .update({ 
          status: 'completed',
          administered_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', vaccinationId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Vaccination marked as completed.",
      });
      
      fetchUserData();
    } catch (error) {
      console.error('Error updating vaccination:', error);
      toast({
        title: "Error",
        description: "Failed to update vaccination status.",
        variant: "destructive",
      });
    }
  };

  const markAppointmentComplete = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Appointment marked as completed.",
      });
      
      fetchUserData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    }
  };

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

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your health dashboard...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <User className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Your Health Dashboard</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign in to access your personalized health records, vaccination schedules, and reminders.
            </p>
            <Button onClick={() => navigate('/auth')} size="lg" className="bg-primary hover:bg-primary-dark">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Access Dashboard
            </Button>
          </div>
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
              {healthRecords.length > 0 ? (
                healthRecords.map((record) => (
                  <Card key={record.id} className="border-0 shadow-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{record.condition_name}</CardTitle>
                            <CardDescription>
                              {record.diagnosis_date ? `Diagnosed: ${new Date(record.diagnosis_date).toLocaleDateString()}` : 'No date specified'}
                            </CardDescription>
                            {record.current_medications && record.current_medications.length > 0 && (
                              <CardDescription className="mt-1">
                                Medications: {record.current_medications.join(', ')}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-card">
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Health Records</h3>
                    <p className="text-muted-foreground mb-4">Start building your health history by adding your medical records.</p>
                    <Button onClick={() => setShowAddRecord(true)}>Add Health Record</Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {showAddRecord && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Add New Health Record</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Condition Name *</label>
                    <Input
                      value={newRecord.condition_name}
                      onChange={(e) => setNewRecord({...newRecord, condition_name: e.target.value})}
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
                    <Input
                      type="date"
                      value={newRecord.diagnosis_date}
                      onChange={(e) => setNewRecord({...newRecord, diagnosis_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Medications</label>
                    <Input
                      value={newRecord.medications}
                      onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
                      placeholder="Separate multiple medications with commas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Allergies</label>
                    <Input
                      value={newRecord.allergies}
                      onChange={(e) => setNewRecord({...newRecord, allergies: e.target.value})}
                      placeholder="Separate multiple allergies with commas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <Input
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                      placeholder="Additional notes"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addHealthRecord}>Add Record</Button>
                    <Button variant="outline" onClick={() => setShowAddRecord(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="text-center">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => setShowAddRecord(true)}
              >
                Add New Record
              </Button>
            </div>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <div className="grid gap-4">
              {vaccinations.length > 0 || appointments.length > 0 ? (
                <>
                  {vaccinations.map((vaccination) => (
                    <Card key={vaccination.id} className="border-l-4 border-l-secondary border-l-current">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Pill className="h-5 w-5 text-secondary" />
                            <div>
                              <CardTitle className="text-lg">{vaccination.vaccine_name}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(vaccination.scheduled_date).toLocaleDateString()}
                              </CardDescription>
                              <Badge className={vaccination.status === 'completed' ? 'bg-green-500' : vaccination.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'}>
                                {vaccination.status}
                              </Badge>
                            </div>
                          </div>
                          {vaccination.status === 'scheduled' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <CheckCircle 
                                  className="h-4 w-4 mr-1" 
                                  onClick={() => markVaccinationComplete(vaccination.id)}
                                />
                                Mark Done
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border-l-4 border-l-primary border-l-current">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{appointment.purpose || 'Medical Appointment'}</CardTitle>
                              <CardDescription>
                                {appointment.doctor_name} at {appointment.hospital_name}
                              </CardDescription>
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(appointment.appointment_date).toLocaleString()}
                              </CardDescription>
                              <Badge className={appointment.status === 'completed' ? 'bg-green-500' : appointment.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'}>
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                          {appointment.status === 'scheduled' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <CheckCircle 
                                  className="h-4 w-4 mr-1"
                                  onClick={() => markAppointmentComplete(appointment.id)}
                                />
                                Mark Done
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </>
              ) : (
                <Card className="border-0 shadow-card">
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Upcoming Reminders</h3>
                    <p className="text-muted-foreground mb-4">Set up reminders for vaccinations, appointments, and medications.</p>
                    <Button onClick={() => setShowAddVaccination(true)}>Create Reminder</Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {showAddVaccination && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Schedule Vaccination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vaccine Name *</label>
                    <Input
                      value={newVaccination.vaccine_name}
                      onChange={(e) => setNewVaccination({...newVaccination, vaccine_name: e.target.value})}
                      placeholder="e.g., COVID-19, Flu Shot"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Scheduled Date *</label>
                    <Input
                      type="date"
                      value={newVaccination.scheduled_date}
                      onChange={(e) => setNewVaccination({...newVaccination, scheduled_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={newVaccination.location}
                      onChange={(e) => setNewVaccination({...newVaccination, location: e.target.value})}
                      placeholder="Hospital or clinic name"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addVaccination}>Schedule</Button>
                    <Button variant="outline" onClick={() => setShowAddVaccination(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {showAddAppointment && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Schedule Appointment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor Name *</label>
                    <Input
                      value={newAppointment.doctor_name}
                      onChange={(e) => setNewAppointment({...newAppointment, doctor_name: e.target.value})}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hospital/Clinic *</label>
                    <Input
                      value={newAppointment.hospital_name}
                      onChange={(e) => setNewAppointment({...newAppointment, hospital_name: e.target.value})}
                      placeholder="City Hospital"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Appointment Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={newAppointment.appointment_date}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <Input
                      value={newAppointment.purpose}
                      onChange={(e) => setNewAppointment({...newAppointment, purpose: e.target.value})}
                      placeholder="Routine checkup, consultation, etc."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addAppointment}>Schedule</Button>
                    <Button variant="outline" onClick={() => setShowAddAppointment(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="text-center">
              <Button 
                className="bg-primary hover:bg-primary-dark mr-2"
                onClick={() => setShowAddVaccination(true)}
              >
                <Bell className="mr-2 h-4 w-4" />
                Schedule Vaccination
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAddAppointment(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
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
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => setShowAddAppointment(true)}
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Appointments</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={() => setShowAddRecord(true)}
                  >
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