import { supabase } from './client';
import type { DifficultyTag, SubjectTag, User } from '@/types';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: SubjectTag;
  difficulty: DifficultyTag;
  total_points: number;
  due_date: string | null;
  is_active: boolean;
  tags: string[];
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  index_in_quiz: number;
  question_text: string;
  options: string[]; // length 4
  correct_index: number;
  points: number;
}

export interface QuizWithStats extends Quiz {
  questions_count: number;
  submissions: number;
  average_score: number | null; // 0-100 percent
}

export interface CreateQuizPayload {
  title: string;
  description: string;
  subject: SubjectTag;
  difficulty: DifficultyTag;
  total_points: number;
  due_date: string | null; // ISO
  tags?: string[];
  questions: Array<{
    question_text: string;
    options: [string, string, string, string];
    correct_index: 0 | 1 | 2 | 3;
  }>;
}

export async function listQuizzes(): Promise<QuizWithStats[]> {
  // Fetch quizzes
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const quizIds = (quizzes ?? []).map((q) => q.id);
  if (quizIds.length === 0) return [];

  // Questions count (compute client-side)
  const { data: qRows, error: qErr } = await supabase
    .from('quiz_questions')
    .select('quiz_id')
    .in('quiz_id', quizIds);
  if (qErr) throw qErr;
  const countsMap = new Map<string, number>();
  (qRows ?? []).forEach((row: any) => {
    countsMap.set(row.quiz_id, (countsMap.get(row.quiz_id) ?? 0) + 1);
  });

  // Attempts stats (compute client-side)
  const { data: aRows, error: aErr } = await supabase
    .from('quiz_attempts')
    .select('quiz_id, score')
    .in('quiz_id', quizIds);
  if (aErr) throw aErr;
  const statsMap = new Map<string, { submissions: number; sum: number; count: number }>();
  (aRows ?? []).forEach((row: any) => {
    const key = row.quiz_id;
    const prev = statsMap.get(key) ?? { submissions: 0, sum: 0, count: 0 };
    const submissions = prev.submissions + 1;
    const sum = prev.sum + (typeof row.score === 'number' ? Number(row.score) : 0);
    const count = prev.count + (typeof row.score === 'number' ? 1 : 0);
    statsMap.set(key, { submissions, sum, count });
  });

  return (quizzes as Quiz[]).map((q) => ({
    ...q,
    questions_count: countsMap.get(q.id) ?? 0,
    submissions: statsMap.get(q.id)?.submissions ?? 0,
    average_score:
      ((): number | null => {
        const s = statsMap.get(q.id);
        if (!s || s.count === 0) return null;
        // Convert to percentage out of total_points
        const avgPoints = s.sum / s.count;
        return q.total_points > 0 ? Math.round((avgPoints / q.total_points) * 100) : null;
      })(),
  }));
}

export async function getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('index_in_quiz');
  if (error) throw error;
  return data as QuizQuestion[];
}

export async function createQuiz(payload: CreateQuizPayload, creator: Pick<User, 'id' | 'name'>): Promise<string> {
  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert({
      title: payload.title,
      description: payload.description,
      subject: payload.subject,
      difficulty: payload.difficulty,
      total_points: payload.total_points,
      due_date: payload.due_date,
      tags: payload.tags ?? [],
      created_by: creator.id,
      created_by_name: creator.name,
    })
    .select('id')
    .single();
  if (error) throw error;

  const perQuestionPoints = Math.floor(payload.total_points / payload.questions.length);

  const questionsRows = payload.questions.map((q, index) => ({
    quiz_id: quiz.id,
    index_in_quiz: index,
    question_text: q.question_text,
    options: q.options,
    correct_index: q.correct_index,
    points: perQuestionPoints,
  }));

  const { error: qErr } = await supabase.from('quiz_questions').insert(questionsRows);
  if (qErr) throw qErr;

  return quiz.id as string;
}

export interface AttemptStatus {
  quiz_id: string;
  status: 'not_taken' | 'completed';
  score?: number;
}

export async function getAttemptStatuses(quizIds: string[], student: Pick<User, 'id' | 'name'>): Promise<Record<string, AttemptStatus>> {
  if (quizIds.length === 0) return {};
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, quiz_id, score, submitted_at')
    .eq('student_id', student.id)
    .in('quiz_id', quizIds);
  if (error) throw error;
  const map: Record<string, AttemptStatus> = {};
  (data ?? []).forEach((row: any) => {
    map[row.quiz_id] = {
      quiz_id: row.quiz_id,
      status: row.submitted_at ? 'completed' : 'not_taken',
      score: row.score ?? undefined,
    };
  });
  return map;
}

