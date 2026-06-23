// ==========================================
// InterviewIQ AI — Backend API Client
// ==========================================
// Calls the Express backend instead of using
// local interview functions.
// ==========================================

import type {
  Resume, Feedback, Interview, Roadmap,
  InterviewType, DifficultyLevel,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiCall<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API call failed: ${res.status}`);
  }

  return res.json();
}

// ---- Resume Analysis ----

export async function analyzeResume(
  fileName: string,
  fileSize: number,
  targetRole: string,
  fileBase64?: string,
): Promise<Resume> {
  return apiCall<Resume>('/resume/analyze', { fileName, fileSize, targetRole, fileBase64 });
}

// ---- Interview Question Generation ----

export async function getNextQuestion(
  type: InterviewType,
  difficulty: DifficultyLevel,
  questionIndex: number,
  previousAnswer?: string,
  targetRole?: string,
): Promise<string> {
  const data = await apiCall<{ question: string }>('/interview/question', {
    type, difficulty, questionIndex, previousAnswer, targetRole,
  });
  return data.question;
}

export function getInterviewerReaction(answerLength: number): Promise<string> {
  return apiCall<{ reaction: string }>('/interview/reaction', { answerLength })
    .then(data => data.reaction);
}

export async function getInterviewGreeting(
  type: InterviewType,
  targetRole: string,
): Promise<string> {
  const data = await apiCall<{ greeting: string }>('/interview/greeting', { type, targetRole });
  return data.greeting;
}

// ---- Feedback Generation ----

export async function generateFeedback(interview: Interview): Promise<Feedback> {
  return apiCall<Feedback>('/feedback/generate', { interview });
}

// ---- Roadmap Generation ----

export async function generateRoadmap(
  targetRole: string,
  weakAreas: string[],
): Promise<Roadmap> {
  return apiCall<Roadmap>('/roadmap/generate', { targetRole, weakAreas });
}
