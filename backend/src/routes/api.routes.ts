// ==========================================
// InterviewIQ AI — API Routes
// ==========================================

import { Router, Request, Response } from 'express';
import {
  analyzeResume,
  getNextQuestion,
  getInterviewerReaction,
  getInterviewGreeting,
  generateFeedback,
  generateRoadmap,
} from '../services/ai.service';

const router = Router();

// ---- Health Check ----
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Resume Analysis ----
router.post('/resume/analyze', async (req: Request, res: Response) => {
  try {
    const { fileName, fileSize, targetRole } = req.body;

    if (!fileName || !fileSize || !targetRole) {
      res.status(400).json({ error: 'Missing required fields: fileName, fileSize, targetRole' });
      return;
    }

    const result = await analyzeResume(fileName, fileSize, targetRole);
    res.json(result);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// ---- Interview Questions ----
router.post('/interview/question', (req: Request, res: Response) => {
  try {
    const { type, difficulty, questionIndex, previousAnswer } = req.body;

    if (!type || !difficulty || questionIndex === undefined) {
      res.status(400).json({ error: 'Missing required fields: type, difficulty, questionIndex' });
      return;
    }

    const question = getNextQuestion(type, difficulty, questionIndex, previousAnswer);
    res.json({ question });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// ---- Interview Greeting ----
router.post('/interview/greeting', (req: Request, res: Response) => {
  try {
    const { type, targetRole } = req.body;

    if (!type || !targetRole) {
      res.status(400).json({ error: 'Missing required fields: type, targetRole' });
      return;
    }

    const greeting = getInterviewGreeting(type, targetRole);
    res.json({ greeting });
  } catch (error) {
    console.error('Greeting generation error:', error);
    res.status(500).json({ error: 'Failed to generate greeting' });
  }
});

// ---- Interviewer Reaction ----
router.post('/interview/reaction', (req: Request, res: Response) => {
  try {
    const { answerLength } = req.body;

    if (answerLength === undefined) {
      res.status(400).json({ error: 'Missing required field: answerLength' });
      return;
    }

    const reaction = getInterviewerReaction(answerLength);
    res.json({ reaction });
  } catch (error) {
    console.error('Reaction generation error:', error);
    res.status(500).json({ error: 'Failed to generate reaction' });
  }
});

// ---- Feedback Generation ----
router.post('/feedback/generate', async (req: Request, res: Response) => {
  try {
    const { interview } = req.body;

    if (!interview) {
      res.status(400).json({ error: 'Missing required field: interview' });
      return;
    }

    const result = await generateFeedback(interview);
    res.json(result);
  } catch (error) {
    console.error('Feedback generation error:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// ---- Roadmap Generation ----
router.post('/roadmap/generate', async (req: Request, res: Response) => {
  try {
    const { targetRole, weakAreas } = req.body;

    if (!targetRole) {
      res.status(400).json({ error: 'Missing required field: targetRole' });
      return;
    }

    const result = await generateRoadmap(targetRole, weakAreas || []);
    res.json(result);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

export default router;