export async function startAttempt(quiz: Quiz, student: Pick<User, 'id' | 'name'>): Promise<string> {
  // create new attempt snapshot
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quiz.id,
      student_id: student.id,
      student_name: student.name,
      total_points: quiz.total_points,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function answerQuestion(attemptId: string, questionId: string, selectedIndex: number) {
  // upsert by attemptId+questionId: delete any existing then insert
  await supabase
    .from('quiz_attempt_answers')
    .delete()
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId);

  const { error } = await supabase
    .from('quiz_attempt_answers')
    .insert({ attempt_id: attemptId, question_id: questionId, selected_index: selectedIndex });
  if (error) throw error;
}

export async function submitAttempt(attemptId: string): Promise<{ score: number }> {
  // Evaluate server-side via SQL RPC-like logic done on client using available data
  const { data: answers, error: aErr } = await supabase
    .from('quiz_attempt_answers')
    .select('question_id, selected_index')
    .eq('attempt_id', attemptId);
  if (aErr) throw aErr;

  const questionIds = (answers ?? []).map((a) => a.question_id);
  const { data: questions, error: qErr } = await supabase
    .from('quiz_questions')
    .select('id, correct_index, points')
    .in('id', questionIds);
  if (qErr) throw qErr;

  const pointsMap = new Map<string, { correct_index: number; points: number }>();
  (questions ?? []).forEach((q: any) => pointsMap.set(q.id, { correct_index: q.correct_index, points: q.points }));

  let score = 0;
  (answers ?? []).forEach((a: any) => {
    const q = pointsMap.get(a.question_id);
    if (!q) return;
    if (Number(a.selected_index) === Number(q.correct_index)) score += Number(q.points);
  });

  const { error: updErr } = await supabase
    .from('quiz_attempts')
    .update({ submitted_at: new Date().toISOString(), score })
    .eq('id', attemptId);
  if (updErr) throw updErr;

  return { score };
}

export interface QuizAnalytics {
  quiz: QuizWithStats;
  attempts: Array<{
    id: string;
    student_name: string;
    score: number;
    total_points: number;
    started_at: string;
    submitted_at: string | null;
  }>;
  questionStats: Array<{
    question_id: string;
    question_text: string;
    correct_count: number;
    total_attempts: number;
    accuracy: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  timeStats: {
    average_time: number;
    median_time: number;
    timeDistribution: Array<{
      range: string;
      count: number;
    }>;
  };
}

export async function getQuizAnalytics(quizId: string): Promise<QuizAnalytics> {
  // Get quiz details
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
  if (quizError) throw quizError;

  // Get attempts
  const { data: attempts, error: attemptsError } = await supabase
    .from('quiz_attempts')
    .select('id, student_name, score, total_points, started_at, submitted_at')
    .eq('quiz_id', quizId)
    .not('submitted_at', 'is', null)
    .order('submitted_at', { ascending: false });
  if (attemptsError) throw attemptsError;

  // Get questions for analysis
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, question_text')
    .eq('quiz_id', quizId)
    .order('index_in_quiz');
  if (questionsError) throw questionsError;

  // Get question-level stats
  const questionStats = await Promise.all(
    questions.map(async (q) => {
      const { data: answers, error: answersError } = await supabase
        .from('quiz_attempt_answers')
        .select('is_correct')
        .eq('question_id', q.id);
      if (answersError) throw answersError;

      const correctCount = answers?.filter(a => a.is_correct).length || 0;
      const totalAttempts = answers?.length || 0;
      const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

      return {
        question_id: q.id,
        question_text: q.question_text,
        correct_count: correctCount,
        total_attempts: totalAttempts,
        accuracy,
      };
    })
  );

  // Calculate score distribution
  const scores = attempts?.map(a => a.score) || [];
  const scoreRanges = [
    { range: '0-20%', min: 0, max: 20 },
    { range: '21-40%', min: 21, max: 40 },
    { range: '41-60%', min: 41, max: 60 },
    { range: '61-80%', min: 61, max: 80 },
    { range: '81-100%', min: 81, max: 100 },
  ];

  const scoreDistribution = scoreRanges.map(range => ({
    range: range.range,
    count: scores.filter(score => score >= range.min && score <= range.max).length,
  }));

  // Calculate time stats (mock for now - would need time tracking)
  const timeStats = {
    average_time: 18, // minutes
    median_time: 16,
    timeDistribution: [
      { range: '0-10min', count: 2 },
      { range: '11-20min', count: 8 },
      { range: '21-30min', count: 5 },
      { range: '31+ min', count: 1 },
    ],
  };

  // Calculate quiz stats
  const totalAttempts = attempts?.length || 0;
  const averageScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;

  const quizWithStats: QuizWithStats = {
    ...quiz,
    questions_count: questions.length,
    submissions: totalAttempts,
    average_score: averageScore,
  };

  return {
    quiz: quizWithStats,
    attempts: attempts || [],
    questionStats,
    scoreDistribution,
    timeStats,
  };
}


