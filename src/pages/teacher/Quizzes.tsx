import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SUBJECTS, DIFFICULTIES } from '@/integrations/supabase/resources';
import { listQuizzes, createQuiz, getQuizAnalytics, QuizWithStats, QuizAnalytics } from '@/integrations/supabase/quizzes';
import type { DifficultyTag, SubjectTag } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { BarChart2, CheckCircle, ClipboardList, PlusCircle, X, TrendingUp, Clock, Users } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuthStore();

  // Create dialog state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<SubjectTag>('Mathematics');
  const [difficulty, setDifficulty] = useState<DifficultyTag>('Easy');
  const [totalPoints, setTotalPoints] = useState<number>(100);
  const [dueDate, setDueDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [questions, setQuestions] = useState<Array<{ question_text: string; options: [string, string, string, string]; correct_index: 0 | 1 | 2 | 3 }>>(
    () => Array.from({ length: 5 }, () => ({ question_text: '', options: ['', '', '', ''] as [string, string, string, string], correct_index: 0 }))
  );
  const [submitting, setSubmitting] = useState(false);

  // Analytics modal state
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizWithStats | null>(null);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    const total = quizzes.length;
    const active = quizzes.filter((q) => q.is_active).length;
    const submissions = quizzes.reduce((sum, q) => sum + (q.submissions || 0), 0);
    const avg = quizzes.length
      ? Math.round(
          (quizzes.reduce((sum, q) => sum + (q.average_score ?? 0), 0) / quizzes.filter((q) => q.average_score !== null).length) || 0
        )
      : 0;
    return { total, active, submissions, avg };
  }, [quizzes]);

  const create = async () => {
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      await createQuiz(
        {
          title,
          description,
          subject,
          difficulty,
          total_points: Number(totalPoints) || 0,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          questions,
        },
        { id: user.id, name: user.name }
      );
      setOpen(false);
      setTitle('');
      setDescription('');
      setTags('');
      setQuestions(Array.from({ length: 5 }, () => ({ question_text: '', options: ['', '', '', ''] as [string, string, string, string], correct_index: 0 })));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create quiz failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onQuizClick = async (quiz: QuizWithStats) => {
    setSelectedQuiz(quiz);
    setAnalyticsOpen(true);
    setAnalyticsLoading(true);
    try {
      const data = await getQuizAnalytics(quiz.id);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage quizzes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <PlusCircle className="w-4 h-4 mr-2" /> Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Quiz</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" />
                </div>
                <div>
                  <Label>Total Points</Label>
                  <Input type="number" value={totalPoints} onChange={(e) => setTotalPoints(Number(e.target.value))} />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One-line description" />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Select value={subject} onValueChange={(v: SubjectTag) => setSubject(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v: DifficultyTag) => setDifficulty(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., algebra, practice" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-semibold">Questions (5)</div>
                {questions.map((q, idx) => (
                  <Card key={idx} className="card-elevated">
                    <CardContent className="p-4 space-y-2">
                      <div>
                        <Label>Q{idx + 1} Text</Label>
                        <Input
                          value={q.question_text}
                          onChange={(e) => {
                            const copy = [...questions];
                            copy[idx] = { ...copy[idx], question_text: e.target.value };
                            setQuestions(copy);
                          }}
                          placeholder="Enter question"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx}>
                            <Label>Option {oIdx + 1}</Label>
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const copy = [...questions];
                                const opts = [...copy[idx].options] as [string, string, string, string];
                                opts[oIdx] = e.target.value;
                                copy[idx] = { ...copy[idx], options: opts };
                                setQuestions(copy);
                              }}
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <Label>Correct Option</Label>
                        <Select
                          value={String(q.correct_index)}
                          onValueChange={(v) => {
                            const copy = [...questions];
                            copy[idx] = { ...copy[idx], correct_index: Number(v) as 0 | 1 | 2 | 3 };
                            setQuestions(copy);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Option 1</SelectItem>
                            <SelectItem value="1">Option 2</SelectItem>
                            <SelectItem value="2">Option 3</SelectItem>
                            <SelectItem value="3">Option 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button className="btn-hero" onClick={create} disabled={submitting || !title}>
                  {submitting ? 'Creating...' : 'Create Quiz'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Quizzes</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <ClipboardList className="w-6 h-6 text-education-blue" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Active Quizzes</div>
              <div className="text-2xl font-bold">{stats.active}</div>
            </div>
            <CheckCircle className="w-6 h-6 text-education-green" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
              <div className="text-2xl font-bold">{stats.submissions}</div>
            </div>
            <BarChart2 className="w-6 h-6 text-education-purple" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Average Score</div>
              <div className="text-2xl font-bold">{stats.avg || 0}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz cards */}
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : quizzes.length === 0 ? (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>No quizzes yet</CardTitle>
            <CardDescription>Create your first quiz</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <Card key={q.id} className="card-elevated hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => onQuizClick(q)}>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{q.title}</CardTitle>
                <CardDescription className="line-clamp-1">{q.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{q.subject}</Badge>
                  <Badge variant="outline">{q.difficulty}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {q.questions_count} questions • {q.total_points} points
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {q.due_date ? new Date(q.due_date).toLocaleString() : 'No due date'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Score: {q.average_score ? Math.round(q.average_score) : 0}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{selectedQuiz?.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{selectedQuiz?.subject}</Badge>
                  <Badge variant="outline">{selectedQuiz?.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedQuiz?.questions_count} questions • {selectedQuiz?.total_points} points
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAnalyticsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {analyticsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground">Loading analytics...</div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-education-blue" />
                      <div>
                        <div className="text-2xl font-bold">{analytics.quiz.submissions}</div>
                        <div className="text-sm text-muted-foreground">Total Attempts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-education-green" />
                      <div>
                        <div className="text-2xl font-bold">{analytics.quiz.average_score || 0}%</div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-education-orange" />
                      <div>
                        <div className="text-2xl font-bold">{analytics.timeStats.average_time}m</div>
                        <div className="text-sm text-muted-foreground">Avg Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-education-purple" />
                      <div>
                        <div className="text-2xl font-bold">{analytics.questionStats.length}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>How students performed across score ranges</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Question Analysis */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Question Performance</CardTitle>
                    <CardDescription>Accuracy by question</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.questionStats.map((q, i) => ({ question: `Q${i + 1}`, accuracy: q.accuracy }))}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="question" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="accuracy" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Student Performance Table */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Student Performance</CardTitle>
                  <CardDescription>Individual student results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-muted-foreground">
                        <tr>
                          <th className="text-left py-2">Student</th>
                          <th className="text-left py-2">Score</th>
                          <th className="text-left py-2">Percentage</th>
                          <th className="text-left py-2">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.attempts.slice(0, 10).map((attempt) => (
                          <tr key={attempt.id} className="border-t">
                            <td className="py-2 font-medium">{attempt.student_name}</td>
                            <td className="py-2">{attempt.score}/{attempt.total_points}</td>
                            <td className="py-2">{Math.round((attempt.score / attempt.total_points) * 100)}%</td>
                            <td className="py-2">{new Date(attempt.submitted_at || attempt.started_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}


