import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Bell,
  LogOut,
  CalendarDays,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const TeacherDashboard = () => {
  const { profile, institution, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">{institution?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                  {profile?.first_name_khmer && profile?.last_name_khmer && (
                    <span className="block text-xs text-muted-foreground">
                      {profile.first_name_khmer} {profile.last_name_khmer}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Teacher</p>
              </div>
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Updated</div>
              <p className="text-xs text-muted-foreground">Last updated 2 days ago</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 classes per day</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">New schedule updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Your teaching schedule for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="space-y-2">
                      <h3 className="font-medium text-sm text-center pb-2 border-b">{day}</h3>
                      <div className="space-y-2 min-h-[200px]">
                        {index < 5 ? (
                          // Sample classes for weekdays
                          <>
                            <div className="p-2 bg-primary/10 rounded text-xs">
                              <div className="font-medium">Mathematics</div>
                              <div className="text-muted-foreground">9:00 - 10:30</div>
                              <div className="text-muted-foreground">Room 101</div>
                            </div>
                            {index < 3 && (
                              <div className="p-2 bg-accent/10 rounded text-xs">
                                <div className="font-medium">Physics</div>
                                <div className="text-muted-foreground">2:00 - 3:30</div>
                                <div className="text-muted-foreground">Lab 201</div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center text-muted-foreground text-xs mt-8">
                            No classes
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Preferences</CardTitle>
                <CardDescription>
                  Update your available times and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Preferred Time Slots</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>8:00 AM - 12:00 PM</span>
                          <Badge variant="secondary">Preferred</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>1:00 PM - 5:00 PM</span>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>6:00 PM - 8:00 PM</span>
                          <Badge variant="outline">Not Available</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Weekly Availability</h3>
                      <div className="space-y-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                          <div key={day} className="flex items-center justify-between p-3 border rounded">
                            <span>{day}</span>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Edit Availability
                    </Button>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Recent updates and announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Schedule Updated</h4>
                      <p className="text-sm text-muted-foreground">
                        Your Wednesday schedule has been updated. Physics class moved to 3:00 PM.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Availability Confirmed</h4>
                      <p className="text-sm text-muted-foreground">
                        Your availability preferences have been saved and applied to the new schedule.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">New Semester Planning</h4>
                      <p className="text-sm text-muted-foreground">
                        Please update your availability for the upcoming semester by Friday.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </h3>
                      {profile?.first_name_khmer && profile?.last_name_khmer && (
                        <p className="text-muted-foreground">
                          {profile.first_name_khmer} {profile.last_name_khmer}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile?.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Institution</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {institution?.name}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;