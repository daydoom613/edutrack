import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  FileText,
  ClipboardList,
  PieChart,
  TrendingUp,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock student data (same as Students page)
const mockStudents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@student.edu',
    studentId: 'STU001',
    grade: 'Grade 10',
    avatar: 'SJ',
    averageScore: 94,
    totalAttempts: 15,
    lastActivity: '2024-01-15',
    status: 'excellent',
    subjects: { math: 96, science: 92, english: 95, history: 93 },
    riskLevel: 'low',
    engagement: 95
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@student.edu',
    studentId: 'STU002',
    grade: 'Grade 10',
    avatar: 'MC',
    averageScore: 91,
    totalAttempts: 18,
    lastActivity: '2024-01-14',
    status: 'excellent',
    subjects: { math: 98, science: 89, english: 88, history: 89 },
    riskLevel: 'low',
    engagement: 92
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@student.edu',
    studentId: 'STU003',
    grade: 'Grade 9',
    avatar: 'ED',
    averageScore: 89,
    totalAttempts: 12,
    lastActivity: '2024-01-15',
    status: 'good',
    subjects: { math: 85, science: 92, english: 94, history: 85 },
    riskLevel: 'low',
    engagement: 88
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@student.edu',
    studentId: 'STU004',
    grade: 'Grade 10',
    avatar: 'DW',
    averageScore: 87,
    totalAttempts: 16,
    lastActivity: '2024-01-13',
    status: 'good',
    subjects: { math: 90, science: 85, english: 88, history: 85 },
    riskLevel: 'low',
    engagement: 85
  },
  {
    id: '5',
    name: 'Lisa Brown',
    email: 'lisa.brown@student.edu',
    studentId: 'STU005',
    grade: 'Grade 9',
    avatar: 'LB',
    averageScore: 85,
    totalAttempts: 14,
    lastActivity: '2024-01-12',
    status: 'good',
    subjects: { math: 88, science: 82, english: 87, history: 83 },
    riskLevel: 'low',
    engagement: 82
  },
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex.thompson@student.edu',
    studentId: 'STU006',
    grade: 'Grade 10',
    avatar: 'AT',
    averageScore: 58,
    totalAttempts: 8,
    lastActivity: '2024-01-10',
    status: 'at-risk',
    subjects: { math: 45, science: 62, english: 65, history: 60 },
    riskLevel: 'high',
    engagement: 45
  },
  {
    id: '7',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    studentId: 'STU007',
    grade: 'Grade 9',
    avatar: 'MG',
    averageScore: 62,
    totalAttempts: 10,
    lastActivity: '2024-01-11',
    status: 'needs-improvement',
    subjects: { math: 55, science: 68, english: 70, history: 55 },
    riskLevel: 'medium',
    engagement: 60
  },
  {
    id: '8',
    name: 'James Lee',
    email: 'james.lee@student.edu',
    studentId: 'STU008',
    grade: 'Grade 10',
    avatar: 'JL',
    averageScore: 65,
    totalAttempts: 12,
    lastActivity: '2024-01-14',
    status: 'needs-improvement',
    subjects: { math: 70, science: 60, english: 68, history: 62 },
    riskLevel: 'medium',
    engagement: 65
  },
  {
    id: '9',
    name: 'Anna Smith',
    email: 'anna.smith@student.edu',
    studentId: 'STU009',
    grade: 'Grade 9',
    avatar: 'AS',
    averageScore: 59,
    totalAttempts: 6,
    lastActivity: '2024-01-08',
    status: 'at-risk',
    subjects: { math: 50, science: 65, english: 62, history: 58 },
    riskLevel: 'high',
    engagement: 40
  },
  {
    id: '10',
    name: 'Ryan O\'Connor',
    email: 'ryan.oconnor@student.edu',
    studentId: 'STU010',
    grade: 'Grade 10',
    avatar: 'RO',
    averageScore: 78,
    totalAttempts: 13,
    lastActivity: '2024-01-15',
    status: 'good',
    subjects: { math: 82, science: 75, english: 80, history: 75 },
    riskLevel: 'low',
    engagement: 78
  },
  {
    id: '11',
    name: 'Sophie Taylor',
    email: 'sophie.taylor@student.edu',
    studentId: 'STU011',
    grade: 'Grade 9',
    avatar: 'ST',
    averageScore: 92,
    totalAttempts: 17,
    lastActivity: '2024-01-15',
    status: 'excellent',
    subjects: { math: 95, science: 90, english: 91, history: 92 },
    riskLevel: 'low',
    engagement: 94
  },
  {
    id: '12',
    name: 'Kevin Martinez',
    email: 'kevin.martinez@student.edu',
    studentId: 'STU012',
    grade: 'Grade 10',
    avatar: 'KM',
    averageScore: 73,
    totalAttempts: 11,
    lastActivity: '2024-01-12',
    status: 'good',
    subjects: { math: 78, science: 70, english: 75, history: 69 },
    riskLevel: 'low',
    engagement: 72
  },
  {
    id: '13',
    name: 'Rachel Green',
    email: 'rachel.green@student.edu',
    studentId: 'STU013',
    grade: 'Grade 9',
    avatar: 'RG',
    averageScore: 88,
    totalAttempts: 15,
    lastActivity: '2024-01-14',
    status: 'good',
    subjects: { math: 85, science: 91, english: 89, history: 87 },
    riskLevel: 'low',
    engagement: 86
  },
  {
    id: '14',
    name: 'Daniel Kim',
    email: 'daniel.kim@student.edu',
    studentId: 'STU014',
    grade: 'Grade 10',
    avatar: 'DK',
    averageScore: 81,
    totalAttempts: 14,
    lastActivity: '2024-01-13',
    status: 'good',
    subjects: { math: 88, science: 78, english: 82, history: 76 },
    riskLevel: 'low',
    engagement: 79
  },
  {
    id: '15',
    name: 'Olivia White',
    email: 'olivia.white@student.edu',
    studentId: 'STU015',
    grade: 'Grade 9',
    avatar: 'OW',
    averageScore: 76,
    totalAttempts: 9,
    lastActivity: '2024-01-11',
    status: 'needs-improvement',
    subjects: { math: 72, science: 80, english: 78, history: 74 },
    riskLevel: 'medium',
    engagement: 68
  }
];

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  // Calculate real stats from student data
  const stats = {
    total: mockStudents.length,
    excellent: mockStudents.filter(s => s.status === 'excellent').length,
    good: mockStudents.filter(s => s.status === 'good').length,
    needsImprovement: mockStudents.filter(s => s.status === 'needs-improvement').length,
    atRisk: mockStudents.filter(s => s.status === 'at-risk').length,
    averageScore: Math.round(mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / mockStudents.length),
    totalAttempts: mockStudents.reduce((sum, s) => sum + s.totalAttempts, 0),
    averageEngagement: Math.round(mockStudents.reduce((sum, s) => sum + s.engagement, 0) / mockStudents.length)
  };

  const quickStats = [
    {
      title: 'Total Students',
      value: stats.total.toString(),
      icon: Users,
      color: 'text-education-blue',
      bgColor: 'bg-education-blue/10',
      change: `${stats.excellent} excellent performers`
    },
    {
      title: 'Active Quizzes',
      value: '8',
      icon: ClipboardList,
      color: 'text-education-purple',
      bgColor: 'bg-education-purple/10',
      change: `${stats.totalAttempts} total attempts`
    },
    {
      title: 'Resources Shared',
      value: '42',
      icon: FileText,
      color: 'text-education-green',
      bgColor: 'bg-education-green/10',
      change: '5 this week'
    },
    {
      title: 'Avg. Performance',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'text-education-orange',
      bgColor: 'bg-education-orange/10',
      change: `${stats.averageEngagement}% engagement`
    }
  ];

  // Get top performers from actual student data
  const topPerformers = mockStudents
    .filter(s => s.status === 'excellent')
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

  // Get students needing attention
  const studentsNeedingAttention = mockStudents
    .filter(s => s.status === 'at-risk' || s.status === 'needs-improvement')
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3);

  const recentActivities = [
    {
      id: '1',
      type: 'submission',
      message: `New assignment submission from ${topPerformers[0]?.name || 'Sarah Johnson'}`,
      time: '2 minutes ago',
      icon: CheckCircle,
      color: 'text-education-green'
    },
    {
      id: '2',
      type: 'quiz',
      message: `Quiz "Algebra Basics" completed by ${Math.floor(stats.total * 0.8)} students`,
      time: '1 hour ago',
      icon: ClipboardList,
      color: 'text-education-blue'
    },
    {
      id: '3',
      type: 'help',
      message: `${studentsNeedingAttention[0]?.name || 'Alex Thompson'} asked for help via AI Assistant`,
      time: '3 hours ago',
      icon: Brain,
      color: 'text-education-purple'
    },
    {
      id: '4',
      type: 'deadline',
      message: 'Assignment "History Essay" due in 2 days',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-education-orange'
    }
  ];

  // Convert top performers to display format
  const topPerformersDisplay = topPerformers.map((student, index) => ({
    id: student.id,
    name: student.name,
    grade: student.averageScore >= 95 ? 'A+' : student.averageScore >= 90 ? 'A' : 'A-',
    progress: student.averageScore,
    avatar: student.avatar
  }));

  const upcomingDeadlines = [
    {
      id: '1',
      title: 'History Essay - World War II',
      type: 'Assignment',
      dueDate: '2025-01-15',
      submissions: Math.floor(stats.total * 0.8),
      total: stats.total
    },
    {
      id: '2',
      title: 'Math Quiz - Calculus',
      type: 'Quiz',
      dueDate: '2025-01-18',
      submissions: Math.floor(stats.total * 0.6),
      total: stats.total
    },
    {
      id: '3',
      title: 'Science Project Proposal',
      type: 'Assignment',
      dueDate: '2025-01-22',
      submissions: Math.floor(stats.total * 0.4),
      total: stats.total
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your classes today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/teacher/ai-tools">
              <Brain className="w-4 h-4 mr-2" />
              AI Tools
            </Link>
          </Button>
          <Button className="btn-hero" asChild>
            <Link to="/teacher/resources">
              <FileText className="w-4 h-4 mr-2" />
              Create Resource
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/teacher/analytics">View Analytics</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Performers
              </CardTitle>
              <CardDescription>Students excelling this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformersDisplay.map((student, index) => (
                <div key={student.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    #{index + 1}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-education-blue text-white text-xs">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1 bg-muted rounded-full flex-1">
                        <div 
                          className="h-1 bg-education-green rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {student.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link to="/teacher/students">View All Students</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Students Needing Attention */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Students Needing Attention
              </CardTitle>
              <CardDescription>Students who may need extra support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentsNeedingAttention.map((student, index) => (
                <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-education-orange text-white text-xs">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{student.averageScore}% avg</span>
                      <Badge 
                        variant={student.riskLevel === 'high' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {student.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link to="/teacher/students">View All Students</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Assignments & quizzes due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due {item.dueDate}</span>
                    <span>{item.submissions}/{item.total} submitted</span>
                  </div>
                  <div className="mt-2 h-1 bg-muted rounded-full">
                    <div 
                      className="h-1 bg-education-blue rounded-full"
                      style={{ width: `${(item.submissions / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}