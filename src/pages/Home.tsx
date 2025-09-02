import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Calendar, Users, Zap, Shield, Globe, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-ai-scheduling.jpg";
import aiAssistant from "@/assets/ai-assistant.jpg";
import cambodianSchool from "@/assets/cambodian-school.jpg";

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI-Powered Academic Scheduling" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/30">
            🇰🇭 Built for Cambodia
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">AI-Powered Academic</span>
            <span className="block bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Scheduling
            </span>
            <span className="block text-3xl md:text-4xl mt-4 font-khmer">
              កាលវិភាគសិក្សាដោយ AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Smart timetable optimization with bilingual support for Cambodian schools and universities. 
            Detect conflicts automatically and save hours of scheduling work.
          </p>
          
          <p className="text-lg mb-12 font-khmer text-white/80 max-w-2xl mx-auto">
            ការបង្កើតកាលវិភាគឆ្លាតវៃ ជាមួយនឹងការគាំទ្រភាសាទាំងពីរ សម្រាប់សាលារៀន និងសាកលវិទ្យាល័យកម្ពុជា
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Request Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Watch Video
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">500+</div>
              <div className="text-sm text-white/70">Schools Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">99.9%</div>
              <div className="text-sm text-white/70">Conflict Detection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">80%</div>
              <div className="text-sm text-white/70">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">24/7</div>
              <div className="text-sm text-white/70">Support</div>
            </div>
          </div>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-8 w-12 h-12 bg-primary/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Core Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Why Choose Caso Schedule Pro?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets Cambodian educational needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow ai-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Optimization</h3>
                <p className="text-muted-foreground">
                  Smart algorithms automatically detect conflicts and suggest optimal scheduling solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bilingual Interface</h3>
                <p className="text-muted-foreground">
                  Full Khmer and English support with proper font rendering for Cambodian educators.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow ai-accent-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Tenant Security</h3>
                <p className="text-muted-foreground">
                  Each institution has isolated data with admin-controlled access management.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conflict Detection</h3>
                <p className="text-muted-foreground">
                  Real-time alerts prevent teacher, room, and resource scheduling conflicts.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Structured permissions for Admins, Coordinators, and Teachers with clear workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow ai-accent-glow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Optimization</h3>
                <p className="text-muted-foreground">
                  Generate complete timetables in seconds, not hours. Save 80% of scheduling time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                AI Technology
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                Meet Your AI Scheduling Assistant
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our advanced AI understands the complex requirements of academic scheduling and helps you create conflict-free timetables effortlessly.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Analyzes teacher availability and preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Optimizes room and resource allocation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Adapts to last-minute changes instantly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Supports Khmer academic calendar systems</span>
                </div>
              </div>

              <Button variant="hero" size="lg">
                See AI in Action
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-ai rounded-2xl opacity-20 blur-3xl"></div>
              <img 
                src={aiAssistant} 
                alt="AI Scheduling Assistant" 
                className="relative z-10 w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cambodia Focus Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={cambodianSchool} 
                alt="Modern Cambodian School" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">🇰🇭 Made for Cambodia</h3>
                <p className="text-white/90">Supporting local education transformation</p>
              </div>
            </div>

            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Local Focus
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                Built for Cambodian Educators
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                We understand the unique challenges of academic scheduling in Cambodia and have designed our platform specifically for local schools and universities.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">ខ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Native Khmer Support</h4>
                    <p className="text-muted-foreground">Full interface translation with proper Khmer typography and cultural considerations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Local Academic Calendar</h4>
                    <p className="text-muted-foreground">Supports Cambodian academic year structure and traditional holiday scheduling.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Local Support Team</h4>
                    <p className="text-muted-foreground">Dedicated Khmer-speaking support team available during local business hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/95"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of Cambodian schools already using AI-powered scheduling
          </p>
          <p className="text-lg mb-12 font-khmer text-white/80">
            ចូលរួមជាមួយសាលារៀនកម្ពុជារាប់រយ ដែលកំពុងប្រើប្រាស់ការកាលវិភាគដោយ AI
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4">
              Request Free Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-accent/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/20 rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </section>
    </div>
  );
};

export default Home;