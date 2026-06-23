'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { interviewStore } from '@/lib/store';
import { getNextQuestion, getInterviewerReaction } from '@/lib/mock-ai';
import { generateId, formatTime, delay } from '@/lib/utils';
import type { Interview, Message } from '@/lib/types';

export default function InterviewSession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load interview
  useEffect(() => {
    const int = interviewStore.getById(id);
    if (!int) { router.push('/dashboard/interview'); return; }
    setInterview(int);
    setElapsed(int.timeElapsed);
  }, [id, router]);

  // Timer
  useEffect(() => {
    if (!interview || interview.status !== 'active') return;
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        interviewStore.update(id, { timeElapsed: next });
        if (next >= interview.duration * 60) {
          handleEndInterview();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview?.status]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interview?.messages]);

  const addMessage = (msg: Message) => {
    setInterview(prev => {
      if (!prev) return prev;
      const updated = { ...prev, messages: [...prev.messages, msg] };
      interviewStore.update(id, { messages: updated.messages, currentQuestion: updated.currentQuestion });
      return updated;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !interview || isTyping) return;
    const answer = input.trim();
    setInput('');

    // Add candidate message
    const candidateMsg: Message = {
      id: generateId('msg'),
      role: 'candidate',
      content: answer,
      timestamp: new Date().toISOString(),
      questionNumber: interview.currentQuestion,
    };
    addMessage(candidateMsg);

    // Check if interview should end
    const answeredCount = interview.messages.filter(m => m.role === 'candidate').length + 1;
    if (answeredCount >= interview.questionCount) {
      await delay(1000);
      const endMsg: Message = {
        id: generateId('msg'),
        role: 'interviewer',
        content: "That was a great interview! Thank you for your time. I've gathered enough information to provide you with detailed feedback. You can view your results in the Feedback section.",
        timestamp: new Date().toISOString(),
      };
      addMessage(endMsg);
      handleEndInterview();
      return;
    }

    // AI response
    setIsTyping(true);
    await delay(1200 + Math.random() * 1500);

    const reaction = await getInterviewerReaction(answer.length);
    const nextQ = await getNextQuestion(interview.type, interview.difficulty, answeredCount, answer, interview.targetRole);
    const nextQuestion = interview.currentQuestion + 1;

    const aiMsg: Message = {
      id: generateId('msg'),
      role: 'interviewer',
      content: `${reaction}\n\n${nextQ}`,
      timestamp: new Date().toISOString(),
      questionNumber: nextQuestion,
    };

    setInterview(prev => {
      if (!prev) return prev;
      const updated = { ...prev, messages: [...prev.messages, aiMsg], currentQuestion: nextQuestion };
      interviewStore.update(id, { messages: updated.messages, currentQuestion: nextQuestion });
      return updated;
    });
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleEndInterview = () => {
    interviewStore.update(id, { status: 'completed', completedAt: new Date().toISOString() });
    setInterview(prev => prev ? { ...prev, status: 'completed' } : prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!interview) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const isCompleted = interview.status === 'completed';
  const progress = Math.min(100, (elapsed / (interview.duration * 60)) * 100);

  return (
    <div style={{ margin: '-28px -32px', height: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{
        padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{interview.type}</span>
          <span className="badge badge-gold">{interview.difficulty}</span>
          {isCompleted && <span className="badge badge-green">Completed</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatTime(elapsed)}
            </div>
            <div className="progress-bar" style={{ width: 120, height: 3, marginTop: 4 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          {!isCompleted && (
            <button className="btn btn-danger btn-sm" onClick={handleEndInterview} id="end-interview-btn">
              End Interview
            </button>
          )}
          {isCompleted && (
            <button className="btn btn-primary btn-sm" onClick={() => router.push('/dashboard/feedback')} id="view-feedback-btn">
              View Feedback →
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {interview.messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.role === 'interviewer' ? 'chat-bubble-interviewer' : 'chat-bubble-candidate'}`}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: 6, fontWeight: 600 }}>
              {msg.role === 'interviewer' ? '🤖 AI Interviewer' : '👤 You'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble-interviewer">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: 6, fontWeight: 600 }}>
              🤖 AI Interviewer
            </div>
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isCompleted && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <textarea
              ref={inputRef}
              className="input"
              style={{ minHeight: 48, maxHeight: 120, resize: 'none' }}
              placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              id="interview-input"
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{ alignSelf: 'flex-end' }}
              id="send-btn"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
