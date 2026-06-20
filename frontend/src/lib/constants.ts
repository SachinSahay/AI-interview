// ==========================================
// InterviewIQ AI — Application Constants
// ==========================================

import type { InterviewType, DifficultyLevel } from './types';

// ---- Target Roles ----
export const TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Product Manager',
  'Data Analyst',
  'Mobile Developer',
  'QA Engineer',
] as const;

// ---- Experience Levels ----
export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0-1 years)', icon: '🎓' },
  { value: 'junior', label: 'Junior (1-3 years)', icon: '💼' },
  { value: 'mid', label: 'Mid-Level (3-6 years)', icon: '🚀' },
  { value: 'senior', label: 'Senior (6+ years)', icon: '⭐' },
] as const;

// ---- Interview Types ----
export const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string; icon: string }[] = [
  { value: 'technical', label: 'Technical', description: 'DSA, System Design, CS fundamentals', icon: '💻' },
  { value: 'hr', label: 'HR Round', description: 'Behavioral, cultural fit, salary', icon: '🤝' },
  { value: 'behavioral', label: 'Behavioral', description: 'STAR method, leadership, teamwork', icon: '🧠' },
  { value: 'mixed', label: 'Mixed Round', description: 'Combination of all categories', icon: '🎯' },
];

// ---- Difficulty Levels ----
export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'var(--accent-success)' },
  { value: 'medium', label: 'Medium', color: 'var(--accent-gold)' },
  { value: 'hard', label: 'Hard', color: 'var(--accent-warm)' },
];

// ---- Interview Durations ----
export const INTERVIEW_DURATIONS = [
  { value: 15, label: '15 min — Quick Practice' },
  { value: 30, label: '30 min — Standard Round' },
  { value: 45, label: '45 min — Extended Session' },
  { value: 60, label: '60 min — Full Interview' },
];

// ---- Question Banks ----
export const TECHNICAL_QUESTIONS = {
  easy: [
    'What is the difference between an array and a linked list?',
    'Explain the concept of time complexity. What is Big O notation?',
    'What is the difference between a stack and a queue?',
    'What is a hash table and how does it work?',
    'Explain the difference between SQL and NoSQL databases.',
    'What is the difference between HTTP and HTTPS?',
    'What are the four pillars of Object-Oriented Programming?',
    'What is the difference between TCP and UDP?',
    'Explain what an API is and how REST APIs work.',
    'What is the difference between a process and a thread?',
  ],
  medium: [
    'How would you design a URL shortening service like bit.ly?',
    'Explain the concept of dynamic programming. When would you use it?',
    'What is the difference between BFS and DFS? When would you use each?',
    'How does a load balancer work? What algorithms can it use?',
    'Explain the CAP theorem and its implications for distributed systems.',
    'What is the difference between horizontal and vertical scaling?',
    'How would you optimize a slow SQL query?',
    'Explain the concept of caching. What strategies exist?',
    'What is a deadlock? How can you prevent it?',
    'Explain microservices architecture vs monolithic architecture.',
  ],
  hard: [
    'Design a real-time messaging system like WhatsApp. Walk me through the architecture.',
    'How would you design a rate limiter for an API?',
    'Explain the Raft consensus algorithm and its use in distributed systems.',
    'How would you design a recommendation system for an e-commerce platform?',
    'Explain the trade-offs between consistency and availability in distributed databases.',
    'How would you design a system to handle millions of concurrent WebSocket connections?',
    'Explain the internals of a B+ tree and why databases use it.',
    'How would you design a distributed task queue system?',
  ],
};

export const HR_QUESTIONS = [
  'Tell me about yourself and your background.',
  'Why are you interested in this role?',
  'What are your greatest strengths and weaknesses?',
  'Where do you see yourself in 5 years?',
  'Why should we hire you over other candidates?',
  'Tell me about a time you handled a conflict at work.',
  'How do you handle pressure and tight deadlines?',
  'What motivates you in your career?',
  'Tell me about a time you failed and what you learned.',
  'Do you have any questions for us?',
  'What is your expected salary range?',
  'Tell me about a project you are most proud of.',
  'How do you stay updated with new technologies?',
  'Describe your ideal work environment.',
  'How do you prioritize tasks when you have multiple deadlines?',
];

