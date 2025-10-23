import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Mail, Phone, MapPin, Clock, 
  Send, MessageCircle, Calendar,
  Headphones, Users, Building
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    subject: "",
    message: "",
    inquiryType: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        institution: "",
        subject: "",
        message: "",
        inquiryType: ""
      });
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} Requested`,
      description: "We'll contact you shortly to arrange this.",
    });
  };

  return (
    <div className={`min-h-screen pt-16 ${language === 'km' ? 'font-khmer' : ''}`}>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            {t('contact.hero.badge')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center space-x-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  <span>Support Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.support.email')}</h4>
                    <p className="text-muted-foreground">support@casoschedule.com</p>
                    <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.support.phone')}</h4>
                    <p className="text-muted-foreground">+855 12 345 678</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 8AM-6PM (ICT)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.support.location')}</h4>
                    <p className="text-muted-foreground">Phnom Penh, Cambodia</p>
                    <p className="text-sm text-muted-foreground">Available for on-site demos</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.support.hours')}</h4>
                    <p className="text-muted-foreground">Monday - Friday</p>
                    <p className="text-sm text-muted-foreground">8:00 AM - 6:00 PM (ICT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("Demo")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction("Training")}>
                  <Users className="w-4 h-4 mr-2" />
                  Request Training
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/purchase-admin">
                    <Building className="w-4 h-4 mr-2" />
                    Get Pricing
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Khmer Contact Info */}
            <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-accent">ព័ត៌មានទំនាក់ទំនង</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2 font-khmer">
                <p><strong>អ៊ីម៉ែល:</strong> support@casoschedule.com</p>
                <p><strong>ទូរសព្ទ:</strong> +855 12 345 678</p>
                <p><strong>ម៉ោងធ្វើការ:</strong> ច័ន្ទ - សុក្រ ម៉ោង ៨:០០ - ១៨:០០</p>
                <p className="text-sm text-muted-foreground">
                  យើងនិយាយភាសាខ្មែរ និងអាចផ្តល់ការគាំទ្រជាភាសាខ្មែរ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{t('contact.form.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t('contact.form.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@school.edu"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="institution">{t('contact.form.institution')}</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      placeholder="Royal University of Fine Arts"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inquiry-type">Inquiry Type</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Request Demo</SelectItem>
                        <SelectItem value="pricing">Pricing Information</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="training">Training & Onboarding</SelectItem>
                        <SelectItem value="general">General Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">{t('contact.form.subject')} *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="What would you like to discuss?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.form.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us more about your needs, institution size, current challenges, or any specific questions you have..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Frequently Asked
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to help you get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-3">How quickly can we get started?</h3>
                <p className="text-muted-foreground">
                  Most institutions can be up and running within 1-2 weeks. This includes setup, 
                  data migration, and basic training for your team.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-3">Do you provide training?</h3>
                <p className="text-muted-foreground">
                  Yes! We provide comprehensive training in both English and Khmer, including 
                  on-site sessions and ongoing support materials.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-3">What's included in the demo?</h3>
                <p className="text-muted-foreground">
                  Our demo includes a full walkthrough of features, sample data specific to your 
                  institution type, and time for Q&A with our team.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-3">Is there ongoing support?</h3>
                <p className="text-muted-foreground">
                  Absolutely! We provide 24/7 technical support, regular updates, and dedicated 
                  account management for all our clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;