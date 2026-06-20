// ==========================================
// InterviewIQ AI — Core Type Definitions
// ==========================================

// ---- User ----
export interface User {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experience: ExperienceLevel;
  createdAt: string;
  avatarColor: string;
}

export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior';

// ---- Resume ----
export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  atsScore: number;
  sections: ResumeSections;
  suggestions: ResumeSuggestion[];
  missingKeywords: string[];
  strengths: string[];
  uploadedAt: string;
  parsedData: ParsedResumeData;
}

export interface ResumeSections {
  education: SectionScore;
  projects: SectionScore;
  skills: SectionScore;
  experience: SectionScore;
  formatting: SectionScore;
  achievements: SectionScore;
}

export interface SectionScore {
  score: number;
  maxScore: number;
  feedback: string;
  items: string[];
}

export interface ResumeSuggestion {
  category: 'critical' | 'important' | 'nice-to-have';
  text: string;
  section: string;
}

export interface ParsedResumeData {
  name: string;
  email: string;
  skills: string[];
  education: string[];
  projects: ProjectInfo[];
  experience: ExperienceInfo[];
  certifications: string[];
}

export interface ProjectInfo {
  title: string;
  description: string;
  technologies: string[];
}

export interface ExperienceInfo {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

// ---- Interview ----
export interface Interview {
  id: string;
  userId: string;
  type: InterviewType;
  difficulty: DifficultyLevel;
  targetRole: string;
  messages: Message[];
  status: InterviewStatus;
  duration: number; // in minutes
  timeElapsed: number; // seconds elapsed
  startedAt: string;
  completedAt?: string;
  questionCount: number;
  currentQuestion: number;
}

export type InterviewType = 'technical' | 'hr' | 'behavioral' | 'mixed';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type InterviewStatus = 'setup' | 'active' | 'completed' | 'abandoned';

export interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  questionNumber?: number;
}

// ---- Feedback ----
export interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  interviewType: InterviewType;
  scores: FeedbackScores;
  strengths: string[];
  weaknesses: string[];
  suggestions: FeedbackSuggestion[];
  hireability: number; // 0-100
  detailedAnalysis: AnswerAnalysis[];
  generatedAt: string;
}

export interface FeedbackScores {
  technical: number;
  communication: number;
  problemSolving: number;
  behavioral: number;
  overall: number;
}

export interface FeedbackSuggestion {
  area: string;
  suggestion: string;
  resources: string[];
}

export interface AnswerAnalysis {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

// ---- Roadmap ----
export interface Roadmap {
  userId: string;
  weeks: RoadmapWeek[];
  generatedAt: string;
  targetRole: string;
  basedOn: string; // what generated it
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  tasks: RoadmapTask[];
  focusAreas: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  category: 'dsa' | 'resume' | 'interview' | 'theory' | 'project';
  completed: boolean;
  description: string;
  estimatedHours: number;
}

// ---- Analytics ----
export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  confidenceTrend: number[];
  strongestTopics: string[];
  weakestTopics: string[];
  atsImprovement: number;
  interviewHistory: InterviewHistoryItem[];
  scoreBreakdown: FeedbackScores;
}

export interface InterviewHistoryItem {
  id: string;
  date: string;
  type: InterviewType;
  score: number;
  duration: number;
}

// ---- DSA Tracker ----
export interface DSAProgress {
  userId: string;
  topics: DSATopic[];
  streak: number;
  totalSolved: number;
  lastSolvedAt: string;
  heatmapData: Record<string, number>; // date -> count
}

export interface DSATopic {
  name: string;
  solved: number;
  total: number;
  difficulty: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
}
