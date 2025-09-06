import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, Upload, Brain, CheckCircle, 
  ArrowRight, Play, Users, Calendar,
  Clock, Target, Zap, Monitor
} from "lucide-react";
import aiAssistant from "@/assets/ai-assistant.jpg";

const HowItWorks = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            From Setup to Success in Simple Steps
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how our AI-powered platform transforms complex scheduling into a simple, 
            automated process that saves time and eliminates conflicts.
          </p>
          <div className="text-lg font-khmer text-muted-foreground">
            សិក្សាពីរបៀបដែលប្រព័ន្ធ AI របស់យើង បំប្លែងការបង្កើតកាលវិភាគស្មុគស្មាញ ទៅជាដំណើរការសាមញ្ញ និងស្វ័យប្រវត្តិ
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Four Steps to Perfect Schedules</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes schedule creation effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow relative">
              <CardContent className="p-0">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Setup & Configuration</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Configure your institution, add courses, subjects, and define your scheduling parameters.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Institution details</li>
                  <li>• Academic structure</li>
                  <li>• Room management</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow relative">
              <CardContent className="p-0">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
                  2
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Add Users & Availability</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Add teachers, coordinators, and set their availability preferences and constraints.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Teacher profiles</li>
                  <li>• Availability windows</li>
                  <li>• Preferences</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow relative ai-glow">
              <CardContent className="p-0">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
                  3
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">AI Generation</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our AI analyzes all constraints and generates optimal schedules in seconds.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Conflict detection</li>
                  <li>• Resource optimization</li>
                  <li>• Instant generation</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow relative">
              <CardContent className="p-0">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Review & Deploy</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Review the generated schedule, make adjustments if needed, and deploy to your institution.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Quality review</li>
                  <li>• Manual adjustments</li>
                  <li>• Live deployment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Behind the Scenes
            </Badge>
            <h2 className="text-3xl font-bold mb-4">How Our AI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding the intelligent process that creates perfect schedules
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Intelligent Analysis</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Constraint Analysis</h4>
                    <p className="text-muted-foreground">
                      AI analyzes all scheduling constraints including teacher availability, 
                      room capacity, subject requirements, and time preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Optimization Algorithm</h4>
                    <p className="text-muted-foreground">
                      Advanced algorithms find the optimal arrangement that minimizes conflicts 
                      and maximizes resource utilization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Conflict Prevention</h4>
                    <p className="text-muted-foreground">
                      Real-time validation ensures no scheduling conflicts while 
                      maintaining educational quality standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-ai rounded-2xl opacity-20 blur-3xl"></div>
              <img 
                src={aiAssistant} 
                alt="AI Scheduling Process" 
                className="relative z-10 w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Key Benefits
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why Our Process Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The advantages of our intelligent scheduling approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Time Efficiency</h3>
                <p className="text-muted-foreground mb-4">
                  Reduce scheduling time from days to minutes with automated generation.
                </p>
                <div className="flex items-center text-sm text-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  80% Time Reduction
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conflict-Free</h3>
                <p className="text-muted-foreground mb-4">
                  Eliminate double bookings and resource conflicts completely.
                </p>
                <div className="flex items-center text-sm text-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  99.9% Accuracy
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Updates</h3>
                <p className="text-muted-foreground mb-4">
                  Make changes instantly with automatic conflict detection.
                </p>
                <div className="flex items-center text-sm text-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Real-time Updates
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Workflow */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Role-Based Workflow
            </Badge>
            <h2 className="text-3xl font-bold mb-4">How Different Users Interact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each role has specific responsibilities and capabilities
            </p>
          </div>

          <div className="space-y-12">
            {/* Admin Workflow */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Administrator Workflow</h3>
                    <p className="text-muted-foreground">Complete system management and oversight</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Setup Phase</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Configure institution</li>
                      <li>• Set up courses and subjects</li>
                      <li>• Define rooms and resources</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">User Management</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Add coordinators and teachers</li>
                      <li>• Assign roles and permissions</li>
                      <li>• Monitor system usage</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Oversight</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• View analytics and reports</li>
                      <li>• Approve major changes</li>
                      <li>• System maintenance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinator Workflow */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Coordinator Workflow</h3>
                    <p className="text-muted-foreground">Schedule creation and management</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Preparation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Gather requirements</li>
                      <li>• Check teacher availability</li>
                      <li>• Review course needs</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Generation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use AI to generate schedules</li>
                      <li>• Review and adjust</li>
                      <li>• Resolve conflicts</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Publishing</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Final review</li>
                      <li>• Publish to teachers</li>
                      <li>• Monitor for issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Workflow */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Teacher Workflow</h3>
                    <p className="text-muted-foreground">Personal schedule management</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Availability</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Set available time slots</li>
                      <li>• Update preferences</li>
                      <li>• Mark unavailable periods</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Schedule View</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• View personal schedule</li>
                      <li>• Check class details</li>
                      <li>• Receive notifications</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Communication</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Report schedule issues</li>
                      <li>• Request changes</li>
                      <li>• Update profile info</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/95"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to See It in Action?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Experience our intelligent scheduling process with a personalized demo
          </p>
          <p className="text-lg mb-12 font-khmer text-white/80">
            សាកល្បងមើលដំណើរការបង្កើតកាលវិភាគឆ្លាតវៃរបស់យើង តាមរយៈការបង្ហាញផ្ទាល់ខ្លួន
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo Video
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Request Live Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;