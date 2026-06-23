// ==========================================
// InterviewIQ AI — Gemini & Fallback AI Service
// ==========================================
// Integrates Gemini API for real resume analysis,
// adaptive questions, detailed feedback, and roadmaps.
// Falls back to mock logic if GEMINI_API_KEY is missing/invalid.
// ==========================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  Resume, Feedback, Interview, Roadmap,
  InterviewType, DifficultyLevel, FeedbackScores,
  ResumeSuggestion, RoadmapWeek, Message,
} from '../lib/types';
import {
  TECHNICAL_QUESTIONS,
  HR_QUESTIONS,
  BEHAVIORAL_QUESTIONS,
  FOLLOW_UP_PROMPTS,
  INTERVIEWER_REACTIONS,
  ROLE_KEYWORDS,
} from '../lib/constants';
import { generateId, delay, clampScore, shuffleArray } from '../lib/utils';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('\n⚠️ [Warning] GEMINI_API_KEY is not defined in the backend environment. Running in mock/offline mode.\n');
}
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// ---- Resume Analysis ----

export async function analyzeResume(
  fileName: string,
  fileSize: number,
  targetRole: string,
  fileBase64?: string,
): Promise<Resume> {
  if (genAI) {
    try {
      console.log(`[Gemini] Starting resume analysis for role: ${targetRole}...`);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const contentParts: any[] = [];

      if (fileBase64) {
        contentParts.push({
          inlineData: {
            data: fileBase64,
            mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
          }
        });
      }

      contentParts.push(
        `Analyze the attached resume for the target role: "${targetRole}".
        Provide a complete ATS evaluation and parsing in JSON format. The response MUST strictly follow this JSON schema:
        {
          "atsScore": number (0 to 100),
          "sections": {
            "education": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] },
            "projects": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] },
            "skills": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] },
            "experience": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] },
            "formatting": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] },
            "achievements": { "score": number, "maxScore": 100, "feedback": "string", "items": ["string"] }
          },
          "suggestions": [
            { "category": "critical" | "important" | "nice-to-have", "text": "string", "section": "string" }
          ],
          "missingKeywords": ["string"],
          "strengths": ["string"],
          "parsedData": {
            "name": "string",
            "email": "string",
            "skills": ["string"],
            "education": ["string"],
            "projects": [
              { "title": "string", "description": "string", "technologies": ["string"] }
            ],
            "experience": [
              { "role": "string", "company": "string", "duration": "string", "highlights": ["string"] }
            ],
            "certifications": ["string"]
          }
        }
        
        Ensure you extract accurate information from the resume. If sections are missing or empty, give them appropriate lower scores and actionable feedback. Return only valid JSON.`
      );

      const response = await model.generateContent(contentParts);
      const text = response.response.text();
      const data = JSON.parse(text);

      return {
        id: generateId('resume'),
        userId: 'current',
        fileName,
        fileSize,
        atsScore: data.atsScore || 70,
        sections: data.sections || {},
        suggestions: data.suggestions || [],
        missingKeywords: data.missingKeywords || [],
        strengths: data.strengths || [],
        uploadedAt: new Date().toISOString(),
        parsedData: data.parsedData || {
          name: 'Candidate',
          email: 'candidate@email.com',
          skills: [],
          education: [],
          projects: [],
          experience: [],
          certifications: [],
        },
      };
    } catch (error) {
      console.error('[Gemini] Resume Analysis failed, falling back to mock:', error);
    }
  }

  // ---- Mock Resume Fallback ----
  console.log('[Mock] Analyzing resume (fallback)...');
  await delay(2000 + Math.random() * 1500);

  const roleKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Engineer'];
  const presentKeywords = roleKeywords.slice(0, Math.floor(roleKeywords.length * 0.6));
  const missingKeywords = roleKeywords.filter((k: string) => !presentKeywords.includes(k));

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

export async function getNextQuestion(
  type: InterviewType,
  difficulty: DifficultyLevel,
  questionIndex: number,
  previousAnswer?: string,
  targetRole: string = 'Software Engineer',
): Promise<string> {
  if (genAI) {
    try {
      console.log(`[Gemini] Generating question ${questionIndex + 1} for role ${targetRole} (${type}, ${difficulty})...`);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let prompt = `You are a professional AI interviewer conducting a ${type} mock interview for the role of "${targetRole}" at a ${difficulty} difficulty level.
      This is question number ${questionIndex + 1} of the interview.`;

      if (previousAnswer) {
        prompt += `\n\nThe candidate just answered the previous question with:
        "${previousAnswer}"
        
        Acknowledge their answer briefly (keep your response natural, conversational, and aligned with ${difficulty} difficulty) and then ask the next relevant question. You can ask a follow-up question if their answer was incomplete or interesting, or transition to a new relevant topic.`;
      } else {
        prompt += `\n\nAsk the first question of the interview. Make sure the question is appropriate for a "${targetRole}" role, ${type} round, and "${difficulty}" level.`;
      }

      prompt += `\n\nRemember:
      - Only output the interviewer's direct spoken response (do not output tags like "Interviewer:", "AI:", etc.).
      - Keep it professional, conversational, and direct.`;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error('[Gemini] getNextQuestion failed, falling back to mock:', error);
    }
  }

  // ---- Mock Question Fallback ----
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

export async function getInterviewerReaction(answerLength: number): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a very short, natural verbal reaction an interviewer might have after hearing an answer of length ${answerLength} characters (which is a ${answerLength > 200 ? 'good detailed' : answerLength > 50 ? 'medium' : 'short'} answer).
      Examples: "Interesting point.", "Makes sense.", "Thanks for explaining that.", "Got it."
      Keep it to 1 sentence or a short phrase max.
      Only output the phrase itself.`;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error('[Gemini] getInterviewerReaction failed, falling back to mock:', error);
    }
  }

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

export async function getInterviewGreeting(type: InterviewType, targetRole: string): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an interviewer greeting a candidate for a mock interview.
      Role: ${targetRole}
      Interview Type: ${type} round
      
      Generate a professional, welcoming greeting explaining what the round will focus on, and ask them if they are ready or present the first prompt. Keep it short (2-3 sentences max).
      Only output the spoken greeting directly. Do not include markdown or prefix.`;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error('[Gemini] getInterviewGreeting failed, falling back to mock:', error);
    }
  }

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
  if (genAI) {
    try {
      console.log(`[Gemini] Generating feedback for interview ${interview.id}...`);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const transcript = interview.messages.map((m: Message) => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');

      const prompt = `You are a senior technical recruiter and career coach. Review this transcript of a candidate's mock interview and provide detailed feedback in JSON format.
      
      Target Role: ${interview.targetRole}
      Difficulty: ${interview.difficulty}
      Type: ${interview.type}
      
      Transcript:
      ${transcript}
      
      Provide your analysis in the following JSON format:
      {
        "scores": {
          "technical": number (0 to 100),
          "communication": number (0 to 100),
          "problemSolving": number (0 to 100),
          "behavioral": number (0 to 100),
          "overall": number (0 to 100)
        },
        "strengths": ["string"],
        "weaknesses": ["string"],
        "suggestions": [
          { "area": "string", "suggestion": "string", "resources": ["string"] }
        ],
        "hireability": number (0 to 100),
        "detailedAnalysis": [
          {
            "question": "string",
            "answer": "string",
            "score": number (0 to 100),
            "feedback": "string"
          }
        ]
      }
      
      Be objective and construct constructive criticism. Highlight exact areas where technical definitions were weak or communication can be improved (e.g., using STAR method).`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const data = JSON.parse(text);

      return {
        id: generateId('feedback'),
        interviewId: interview.id,
        userId: interview.userId,
        interviewType: interview.type,
        scores: data.scores || { technical: 70, communication: 70, problemSolving: 70, behavioral: 70, overall: 70 },
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        suggestions: data.suggestions || [],
        hireability: data.hireability || 70,
        detailedAnalysis: data.detailedAnalysis || [],
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Gemini] generateFeedback failed, falling back to mock:', error);
    }
  }

  // ---- Mock Feedback Fallback ----
  await delay(1500 + Math.random() * 1000);

  const candidateMessages = interview.messages.filter((m: Message) => m.role === 'candidate');
  const avgAnswerLength = candidateMessages.reduce((sum: number, m: Message) => sum + m.content.length, 0) / (candidateMessages.length || 1);

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

  const detailedAnalysis = candidateMessages.slice(0, 5).map((msg: Message, i: number) => {
    const interviewerMsg = interview.messages.find(
      (m: Message) => m.role === 'interviewer' && m.questionNumber === (msg.questionNumber || i + 1)
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
  if (genAI) {
    try {
      console.log(`[Gemini] Generating preparation roadmap for role ${targetRole}...`);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `You are a career development assistant. Create a personalized 4-week preparation roadmap for a candidate targetting the role of "${targetRole}".
      
      Weak areas identified for this candidate:
      ${weakAreas.map(w => `- ${w}`).join('\n')}
      
      The response must be in JSON format matching the following schema:
      {
        "weeks": [
          {
            "weekNumber": number (1 to 4),
            "title": "string",
            "focusAreas": ["string"],
            "focusAreas": ["string"],
            "tasks": [
              {
                "title": "string",
                "category": "dsa" | "resume" | "interview" | "theory" | "project",
                "description": "string",
                "estimatedHours": number
              }
            ]
          }
        ]
      }
      
      Provide exactly 4 weeks. For each week, provide 3-5 concrete tasks. Include study tasks on theoretical topics, coding challenges (DSA), resume polish, and practicing mock interviews.`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const data = JSON.parse(text);

      const weeks = (data.weeks || []).map((week: any) => ({
        weekNumber: week.weekNumber,
        title: week.title,
        focusAreas: week.focusAreas || [],
        tasks: (week.tasks || []).map((task: any) => ({
          id: generateId('task'),
          title: task.title,
          category: task.category || 'theory',
          completed: false,
          description: task.description || '',
          estimatedHours: task.estimatedHours || 2,
        })),
      }));

      return {
        userId: 'current',
        weeks,
        generatedAt: new Date().toISOString(),
        targetRole,
        basedOn: 'Resume analysis + Interview performance',
      };
    } catch (error) {
      console.error('[Gemini] generateRoadmap failed, falling back to mock:', error);
    }
  }

  // ---- Mock Roadmap Fallback ----
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
