import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Heart, Target, Users, Globe, 
  ArrowRight, CheckCircle, Star,
  Award, Lightbulb, BookOpen
} from "lucide-react";
import cambodianSchool from "@/assets/cambodian-school.jpg";

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            About Caso Schedule Pro
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transforming Education Through Technology
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're on a mission to revolutionize academic scheduling in Cambodia by combining 
            artificial intelligence with deep understanding of local educational needs.
          </p>
          <div className="text-lg mb-8 font-khmer text-muted-foreground">
            យើងមានបេសកកម្មដើម្បីបំប្លែងការបង្កើតកាលវិភាគសិក្សានៅកម្ពុជា ដោយការផ្សំបញ្ញាសិប្បនិម្មិត្ត ជាមួយនឹងការយល់ដឹងស៊ីជម្រៅអំពីតម្រូវការអប់រំក្នុងស្រុក
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Empowering Cambodian Educators
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that educators should focus on teaching, not struggling with complex scheduling. 
                Our AI-powered platform eliminates the administrative burden while respecting the unique 
                cultural and linguistic needs of Cambodian institutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Reduce administrative workload by 80%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Support bilingual education environment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Enable focus on quality education</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={cambodianSchool} 
                alt="Modern Cambodian Education" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-2">🇰🇭 Built for Cambodia</h3>
                <p className="text-white/90">Understanding local educational culture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What Drives Us Forward</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values shape every decision we make and every feature we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Education First</h3>
                <p className="text-muted-foreground">
                  Every feature is designed with educators and students in mind. 
                  We prioritize user experience that enhances the learning environment.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Globe className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Cultural Respect</h3>
                <p className="text-muted-foreground">
                  We honor Cambodian culture and language, ensuring our platform 
                  feels natural and respectful to local users.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Lightbulb className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  We leverage cutting-edge AI technology to solve real problems, 
                  always pushing the boundaries of what's possible.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Simplicity</h3>
                <p className="text-muted-foreground">
                  Complex problems deserve simple solutions. We make powerful 
                  technology accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-muted-foreground">
                  We build not just software, but relationships with the educational 
                  community we serve.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for the highest quality in everything we do, 
                  from code to customer support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Our Story
            </Badge>
            <h2 className="text-3xl font-bold mb-6">How It All Started</h2>
          </div>

          <div className="space-y-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">The Problem We Saw</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Working closely with Cambodian educational institutions, we witnessed administrators 
                      spending countless hours manually creating schedules, often resulting in conflicts 
                      and suboptimal resource utilization. The bilingual nature of many institutions 
                      added another layer of complexity that existing solutions couldn't address.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">The Vision</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      We envisioned a future where AI could handle the complexity of academic scheduling, 
                      allowing educators to focus on what they do best - teaching. Our platform would 
                      be specifically designed for the Cambodian context, supporting both Khmer and 
                      English while understanding local educational practices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Today & Tomorrow</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Today, Caso Schedule Pro serves educational institutions across Cambodia, 
                      saving thousands of hours and eliminating scheduling conflicts. We continue 
                      to innovate, adding new features based on user feedback and advancing AI 
                      capabilities to serve our community better.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Recognition */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Recognition
          </Badge>
          <h2 className="text-3xl font-bold mb-6">Trusted by Educational Leaders</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our commitment to Cambodian education has been recognized by institutions nationwide
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Schools Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">50,000+</div>
              <div className="text-sm text-muted-foreground">Hours Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/95"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Be part of the transformation in Cambodian education
          </p>
          <p className="text-lg mb-12 font-khmer text-white/80">
            ចូលរួមជាមួយនឹងបេសកកម្មរបស់យើង ក្នុងការបំប្លែងការអប់រំកម្ពុជា
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/auth">
                Request Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;