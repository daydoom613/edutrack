import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { listQuizzes, getQuizQuestions, startAttempt, answerQuestion, submitAttempt, getAttemptStatuses, QuizWithStats, QuizQuestion } from '@/integrations/supabase/quizzes';
import { useAuthStore } from '@/stores/authStore';

export default function StudentAssignments() {
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizWithStats | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, { status: 'not_taken' | 'completed'; score?: number }>>({});

  const { user } = useAuthStore();

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listQuizzes();
      setQuizzes(data);
      if (user) {
        const map = await getAttemptStatuses(data.map((d) => d.id), { id: user.id, name: user.name });
        setStatuses(map);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTakeTest = async (quiz: QuizWithStats) => {
    if (!user) return;
    setCurrentQuiz(quiz);
    setOpen(true);
    setCurrentIndex(0);
    setSelected({});
    try {
      const qs = await getQuizQuestions(quiz.id);
      setQuestions(qs);
      const id = await startAttempt(quiz as any, { id: user.id, name: user.name });
      setAttemptId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start test');
    }
  };

  const onSelect = async (questionId: string, optionIndex: number) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (attemptId) {
      try {
        await answerQuestion(attemptId, questionId, optionIndex);
      } catch (err) {
        // ignore minor errors in dev mode
      }
    }
  };

  const onSubmit = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    try {
      const { score } = await submitAttempt(attemptId);
      setOpen(false);
      setAttemptId('');
      setCurrentQuiz(null);
      await refresh();
    } catch (err) {
      // ignore in dev
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">Attempt available quizzes</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : quizzes.length === 0 ? (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>No assignments yet</CardTitle>
            <CardDescription>Check back later</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => {
            const status = statuses[q.id]?.status ?? 'not_taken';
            const score = statuses[q.id]?.score;
            return (
              <Card key={q.id} className="card-elevated">
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
                  <div className="flex items-center justify-between">
                    <Badge variant={status === 'completed' ? 'secondary' : 'outline'}>
                      {status === 'completed' ? `Completed${typeof score === 'number' ? ` • ${score}/${q.total_points}` : ''}` : 'Not taken'}
                    </Badge>
                    <Button onClick={() => onTakeTest(q)} disabled={status === 'completed'} className="btn-hero">
                      Take test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[60vh]">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{currentQuiz?.title}</div>
              <div className="text-sm text-muted-foreground">
                Question {currentIndex + 1} / {questions.length}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2 space-y-4">
              {questions.length > 0 && (
                <div>
                  <div className="text-base font-medium mb-3">{questions[currentIndex].question_text}</div>
                  <div className="space-y-2">
                    {questions[currentIndex].options.map((opt, idx) => {
                      const qId = questions[currentIndex].id;
                      const chosen = selected[qId] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => onSelect(qId, idx)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            chosen ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              {currentIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}>Next</Button>
              ) : (
                <Button className="btn-hero" onClick={onSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


