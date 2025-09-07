// EduTrack Application Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  grade?: string;
  school?: string;
  profilePicture?: string;
  createdAt: Date;
  
  // Gamification fields for students
  totalPoints?: number;
  level?: number;
  badges?: string[];
  streakDays?: number;
}

export type SubjectTag =
  | 'Mathematics'
  | 'Science'
  | 'History'
  | 'English'
  | 'Computer Science'
  | 'Geography'
  | 'Biology'
  | 'Chemistry'
  | 'Physics';

export type DifficultyTag = 'Easy' | 'Medium' | 'Hard';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'docx' | 'pptx' | 'image' | 'link' | 'note';
  content?: string; // for internal notes
  url?: string; // for external links
  subject: SubjectTag;
  difficulty: DifficultyTag;
  tags: string[];
  uploaderId: string;
  uploaderName: string;
  filePath?: string; // storage path if uploaded file
  fileType?: string;
  createdAt: Date;
  downloadCount?: number;
}

// DB record shape for Supabase (dates as strings)
export interface ResourceRecord {
  id: string;
  title: string;
  description: string;
  subject: SubjectTag;
  difficulty: DifficultyTag;
  tags: string[];
  uploader_id: string;
  uploader_name: string;
  file_path: string | null;
  file_type: string | null;
  created_at: string; // ISO
}

export interface Highlight {
  id: string;
  resourceId: string;
  studentId: string;
  text: string;
  position: {
    page: number;
    x: number;
    y: number;
  };
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  attempts: number;
  dueDate?: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Answer[];
  score: number;
  totalPoints: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: Date;
  maxPoints: number;
  rubric?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments?: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  status: 'draft' | 'submitted' | 'graded';
  peerReviews?: PeerReview[];
}

export interface PeerReview {
  id: string;
  submissionId: string;
  reviewerId: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  studentId: string;
  resourceId?: string;
  tags: string[];
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  noteId: string;
  text: string;
  position: {
    start: number;
    end: number;
  };
  createdAt: Date;
}

export interface ProgressData {
  studentId: string;
  topic: string;
  mastery: number; // 0-100
  attempts: number;
  streak: number;
  lastStudied: Date;
  timeSpent: number; // in minutes
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: Date;
  endDate: Date;
  participants: string[];
  leaderboard: LeaderboardEntry[];
  rewards: string[];
  isActive: boolean;
}

export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  score: number;
  rank: number;
  achievements: string[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'question' | 'explanation' | 'feedback';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'reminder';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// API Response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  grade?: string;
  school?: string;
}