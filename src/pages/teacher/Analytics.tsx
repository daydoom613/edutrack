import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

// Mock data
const monthlyTrends = [
  { month: 'Jan', avgScore: 72, attempts: 45, engagement: 85 },
  { month: 'Feb', avgScore: 75, attempts: 52, engagement: 88 },
  { month: 'Mar', avgScore: 78, attempts: 48, engagement: 82 },
  { month: 'Apr', avgScore: 81, attempts: 61, engagement: 91 },
  { month: 'May', avgScore: 79, attempts: 55, engagement: 87 },
  { month: 'Jun', avgScore: 84, attempts: 58, engagement: 93 }
];

const subjectPerformance = [
  { subject: 'Math', score: 85, attempts: 45, difficulty: 3.2 },
  { subject: 'Science', score: 78, attempts: 38, difficulty: 3.8 },
  { subject: 'English', score: 82, attempts: 42, difficulty: 2.9 },
  { subject: 'History', score: 76, attempts: 35, difficulty: 3.5 }
];

const difficultyAnalysis = [
  { difficulty: 'Easy', avgScore: 92, attempts: 25, completion: 96 },
  { difficulty: 'Medium', avgScore: 78, attempts: 45, completion: 88 },
  { difficulty: 'Hard', avgScore: 65, attempts: 20, completion: 72 }
];

const questionHeatmap = [
  { question: 'Q1', subject: 'Math', difficulty: 1, accuracy: 95, discrimination: 0.8 },
  { question: 'Q2', subject: 'Math', difficulty: 2, accuracy: 87, discrimination: 0.6 },
  { question: 'Q3', subject: 'Math', difficulty: 3, accuracy: 72, discrimination: 0.9 },
  { question: 'Q4', subject: 'Science', difficulty: 2, accuracy: 89, discrimination: 0.7 },
  { question: 'Q5', subject: 'Science', difficulty: 4, accuracy: 58, discrimination: 0.9 },
  { question: 'Q6', subject: 'English', difficulty: 1, accuracy: 91, discrimination: 0.5 },
  { question: 'Q7', subject: 'English', difficulty: 3, accuracy: 76, discrimination: 0.8 },
  { question: 'Q8', subject: 'History', difficulty: 2, accuracy: 83, discrimination: 0.6 },
  { question: 'Q9', subject: 'History', difficulty: 4, accuracy: 61, discrimination: 0.9 },
  { question: 'Q10', subject: 'Math', difficulty: 3, accuracy: 69, discrimination: 0.8 }
];

const topPerformers = [
  { name: 'Sarah Johnson', avgScore: 94, growth: 12, attempts: 15 },
  { name: 'Michael Chen', avgScore: 91, growth: 8, attempts: 18 },
  { name: 'Emily Davis', avgScore: 89, growth: 15, attempts: 12 },
  { name: 'David Wilson', avgScore: 87, growth: 6, attempts: 16 },
  { name: 'Lisa Brown', avgScore: 85, growth: 9, attempts: 14 }
];

const strugglingStudents = [
  { name: 'Alex Thompson', avgScore: 58, trend: 'declining', risk: 'high' },
  { name: 'Maria Garcia', avgScore: 62, trend: 'stable', risk: 'medium' },
  { name: 'James Lee', avgScore: 65, trend: 'improving', risk: 'low' },
  { name: 'Anna Smith', avgScore: 59, trend: 'declining', risk: 'high' }
];

const weeklyEngagement = [
  { day: 'Mon', attempts: 12, avgTime: 18 },
  { day: 'Tue', attempts: 15, avgTime: 22 },
  { day: 'Wed', attempts: 18, avgTime: 20 },
  { day: 'Thu', attempts: 14, avgTime: 19 },
  { day: 'Fri', attempts: 10, avgTime: 16 },
  { day: 'Sat', attempts: 6, avgTime: 25 },
  { day: 'Sun', attempts: 4, avgTime: 28 }
];

const classVsIndividual = [
  { student: 'Student A', classAvg: 78, individual: 85 },
  { student: 'Student B', classAvg: 78, individual: 72 },
  { student: 'Student C', classAvg: 78, individual: 91 },
  { student: 'Student D', classAvg: 78, individual: 65 },
  { student: 'Student E', classAvg: 78, individual: 88 }
];

