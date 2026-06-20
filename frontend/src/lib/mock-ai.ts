// ==========================================
// InterviewIQ AI — Mock AI Service
// ==========================================
// Simulates AI responses for all features.
// Replace individual functions with real API
// calls when backend is ready.
// ==========================================

import type {
  Resume, Feedback, Interview, Roadmap,
  InterviewType, DifficultyLevel, FeedbackScores,
  ResumeSuggestion, RoadmapWeek,
} from './types';
import {
  TECHNICAL_QUESTIONS,
  HR_QUESTIONS,
  BEHAVIORAL_QUESTIONS,
  FOLLOW_UP_PROMPTS,
  INTERVIEWER_REACTIONS,
  ROLE_KEYWORDS,
} from './constants';
import { generateId, delay } from './utils';

// ---- Resume Analysis ----

export async function analyzeResume(
  fileName: string,
  fileSize: number,
  targetRole: string,
): Promise<Resume> {
  // Simulate AI processing time
  await delay(2000 + Math.random() * 1500);

  const roleKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Engineer'];
  const presentKeywords = roleKeywords.slice(0, Math.floor(roleKeywords.length * 0.6));
  const missingKeywords = roleKeywords.filter(k => !presentKeywords.includes(k));

  const sectionScores = {
    education: {
      score: 70 + Math.floor(Math.random() * 25),
      maxScore: 100,
      feedback: 'Education section is well structured. Consider adding relevant coursework.',
      items: ['B.Tech Computer Science — XYZ University (2022-2026)', 'CGPA: 8.5/10'],
    },
    projects: {
      score: 55 + Math.floor(Math.random() * 30),
      maxScore: 100,
      feedback: 'Projects need more quantified impact metrics and technology details.',
      items: ['E-Commerce Platform', 'Chat Application', 'Portfolio Website'],
    },
    skills: {
      score: 60 + Math.floor(Math.random() * 30),
      maxScore: 100,
      feedback: `Good skill coverage. Missing some key skills for ${targetRole} role.`,
      items: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    },
    experience: {
      score: 45 + Math.floor(Math.random() * 35),
      maxScore: 100,
      feedback: 'Experience section could use stronger action verbs and measurable results.',
      items: ['Intern at TechCorp (3 months)', 'Freelance Web Developer'],
    },
    formatting: {
      score: 75 + Math.floor(Math.random() * 20),
      maxScore: 100,
      feedback: 'Clean formatting. Consider using consistent bullet point styles.',
      items: ['PDF format ✓', 'Single page ✓', 'Professional layout ✓'],
    },
    achievements: {
      score: 40 + Math.floor(Math.random() * 30),
      maxScore: 100,
      feedback: 'Add more measurable achievements. Use numbers and percentages.',
      items: ['Hackathon participant', 'Open source contributor'],
    },
  };

  const avgScore = Math.round(
    Object.values(sectionScores).reduce((sum, s) => sum + s.score, 0) /
    Object.keys(sectionScores).length
  );

  const suggestions: ResumeSuggestion[] = [
    {
      category: 'critical',
      text: 'Add measurable impact metrics to your project descriptions (e.g., "Reduced load time by 40%")',
      section: 'projects',
    },
    {
      category: 'critical',
      text: `Add missing keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
      section: 'skills',
    },
    {
      category: 'important',
      text: 'Use stronger action verbs: "Engineered", "Architected", "Optimized" instead of "Made", "Did", "Worked on"',
      section: 'experience',
    },
    {
      category: 'important',
      text: 'Add links to deployed projects and GitHub repositories',
      section: 'projects',
    },
    {
      category: 'nice-to-have',
      text: 'Add relevant certifications (AWS, Google Cloud, etc.)',
      section: 'skills',
    },
    {
      category: 'nice-to-have',
      text: 'Include a brief professional summary at the top',
      section: 'formatting',
    },
  ];

  return {
    id: generateId('resume'),
    userId: 'current',
    fileName,
    fileSize,
    atsScore: avgScore,
    sections: sectionScores,
    suggestions,
    missingKeywords,
    strengths: [
      'Clean and professional formatting',
      'Good educational background',
      'Relevant technical skills listed',
      'Multiple project experiences',
    ],
    uploadedAt: new Date().toISOString(),
    parsedData: {
      name: 'Candidate',
      email: 'candidate@email.com',
      skills: presentKeywords,
      education: sectionScores.education.items,
      projects: [
        {
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce application',
          technologies: ['React', 'Node.js', 'MongoDB'],
        },
        {
          title: 'Chat Application',
          description: 'Real-time messaging application',
          technologies: ['React', 'Socket.io', 'Express'],
        },
      ],
      experience: [
        {
          role: 'Software Intern',
          company: 'TechCorp',
          duration: 'May 2025 - Aug 2025',
          highlights: ['Developed REST APIs', 'Improved test coverage'],
        },
      ],
      certifications: [],
    },
  };
}

// ---- Interview Question Generation ----

export function getNextQuestion(
  type: InterviewType,
  difficulty: DifficultyLevel,
  questionIndex: number,
  previousAnswer?: string,
): string {
  // Determine if we should ask a follow-up
  const shouldFollowUp = previousAnswer && previousAnswer.length < 100 && questionIndex > 0 && Math.random() > 0.5;

  if (shouldFollowUp) {
    return FOLLOW_UP_PROMPTS[Math.floor(Math.random() * FOLLOW_UP_PROMPTS.length)];
  }

  let questions: string[];

  switch (type) {
    case 'technical':
      questions = TECHNICAL_QUESTIONS[difficulty];
      break;
    case 'hr':
      questions = HR_QUESTIONS;
      break;
    case 'behavioral':
      questions = BEHAVIORAL_QUESTIONS;
      break;
    case 'mixed': {
      const allQuestions = [
        ...TECHNICAL_QUESTIONS[difficulty],
        ...HR_QUESTIONS,
        ...BEHAVIORAL_QUESTIONS,
      ];
      questions = allQuestions;
      break;
    }
    default:
      questions = TECHNICAL_QUESTIONS.medium;
  }

  return questions[questionIndex % questions.length];
}

export function getInterviewerReaction(answerLength: number): string {
  let category: 'positive' | 'neutral' | 'negative';

  if (answerLength > 200) {
    category = 'positive';
  } else if (answerLength > 50) {
    category = 'neutral';
  } else {
    category = 'negative';
  }

  const reactions = INTERVIEWER_REACTIONS[category];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

export function getInterviewGreeting(type: InterviewType, targetRole: string): string {
  const greetings: Record<InterviewType, string> = {
    technical: `Hello! I'll be your technical interviewer today. We'll be discussing topics relevant to the ${targetRole} role. Let's begin with some fundamental concepts and work our way up. Ready?`,
    hr: `Hi there! Welcome to your HR interview for the ${targetRole} position. I'd love to learn more about you, your experiences, and what drives you. Let's start — tell me about yourself.`,
    behavioral: `Good day! I'm here to understand how you handle real-world situations. We'll go through some behavioral scenarios relevant to the ${targetRole} role. Think of specific examples from your experience. Let's begin.`,
    mixed: `Welcome to your comprehensive interview for the ${targetRole} position! We'll cover technical concepts, behavioral scenarios, and get to know you better. Let's dive right in.`,
  };

  return greetings[type];
}

// ---- Feedback Generation ----

export async function generateFeedback(interview: Interview): Promise<Feedback> {
  await delay(1500 + Math.random() * 1000);

  const candidateMessages = interview.messages.filter(m => m.role === 'candidate');
  const avgAnswerLength = candidateMessages.reduce((sum, m) => sum + m.content.length, 0) / (candidateMessages.length || 1);

  // Score based on answer quality heuristics
  const baseScore = Math.min(95, Math.max(30, Math.round(avgAnswerLength / 5 + Math.random() * 20)));

  const scores: FeedbackScores = {
    technical: clampScore(baseScore + Math.floor(Math.random() * 20) - 10),
    communication: clampScore(baseScore + Math.floor(Math.random() * 15) - 5),
    problemSolving: clampScore(baseScore + Math.floor(Math.random() * 20) - 10),
    behavioral: clampScore(baseScore + Math.floor(Math.random() * 15)),
    overall: 0,
  };

  scores.overall = Math.round(
    (scores.technical * 0.35 + scores.communication * 0.25 +
     scores.problemSolving * 0.25 + scores.behavioral * 0.15)
  );

  const hireability = clampScore(scores.overall - 5 + Math.floor(Math.random() * 10));

  const allStrengths = [
    'Clear communication of technical concepts',
    'Good problem-solving approach',
    'Well-structured answers with examples',
    'Strong understanding of fundamentals',
    'Confident and professional demeanor',
    'Good use of the STAR method',
    'Proactive in asking clarifying questions',
    'Demonstrated leadership qualities',
  ];

  const allWeaknesses = [
    'Could provide more specific examples',
    'Needs deeper knowledge of system design',
    'Answers could be more concise',
    'Should mention trade-offs more often',
    'Missing edge case analysis',
    'Could improve time complexity analysis',
    'Needs stronger behavioral examples',
    'Should quantify achievements more',
  ];

  const strengths = shuffleArray(allStrengths).slice(0, 3 + Math.floor(Math.random() * 2));
  const weaknesses = shuffleArray(allWeaknesses).slice(0, 2 + Math.floor(Math.random() * 2));

  const suggestions = [
    {
      area: 'Technical Skills',
      suggestion: 'Practice explaining your approach before coding. Interviewers value structured thinking.',
      resources: ['LeetCode Top 100', 'System Design Primer on GitHub'],
    },
    {
      area: 'Communication',
      suggestion: 'Use the STAR method for behavioral questions. Keep answers between 1-2 minutes.',
      resources: ['Interview communication guide', 'STAR method examples'],
    },
    {
      area: 'Problem Solving',
      suggestion: 'Always discuss trade-offs between different approaches. Consider time and space complexity.',
      resources: ['Algorithm visualization tools', 'Big-O cheat sheet'],
    },
  ];

  const detailedAnalysis = candidateMessages.slice(0, 5).map((msg, i) => {
    const interviewerMsg = interview.messages.find(
      m => m.role === 'interviewer' && m.questionNumber === (msg.questionNumber || i + 1)
    );
    return {
      question: interviewerMsg?.content || `Question ${i + 1}`,
      answer: msg.content,
      score: clampScore(50 + Math.floor(Math.random() * 40)),
      feedback: msg.content.length > 100
        ? 'Good detailed answer. Consider adding more specific examples.'
        : 'Answer was too brief. Expand with examples and trade-offs.',
    };
  });

  return {
    id: generateId('feedback'),
    interviewId: interview.id,
    userId: interview.userId,
    interviewType: interview.type,
    scores,
    strengths,
    weaknesses,
    suggestions,
    hireability,
    detailedAnalysis,
    generatedAt: new Date().toISOString(),
  };
}

// ---- Roadmap Generation ----

export async function generateRoadmap(
  targetRole: string,
  weakAreas: string[],
): Promise<Roadmap> {
  await delay(1500);

  const baseWeeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      title: 'Foundation & Resume',
      focusAreas: ['Resume Optimization', 'Core Fundamentals'],
      tasks: [
        { id: generateId('task'), title: 'Improve resume based on ATS feedback', category: 'resume', completed: false, description: 'Apply all critical suggestions from the ATS analyzer', estimatedHours: 2 },
        { id: generateId('task'), title: 'Arrays & Strings practice (10 problems)', category: 'dsa', completed: false, description: 'Focus on two-pointer and sliding window techniques', estimatedHours: 5 },
        { id: generateId('task'), title: 'Take an HR mock interview', category: 'interview', completed: false, description: 'Practice self-introduction and common HR questions', estimatedHours: 1 },
        { id: generateId('task'), title: 'Review OOP concepts', category: 'theory', completed: false, description: 'Encapsulation, Inheritance, Polymorphism, Abstraction', estimatedHours: 2 },
      ],
    },
    {
      weekNumber: 2,
      title: 'Data Structures Deep Dive',
      focusAreas: ['Linked Lists', 'Trees', 'Stacks & Queues'],
      tasks: [
        { id: generateId('task'), title: 'Linked List problems (8 problems)', category: 'dsa', completed: false, description: 'Reversal, cycle detection, merge operations', estimatedHours: 4 },
        { id: generateId('task'), title: 'Binary Tree traversals (6 problems)', category: 'dsa', completed: false, description: 'Inorder, preorder, postorder, level-order', estimatedHours: 4 },
        { id: generateId('task'), title: 'Take a Technical mock interview', category: 'interview', completed: false, description: 'Focus on DSA and problem-solving approach', estimatedHours: 1 },
        { id: generateId('task'), title: 'Review DBMS fundamentals', category: 'theory', completed: false, description: 'Normalization, ACID, indexing, joins', estimatedHours: 3 },
      ],
    },
    {
      weekNumber: 3,
      title: 'Algorithms & System Design',
      focusAreas: ['Graphs', 'Dynamic Programming', 'System Design Basics'],
      tasks: [
        { id: generateId('task'), title: 'Graph problems (6 problems)', category: 'dsa', completed: false, description: 'BFS, DFS, shortest path, topological sort', estimatedHours: 5 },
        { id: generateId('task'), title: 'DP problems (5 problems)', category: 'dsa', completed: false, description: 'Fibonacci variants, knapsack, LCS, LIS', estimatedHours: 5 },
        { id: generateId('task'), title: 'System Design basics', category: 'theory', completed: false, description: 'Load balancing, caching, databases, message queues', estimatedHours: 3 },
        { id: generateId('task'), title: 'Build a small project', category: 'project', completed: false, description: `Build a project relevant to ${targetRole} role`, estimatedHours: 6 },
      ],
    },
    {
      weekNumber: 4,
      title: 'Interview Mastery',
      focusAreas: ['Mock Interviews', 'Behavioral Prep', 'Final Polish'],
      tasks: [
        { id: generateId('task'), title: 'Take 3 mixed mock interviews', category: 'interview', completed: false, description: 'Practice under timed conditions', estimatedHours: 3 },
        { id: generateId('task'), title: 'Prepare STAR stories (5 scenarios)', category: 'interview', completed: false, description: 'Leadership, conflict, failure, teamwork, initiative', estimatedHours: 2 },
        { id: generateId('task'), title: 'Review weak topics from feedback', category: 'theory', completed: false, description: `Focus on: ${weakAreas.slice(0, 3).join(', ') || 'areas identified in feedback'}`, estimatedHours: 4 },
        { id: generateId('task'), title: 'Final resume review', category: 'resume', completed: false, description: 'Ensure ATS score is above 80', estimatedHours: 1 },
      ],
    },
  ];

  return {
    userId: 'current',
    weeks: baseWeeks,
    generatedAt: new Date().toISOString(),
    targetRole,
    basedOn: 'Resume analysis + Interview performance',
  };
}

// ---- Helpers ----

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
