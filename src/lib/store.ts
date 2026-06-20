// ==========================================
// InterviewIQ AI — localStorage Store
// ==========================================
// A type-safe wrapper around localStorage.
// Designed as a drop-in abstraction — swap to
// API calls + database when ready.
// ==========================================

import type { User, Resume, Interview, Feedback, Roadmap } from './types';

const KEYS = {
  USER: 'interviewiq_user',
  RESUMES: 'interviewiq_resumes',
  INTERVIEWS: 'interviewiq_interviews',
  FEEDBACK: 'interviewiq_feedback',
  ROADMAP: 'interviewiq_roadmap',
} as const;

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// ---- User ----
export const userStore = {
  get: (): User | null => getItem<User>(KEYS.USER),
  set: (user: User): void => setItem(KEYS.USER, user),
  clear: (): void => {
    if (typeof window !== 'undefined') localStorage.removeItem(KEYS.USER);
  },
};

// ---- Resumes ----
export const resumeStore = {
  getAll: (): Resume[] => getItem<Resume[]>(KEYS.RESUMES) || [],
  getById: (id: string): Resume | undefined =>
    (getItem<Resume[]>(KEYS.RESUMES) || []).find(r => r.id === id),
  getLatest: (): Resume | undefined => {
    const all = getItem<Resume[]>(KEYS.RESUMES) || [];
    return all.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
  },
  add: (resume: Resume): void => {
    const all = getItem<Resume[]>(KEYS.RESUMES) || [];
    all.push(resume);
    setItem(KEYS.RESUMES, all);
  },
  update: (id: string, updates: Partial<Resume>): void => {
    const all = getItem<Resume[]>(KEYS.RESUMES) || [];
    const index = all.findIndex(r => r.id === id);
    if (index >= 0) {
      all[index] = { ...all[index], ...updates };
      setItem(KEYS.RESUMES, all);
    }
  },
};

// ---- Interviews ----
export const interviewStore = {
  getAll: (): Interview[] => getItem<Interview[]>(KEYS.INTERVIEWS) || [],
  getById: (id: string): Interview | undefined =>
    (getItem<Interview[]>(KEYS.INTERVIEWS) || []).find(i => i.id === id),
  add: (interview: Interview): void => {
    const all = getItem<Interview[]>(KEYS.INTERVIEWS) || [];
    all.push(interview);
    setItem(KEYS.INTERVIEWS, all);
  },
  update: (id: string, updates: Partial<Interview>): void => {
    const all = getItem<Interview[]>(KEYS.INTERVIEWS) || [];
    const index = all.findIndex(i => i.id === id);
    if (index >= 0) {
      all[index] = { ...all[index], ...updates };
      setItem(KEYS.INTERVIEWS, all);
    }
  },
  getCompleted: (): Interview[] =>
    (getItem<Interview[]>(KEYS.INTERVIEWS) || []).filter(i => i.status === 'completed'),
};

// ---- Feedback ----
export const feedbackStore = {
  getAll: (): Feedback[] => getItem<Feedback[]>(KEYS.FEEDBACK) || [],
  getById: (id: string): Feedback | undefined =>
    (getItem<Feedback[]>(KEYS.FEEDBACK) || []).find(f => f.id === id),
  getByInterviewId: (interviewId: string): Feedback | undefined =>
    (getItem<Feedback[]>(KEYS.FEEDBACK) || []).find(f => f.interviewId === interviewId),
  add: (feedback: Feedback): void => {
    const all = getItem<Feedback[]>(KEYS.FEEDBACK) || [];
    all.push(feedback);
    setItem(KEYS.FEEDBACK, all);
  },
};

// ---- Roadmap ----
export const roadmapStore = {
  get: (): Roadmap | null => getItem<Roadmap>(KEYS.ROADMAP),
  set: (roadmap: Roadmap): void => setItem(KEYS.ROADMAP, roadmap),
  updateTask: (weekNumber: number, taskId: string, completed: boolean): void => {
    const roadmap = getItem<Roadmap>(KEYS.ROADMAP);
    if (!roadmap) return;
    const week = roadmap.weeks.find(w => w.weekNumber === weekNumber);
    if (!week) return;
    const task = week.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      setItem(KEYS.ROADMAP, roadmap);
    }
  },
};

// ---- Clear All ----
export function clearAllData(): void {
  Object.values(KEYS).forEach(key => {
    if (typeof window !== 'undefined') localStorage.removeItem(key);
  });
}
