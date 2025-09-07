import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/authStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function StudentProgress() {
  const { user } = useAuthStore();

  // Mock data
  const kpis = [
    { label: 'Quizzes Taken', value: 12 },
    { label: 'Average Score', value: '84%' },
    { label: 'Best Score', value: '98%' },
    { label: 'Streak Days', value: user?.streakDays ?? 7 },
  ];

  const scoreTrend = [
    { date: 'Jan 02', score: 72 },
    { date: 'Jan 05', score: 81 },
    { date: 'Jan 09', score: 88 },
    { date: 'Jan 14', score: 76 },
    { date: 'Jan 18', score: 92 },
    { date: 'Jan 22', score: 85 },
    { date: 'Jan 26', score: 94 },
  ];

  const masteryBySubject = [
    { subject: 'Math', mastery: 86 },
    { subject: 'Science', mastery: 78 },
    { subject: 'English', mastery: 90 },
    { subject: 'History', mastery: 70 },
    { subject: 'CS', mastery: 88 },
  ];

  const difficultyBreakdown = [
    { difficulty: 'Easy', correct: 48, wrong: 4 },
    { difficulty: 'Medium', correct: 35, wrong: 12 },
    { difficulty: 'Hard', correct: 18, wrong: 15 },
  ];

  const weeklyTime = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 3.8 },
    { day: 'Fri', hours: 2.2 },
    { day: 'Sat', hours: 0.5 },
    { day: 'Sun', hours: 1.2 },
  ];
  const weeklyGoal = 12; // hours
  const totalThisWeek = weeklyTime.reduce((s, d) => s + d.hours, 0);
  const goalPct = Math.min(100, Math.round((totalThisWeek / weeklyGoal) * 100));

  const recentResults = [
    { id: 'QZ-1042', title: 'Algebra Basics', subject: 'Math', date: 'Jan 18', score: 92, time: '18m', difficulty: 'Medium' },
    { id: 'QZ-1041', title: 'Photosynthesis', subject: 'Science', date: 'Jan 14', score: 76, time: '22m', difficulty: 'Hard' },
    { id: 'QZ-1039', title: 'Grammar Review', subject: 'English', date: 'Jan 09', score: 88, time: '15m', difficulty: 'Easy' },
    { id: 'QZ-1037', title: 'World War II', subject: 'History', date: 'Jan 05', score: 81, time: '20m', difficulty: 'Medium' },
  ];

  const strengths = ['Linear Equations', 'Reading Comprehension', 'Algorithms'];
  const weaknesses = ['World History Timelines', 'Chemical Equations'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Progress Overview</h1>
          <p className="text-muted-foreground">Hi {user?.name?.split(' ')[0]}, here’s how you’re doing</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="card-elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-bold mt-1">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score trend */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
            <CardDescription>Recent quiz performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly goal */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Weekly Study Goal</CardTitle>
            <CardDescription>
              {totalThisWeek.toFixed(1)}h / {weeklyGoal}h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar value={goalPct} className="h-2" />
            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTime}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject mastery */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Subject Mastery</CardTitle>
            <CardDescription>Relative strengths by subject</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={masteryBySubject}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Mastery" dataKey="mastery" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty breakdown */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle>Difficulty Breakdown</CardTitle>
            <CardDescription>Correct vs wrong answers by difficulty</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" stackId="a" fill="#10b981" name="Correct" />
                <Bar dataKey="wrong" stackId="a" fill="#ef4444" name="Wrong" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strengths & weaknesses */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>Areas where you perform well</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Focus Areas</CardTitle>
            <CardDescription>Recommended for improvement</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {weaknesses.map((w) => (
              <Badge key={w} variant="outline">{w}</Badge>
            ))}
          </CardContent>
        </Card>

        {/* Recent results table */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Latest quizzes and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Quiz</th>
                    <th className="text-left py-2">Subject</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Diff.</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2 font-medium">{r.title}</td>
                      <td className="py-2">{r.subject}</td>
                      <td className="py-2">{r.date}</td>
                      <td className="py-2">{r.score}%</td>
                      <td className="py-2">{r.time}</td>
                      <td className="py-2">{r.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


