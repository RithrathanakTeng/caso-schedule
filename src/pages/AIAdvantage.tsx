import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Brain, Zap, Target, Clock, 
  ArrowRight, CheckCircle, BarChart3,
  Lightbulb, Cpu, Database
} from "lucide-react";
import aiAssistant from "@/assets/ai-assistant.jpg";

const AIAdvantage = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            AI Technology
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The AI Advantage in Academic Scheduling
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how artificial intelligence transforms complex scheduling challenges 
            into simple, automated solutions that work perfectly every time.
          </p>
        </div>
      </section>

      {/* AI vs Traditional */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                Intelligence at Work
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Beyond Human Capabilities
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI processes thousands of constraints simultaneously, finding optimal 
                solutions that would take humans weeks to calculate manually.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Processes 10,000+ scheduling combinations per second</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>99.9% conflict detection accuracy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Learns from patterns to improve over time</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-ai rounded-2xl opacity-20 blur-3xl"></div>
              <img 
                src={aiAssistant} 
                alt="AI Technology" 
                className="relative z-10 w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI Capabilities</h2>
            <p className="text-xl text-muted-foreground">
              Advanced algorithms designed for educational scheduling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow ai-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Constraint Optimization</h3>
                <p className="text-muted-foreground">
                  Simultaneously balances teacher preferences, room availability, and 
                  educational requirements to find optimal solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
                <p className="text-muted-foreground">
                  Instantly processes changes and updates schedules in real-time, 
                  maintaining consistency across all users.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow ai-accent-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  Analyzes historical data to predict scheduling challenges and 
                  suggest proactive solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conflict Prevention</h3>
                <p className="text-muted-foreground">
                  Proactively identifies potential conflicts before they occur, 
                  ensuring smooth operations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Efficiency Optimization</h3>
                <p className="text-muted-foreground">
                  Maximizes resource utilization while minimizing gaps and 
                  scheduling inefficiencies.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Adaptive Learning</h3>
                <p className="text-muted-foreground">
                  Continuously learns from scheduling patterns to improve 
                  future recommendations.
                </p>
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
            Experience AI-Powered Scheduling
          </h2>
          <p className="text-xl mb-12 text-white/90">
            See how artificial intelligence can transform your scheduling process
          </p>

          <Button variant="accent" size="lg" className="text-lg px-8 py-4" asChild>
            <Link to="/auth">
              Try AI Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AIAdvantage;