export const BEHAVIORAL_QUESTIONS = [
  'Describe a situation where you had to lead a team through a challenging project.',
  'Tell me about a time you had to learn something new quickly.',
  'Give an example of how you handled a disagreement with a teammate.',
  'Describe a time when you went above and beyond at work.',
  'Tell me about a time you had to make a difficult decision with limited information.',
  'How did you handle a situation where you received critical feedback?',
  'Describe a time you had to adapt to a significant change.',
  'Tell me about a time you identified and solved a problem before anyone asked.',
  'Give an example of a time you had to persuade others to see your point of view.',
  'Describe a situation where you had to balance multiple priorities.',
];

// ---- Resume Keywords by Role ----
export const ROLE_KEYWORDS: Record<string, string[]> = {
  'Software Engineer': [
    'algorithms', 'data structures', 'system design', 'API', 'REST', 'microservices',
    'CI/CD', 'Git', 'agile', 'testing', 'debugging', 'performance', 'scalability',
  ],
  'Frontend Developer': [
    'React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'responsive design',
    'accessibility', 'webpack', 'performance', 'UI/UX', 'REST API', 'state management',
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'Java', 'database', 'SQL', 'API design', 'microservices',
    'Docker', 'AWS', 'caching', 'message queues', 'security', 'authentication',
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'database', 'API', 'deployment', 'Docker', 'TypeScript',
    'responsive', 'authentication', 'testing', 'CI/CD', 'cloud',
  ],
  'Data Scientist': [
    'Python', 'machine learning', 'deep learning', 'statistics', 'TensorFlow',
    'PyTorch', 'data visualization', 'SQL', 'pandas', 'scikit-learn', 'NLP',
  ],
  'ML Engineer': [
    'machine learning', 'deep learning', 'MLOps', 'TensorFlow', 'PyTorch',
    'model deployment', 'data pipeline', 'feature engineering', 'A/B testing',
  ],
};

// ---- Sidebar Navigation ----
export const SIDEBAR_NAV = [
  { href: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { href: '/dashboard/resume', label: 'Resume', icon: 'resume' },
  { href: '/dashboard/interview', label: 'Interview', icon: 'interview' },
  { href: '/dashboard/feedback', label: 'Feedback', icon: 'feedback' },
  { href: '/dashboard/dsa', label: 'DSA Tracker', icon: 'dsa' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: 'roadmap' },
] as const;

// ---- Follow-up Prompts ----
export const FOLLOW_UP_PROMPTS = [
  'Can you elaborate on that? What specific approach would you take?',
  'Interesting. What are the trade-offs of that approach?',
  'How would you handle edge cases in that scenario?',
  'Can you give me a concrete example from your experience?',
  'What would be the time and space complexity of your solution?',
  'How would you test this? What test cases would you consider?',
  'What alternative approaches did you consider?',
  'How would this scale to handle millions of users?',
  'What would you do differently if you had more time?',
  'Can you walk me through the implementation step by step?',
];

// ---- Interviewer Reactions ----
export const INTERVIEWER_REACTIONS = {
  positive: [
    'Great answer! Let me ask you a follow-up.',
    'That\'s a solid approach. Let\'s dive deeper.',
    'Good thinking. Now, consider this scenario...',
    'Well explained. Moving on to the next topic.',
    'Excellent! You clearly have experience with this.',
  ],
  neutral: [
    'Okay, let\'s explore that further.',
    'I see. Can you elaborate a bit more?',
    'Alright. Let me ask you about something related.',
    'Understood. Let\'s move to the next question.',
  ],
  negative: [
    'Hmm, that\'s partially correct. Can you think about it from another angle?',
    'I think you might be missing something. Let me rephrase the question.',
    'That\'s not quite what I was looking for. Can you reconsider?',
    'Let me give you a hint — think about the edge cases.',
  ],
};
