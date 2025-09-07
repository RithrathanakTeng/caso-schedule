import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Shield, Calendar, Users, 
  ArrowRight, CheckCircle, Settings,
  Eye, Edit, Plus
} from "lucide-react";

const UserRoles = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            User Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Structured Role-Based Access
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Clear permissions and workflows for Admins, Coordinators, and Teachers 
            ensure smooth operations while maintaining security and accountability.
          </p>
        </div>
      </section>

      {/* Role Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Role */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-primary/20">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Administrator</h3>
                <p className="text-muted-foreground mb-6">
                  Complete system oversight with full access to all features and settings
                </p>
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Institution management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">User role assignment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">System configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Analytics & reports</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinator Role */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-secondary/20">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Calendar className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Coordinator</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule creation and management with oversight of academic operations
                </p>
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Schedule creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Course management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Teacher coordination</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Conflict resolution</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Role */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-accent/20">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Teacher</h3>
                <p className="text-muted-foreground mb-6">
                  Personal schedule management with availability setting and profile control
                </p>
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">View personal schedule</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Set availability</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Update profile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Receive notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Permission Matrix */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Permission Matrix</h2>
            <p className="text-xl text-muted-foreground">
              Clear understanding of what each role can do
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Admin</th>
                  <th className="text-center py-3 px-4">Coordinator</th>
                  <th className="text-center py-3 px-4">Teacher</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">View Institution Settings</td>
                  <td className="text-center py-3 px-4"><Eye className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Eye className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Eye className="w-4 h-4 text-success mx-auto" /></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Edit Institution Settings</td>
                  <td className="text-center py-3 px-4"><Edit className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Create Users</td>
                  <td className="text-center py-3 px-4"><Plus className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Create Schedules</td>
                  <td className="text-center py-3 px-4"><Plus className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Plus className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4">-</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">View All Schedules</td>
                  <td className="text-center py-3 px-4"><Eye className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Eye className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4">Own Only</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Manage Teacher Availability</td>
                  <td className="text-center py-3 px-4"><Edit className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Edit className="w-4 h-4 text-success mx-auto" /></td>
                  <td className="text-center py-3 px-4">Own Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/95"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">Set up your institution with proper role management</p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/purchase-admin">
              Get Admin Access <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserRoles;