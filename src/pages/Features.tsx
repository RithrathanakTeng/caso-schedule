import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, Calendar, Users, Zap, Shield, Globe, 
  CheckCircle, Clock, BarChart3, Settings, 
  Monitor, Smartphone, Database, Cloud,
  ArrowRight, Star
} from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Complete Feature Set
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Modern Education
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how our AI-powered scheduling platform transforms academic administration with intelligent automation and seamless user experience.
          </p>
          <Button variant="hero" size="lg">
            Try Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              AI Technology
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Intelligent Scheduling Engine</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced algorithms that understand your institution's unique requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow ai-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Conflict Detection</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically identifies scheduling conflicts before they happen, preventing double-bookings and resource overlaps.
                </p>
                <div className="flex items-center text-sm text-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  99.9% Accuracy Rate
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Optimization</h3>
                <p className="text-muted-foreground mb-4">
                  Generate complete timetables in seconds with optimal resource allocation and minimal gaps.
                </p>
                <div className="flex items-center text-sm text-success">
                  <Clock className="w-4 h-4 mr-2" />
                  80% Time Saved
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow ai-accent-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Analyze patterns to suggest improvements and predict scheduling challenges before they occur.
                </p>
                <div className="flex items-center text-sm text-success">
                  <Star className="w-4 h-4 mr-2" />
                  Data-Driven Insights
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              User Management
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Role-Based Access Control</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured permissions for different user types with clear workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
                <ul className="space-y-2 text-muted-foreground text-left">
                  <li>• Institution management</li>
                  <li>• User role assignment</li>
                  <li>• System configuration</li>
                  <li>• Analytics and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Calendar className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Coordinator Tools</h3>
                <ul className="space-y-2 text-muted-foreground text-left">
                  <li>• Schedule creation</li>
                  <li>• Teacher availability</li>
                  <li>• Course management</li>
                  <li>• Conflict resolution</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Teacher Interface</h3>
                <ul className="space-y-2 text-muted-foreground text-left">
                  <li>• Personal schedule view</li>
                  <li>• Availability management</li>
                  <li>• Class notifications</li>
                  <li>• Profile settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Technical Excellence
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Modern Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology for performance, security, and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Monitor className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Responsive Design</h3>
                <p className="text-sm text-muted-foreground">
                  Works perfectly on desktop, tablet, and mobile devices
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Bilingual Support</h3>
                <p className="text-sm text-muted-foreground">
                  Native Khmer and English with proper font rendering
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Database className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Secure Database</h3>
                <p className="text-sm text-muted-foreground">
                  Row-level security with encrypted data storage
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Cloud className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Cloud Hosted</h3>
                <p className="text-sm text-muted-foreground">
                  Reliable uptime with automatic backups
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Traditional vs AI-Powered</h2>
            <p className="text-xl text-muted-foreground">
              See the difference our platform makes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-6 text-center">Manual Scheduling</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span>Hours of manual work</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span>Frequent conflicts</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span>Error-prone process</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span>Difficult to optimize</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-6 text-center text-primary">AI-Powered Scheduling</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Seconds to generate</span>
                  </div>
                  <div className="flex items-center space-x-3 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Automatic conflict detection</span>
                  </div>
                  <div className="flex items-center space-x-3 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>99.9% accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Optimal resource utilization</span>
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
            Ready to Experience the Future?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            See how AI can transform your scheduling workflow
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;