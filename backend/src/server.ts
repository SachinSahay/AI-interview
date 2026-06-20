// ==========================================
// InterviewIQ AI — Express Server
// ==========================================

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ---- Routes ----
app.use('/api', apiRoutes);

// ---- Root ----
app.get('/', (_req, res) => {
  res.json({
    name: 'InterviewIQ AI Backend',
    version: '0.1.0',
    endpoints: {
      health: 'GET /api/health',
      resumeAnalyze: 'POST /api/resume/analyze',
      interviewQuestion: 'POST /api/interview/question',
      interviewGreeting: 'POST /api/interview/greeting',
      interviewReaction: 'POST /api/interview/reaction',
      feedbackGenerate: 'POST /api/feedback/generate',
      roadmapGenerate: 'POST /api/roadmap/generate',
    },
  });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`\n🚀 InterviewIQ Backend running on http://localhost:${PORT}`);
  console.log(`📋 API docs at http://localhost:${PORT}/`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health\n`);
});

export default app;
