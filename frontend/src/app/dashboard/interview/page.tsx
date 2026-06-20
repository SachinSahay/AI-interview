'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { INTERVIEW_TYPES, DIFFICULTY_LEVELS, INTERVIEW_DURATIONS } from '@/lib/constants';
import { getInterviewGreeting } from '@/lib/mock-ai';
import { interviewStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import Link from 'next/link';
import type { InterviewType, DifficultyLevel, Interview } from '@/lib/types';

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [type, setType] = useState<InterviewType>('technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [duration, setDuration] = useState(30);
  const [starting, setStarting] = useState(false);

  const pastInterviews = interviewStore.getAll().filter(i => i.status === 'completed').slice(-5).reverse();

  const handleStart = async () => {
    if (!user) return;
    setStarting(true);

    const greeting = await getInterviewGreeting(type, user.targetRole);
    const interview: Interview = {
      id: generateId('int'),
      userId: user.id,
      type, difficulty,
      targetRole: user.targetRole,
      messages: [{
        id: generateId('msg'),
        role: 'interviewer',
        content: greeting,
        timestamp: new Date().toISOString(),
        questionNumber: 0,
      }],
      status: 'active',
      duration,
      timeElapsed: 0,
      startedAt: new Date().toISOString(),
      questionCount: Math.floor(duration / 3),
      currentQuestion: 0,
    };

    interviewStore.add(interview);
    router.push(`/dashboard/interview/${interview.id}`);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure and start an AI-powered practice interview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Setup Form */}
        <div className="card-static" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Interview Setup</h3>

          {/* Type */}
          <div style={{ marginBottom: 28 }}>
            <label className="label">Interview Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {INTERVIEW_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  style={{
                    padding: '16px 14px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                    border: `1px solid ${type === t.value ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    background: type === t.value ? 'var(--accent-primary-dim)' : 'var(--bg-input)',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                    color: type === t.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                  id={`type-${t.value}`}
                >
                  <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: 6 }}>{t.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: 28 }}>
            <label className="label">Difficulty Level</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {DIFFICULTY_LEVELS.map(d => (
                <button key={d.value} type="button" onClick={() => setDifficulty(d.value)}
                  className={`btn ${difficulty === d.value ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  id={`diff-${d.value}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 32 }}>
            <label className="label">Duration</label>
            <select className="input select" value={duration} onChange={e => setDuration(Number(e.target.value))} id="duration-select">
              {INTERVIEW_DURATIONS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleStart} disabled={starting} style={{ width: '100%' }} id="start-interview-btn">
            {starting ? (<><div className="spinner" /> Starting...</>) : '🎙️ Start Interview'}
          </button>
        </div>

        {/* Past Interviews */}
        <div>
          <div className="card-static" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Target Role</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <span style={{ fontWeight: 600 }}>{user?.targetRole || 'Software Engineer'}</span>
            </div>
          </div>

          <div className="card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Recent Interviews</h3>
            {pastInterviews.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No interviews yet. Start your first one!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pastInterviews.map(int => (
                  <Link key={int.id} href={`/dashboard/feedback`}
                    style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', fontSize: '0.85rem', transition: 'background 0.2s',
                    }}
                  >
                    <div>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{int.type}</span>
                      <span style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>{int.difficulty}</span>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                      {int.messages.filter(m => m.role === 'candidate').length} answers
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
