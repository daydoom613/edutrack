import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  Trophy,
  Clock,
  Target,
  Star,
  Calendar,
  Brain,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const quickStats = [
    {
      title: 'Current Level',
      value: user?.level || 1,
      icon: Star,
      color: 'text-education-purple',
      bgColor: 'bg-education-purple/10'
    },
    {
      title: 'Total Points',
      value: user?.totalPoints || 0,
      icon: Trophy,
      color: 'text-education-orange',
      bgColor: 'bg-education-orange/10'
    },
    {
      title: 'Streak Days',
      value: user?.streakDays || 0,
      icon: Target,
      color: 'text-education-green',
      bgColor: 'bg-education-green/10'
    },
    {
      title: 'Completed Tasks',
      value: '23',
      icon: ClipboardList,
      color: 'text-education-blue',
      bgColor: 'bg-education-blue/10'
    }
  ];

  const recentAssignments = [
    {
      id: '1',
      title: 'Math Quiz - Algebra Basics',
      dueDate: '2025-01-15',
      status: 'pending',
      subject: 'Mathematics'
    },
    {
      id: '2',
      title: 'History Essay - World War II',
      dueDate: '2025-01-18',
      status: 'submitted',
      subject: 'History'
    },
    {
      id: '3',
      title: 'Science Lab Report',
      dueDate: '2025-01-20',
      status: 'graded',
      subject: 'Science',
      grade: 'A-'
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 1.5 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user?.badges && user.badges.length > 0 && (
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-education-orange" />
              <span className="text-sm font-medium">{user.badges.length} badges earned</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assignments */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Recent Assignments
                </CardTitle>
                <CardDescription>Your latest assignments and their status</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/assignments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due {assignment.dueDate}
                    </span>
                    <span className="text-primary">{assignment.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {assignment.grade && (
                    <Badge variant="secondary" className="bg-education-green/10 text-education-green">
                      {assignment.grade}
                    </Badge>
                  )}
                  <Badge
                    variant={
                      assignment.status === 'graded'
                        ? 'default'
                        : assignment.status === 'submitted'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {assignment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get instant help with your studies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-hero" asChild>
                <Link to="/student/ai-assistant">Ask AI Assistant</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learning Progress
              </CardTitle>
              <CardDescription>This week's study time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal</span>
                <span>16h / 20h</span>
              </div>
              <Progress value={80} className="h-2" />
              <div className="grid grid-cols-7 gap-1">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                    <div
                      className="w-full bg-muted rounded-sm"
                      style={{ height: `${Math.max(4, day.hours * 10)}px` }}
                    >
                      {day.hours > 0 && (
                        <div
                          className="bg-education-blue rounded-sm"
                          style={{ height: '100%' }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user?.badges?.slice(0, 2).map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-education-orange/10 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-education-orange" />
                    </div>
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/student/challenges">View All Badges</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}