export default function TeacherAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Filter data based on selected subject
  const filteredSubjectPerformance = selectedSubject === 'all' 
    ? subjectPerformance 
    : subjectPerformance.filter(subject => 
        subject.subject.toLowerCase() === selectedSubject
      );

  const filteredQuestionHeatmap = selectedSubject === 'all'
    ? questionHeatmap
    : questionHeatmap.filter(q => 
        q.subject.toLowerCase() === selectedSubject
      );

  // Add visual indicator for active filters
  const hasActiveFilters = selectedSubject !== 'all' || selectedPeriod !== '6months';

  const getHeatmapColor = (accuracy: number) => {
    if (accuracy >= 90) return '#22c55e';
    if (accuracy >= 80) return '#84cc16';
    if (accuracy >= 70) return '#eab308';
    if (accuracy >= 60) return '#f97316';
    return '#ef4444';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into student performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedSubject('all');
                setSelectedPeriod('6months');
              }}
              className="gap-2"
            >
              Clear Filters
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-education-blue/10 rounded-lg">
                <Users className="w-6 h-6 text-education-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold">52</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="text-xs text-education-green">+8% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-education-green/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-education-green" />
              </div>
              <div>
                <div className="text-2xl font-bold">84%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
                <div className="text-xs text-education-green">+6% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-education-orange/10 rounded-lg">
                <Target className="w-6 h-6 text-education-orange" />
              </div>
              <div>
                <div className="text-2xl font-bold">91%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
                <div className="text-xs text-education-green">+3% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-education-purple/10 rounded-lg">
                <Activity className="w-6 h-6 text-education-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Engagement Score</div>
                <div className="text-xs text-education-green">+5% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trends */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Score Trends Over Time
            </CardTitle>
            <CardDescription>Average class performance by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="avgScore" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subject Performance
              {selectedSubject !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Only
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {selectedSubject === 'all' 
                ? 'Performance across different subjects' 
                : `Performance for ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} subject`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={filteredSubjectPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Analysis */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Difficulty Analysis
            </CardTitle>
            <CardDescription>Performance by difficulty level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Engagement */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Engagement Pattern
            </CardTitle>
            <CardDescription>Quiz attempts by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attempts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Question Heatmap */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Question Performance Heatmap
              {selectedSubject !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Only
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {selectedSubject === 'all' 
                ? 'Accuracy and difficulty analysis by question' 
                : `Questions for ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} subject`
              }
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {filteredQuestionHeatmap.map((q, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: getHeatmapColor(q.accuracy) }}
                >
                  {q.accuracy}%
                </div>
                <div className="text-xs mt-1">{q.question}</div>
                <div className="text-xs text-muted-foreground">{q.subject}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>90%+ Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>70-89% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Below 70% Accuracy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performers
            </CardTitle>
            <CardDescription>Students with highest performance and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-education-blue/10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.attempts} attempts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-education-green">{student.avgScore}%</div>
                    <div className="text-xs text-education-green">+{student.growth}% growth</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Struggling Students */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Students Needing Attention
            </CardTitle>
            <CardDescription>Students below average with intervention recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strugglingStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-education-orange/10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">Trend: {student.trend}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-education-orange">{student.avgScore}%</div>
                    <Badge variant={getRiskColor(student.risk)} className="text-xs">
                      {student.risk} risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class vs Individual Performance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Class vs Individual Performance
          </CardTitle>
          <CardDescription>Comparison of class average vs individual student scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={classVsIndividual}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="classAvg" name="Class Average" />
              <YAxis dataKey="individual" name="Individual Score" />
              <Tooltip />
              <Scatter dataKey="individual" fill="#7c3aed" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>AI-powered insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-education-blue/5 rounded-lg border border-education-blue/20">
              <h4 className="font-semibold text-education-blue mb-2">At-Risk Students</h4>
              <p className="text-sm text-muted-foreground mb-2">2 students identified as high risk</p>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            <div className="p-4 bg-education-green/5 rounded-lg border border-education-green/20">
              <h4 className="font-semibold text-education-green mb-2">Difficulty Prediction</h4>
              <p className="text-sm text-muted-foreground mb-2">Next quiz predicted as Medium difficulty</p>
              <Button variant="outline" size="sm">Adjust Difficulty</Button>
            </div>
            <div className="p-4 bg-education-orange/5 rounded-lg border border-education-orange/20">
              <h4 className="font-semibold text-education-orange mb-2">Intervention Needed</h4>
              <p className="text-sm text-muted-foreground mb-2">3 students need additional support</p>
              <Button variant="outline" size="sm">Create Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
